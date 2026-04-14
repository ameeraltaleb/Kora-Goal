import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { summarizeNews } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

// User-Agent rotation to avoid blocking
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Googlebot/2.1 (+http://www.google.com/bot.html)',
];

// Verified working RSS feeds for Arabic sports news
const RSS_SOURCES = [
  { url: 'https://www.aljazeera.net/sport/rss', name: 'Al Jazeera Sport' },
  { url: 'https://feeds.bbci.co.uk/arabic/sport/rss.xml', name: 'BBC Arabic Sport' },
  { url: 'https://news.google.com/rss/search?q=كرة+قدم&hl=ar&gl=SA&ceid=SA:ar', name: 'Google News Arabic Football' },
];

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .replace(/[^\u0621-\u064A\u0660-\u06690-9a-zA-Z\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 80)
    + '-' + Date.now().toString(36);
}

// Categorize news automatically
function categorizeNews(title: string, content: string): string {
  const text = `${title} ${content}`.toLowerCase();
  if (/انتقال|صفقة|تعاقد|transfer|ينضم|يغادر|يوقع/.test(text)) return 'transfers';
  if (/تحليل|تكتيك|خطة|أداء|إحصائ/.test(text)) return 'analysis';
  if (/نتيجة|فوز|هزيمة|تعادل|هدف|أهداف/.test(text)) return 'results';
  return 'football';
}

export async function GET(request: Request) {
  try {
    let totalProcessed = 0;
    const errors: string[] = [];
    const successSources: string[] = [];

    for (const source of RSS_SOURCES) {
      try {
        const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

        const parser = new Parser({
          headers: {
            'User-Agent': userAgent,
            'Accept': 'application/rss+xml, application/xml;q=0.9, */*;q=0.8',
          },
          timeout: 10000,
        });

        const feed = await parser.parseURL(source.url);
        const itemsToProcess = feed.items.slice(0, 5);

        for (const item of itemsToProcess) {
          const title = item.title?.substring(0, 150) || '';

          if (!title) continue;

          // Check for duplicates
          const { data: existing } = await supabase
            .from('news')
            .select('id')
            .eq('title', title)
            .single();

          if (existing) continue;

          // AI summarization
          const rawText = `${item.title}\n\n${item.contentSnippet || item.content || ''}`;
          let summary = '';
          try {
            summary = await summarizeNews(rawText);
          } catch {
            summary = item.contentSnippet?.substring(0, 200) || '';
          }

          // Extract image
          let imageUrl = null;
          if (item.enclosure?.url) {
            imageUrl = item.enclosure.url;
          } else {
            const imgMatch = (item.content || '').match(/<img[^>]+src="([^"]+)"/);
            if (imgMatch) imageUrl = imgMatch[1];
          }

          const category = categorizeNews(title, item.contentSnippet || '');
          const slug = generateSlug(title);

          await supabase
            .from('news')
            .insert({
              title,
              summary,
              content: item.contentSnippet || item.content || '',
              image_url: imageUrl,
              category,
              is_ai_generated: true,
              source_url: item.link || null,
              source_name: source.name,
              slug,
              created_at: new Date().toISOString(),
            });

          totalProcessed++;

          // Small delay to avoid Gemini API rate limit
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        successSources.push(source.name);
      } catch (sourceError: any) {
        errors.push(`${source.name}: ${sourceError.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      processedCount: totalProcessed,
      successSources,
      errors: errors.length > 0 ? errors : undefined,
      totalSources: RSS_SOURCES.length,
      workingSources: successSources.length,
    });

  } catch (error: any) {
    console.error('Fetch News Cron Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
