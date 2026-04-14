import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { summarizeNews } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

// Verified working RSS feeds for Arabic sports news
const RSS_SOURCES = [
  { url: 'https://www.aljazeera.net/sport/rss', name: 'Al Jazeera Sport' },
  { url: 'https://feeds.bbci.co.uk/arabic/sport/rss.xml', name: 'BBC Arabic Sport' },
  { url: 'https://news.google.com/rss/search?q=كرة+قدم&hl=ar&gl=SA&ceid=SA:ar', name: 'Google News Arabic Football' },
];

// User-Agent rotation
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
];

export async function GET() {
  try {
    let totalProcessed = 0;
    const errors: string[] = [];
    const successSources: string[] = [];
    const processedItems: any[] = [];

    for (const source of RSS_SOURCES) {
      try {
        const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

        const parser = new Parser({
          headers: {
            'User-Agent': userAgent,
            'Accept': 'application/rss+xml, application/xml;q=0.9, */*;q=0.8',
          },
          timeout: 15000,
        });

        const feed = await parser.parseURL(source.url);

        if (!feed.items || feed.items.length === 0) {
          errors.push(`${source.name}: Empty feed`);
          continue;
        }

        const itemsToProcess = feed.items.slice(0, 3); // Reduced to prevent Gemini Rate Limit (429)

        for (const item of itemsToProcess) {
          let title = item.title?.substring(0, 150) || '';
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
            const aiData = await summarizeNews(rawText);
            if (aiData.title) title = aiData.title; // Update with AI catchy title
            summary = aiData.content || '';
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

          processedItems.push({ title, summary, source: source.name });

          await supabase.from('news').insert({
            title,
            summary,
            content: item.contentSnippet || item.content || '',
            image_url: imageUrl,
            category: 'football',
            is_ai_generated: true,
            source_url: item.link || null,
            source_name: source.name,
            created_at: new Date().toISOString(),
          });

          totalProcessed++;
          await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds delay for API quota
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
      latestNews: processedItems,
    });

  } catch (error: any) {
    console.error('Fetch External News Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
