import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { summarizeNews } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { slugify, cleanHtml } from '@/lib/utils';

const RSS_SOURCES = [
  { url: 'https://www.aljazeera.net/sport/rss', name: 'Al Jazeera Sport' },
  { url: 'https://feeds.bbci.co.uk/arabic/sport/rss.xml', name: 'BBC Arabic Sport' },
  { url: 'https://news.google.com/rss/search?q=كرة+قدم&hl=ar&gl=SA&ceid=SA:ar', name: 'Google News Arabic Football' },
];

const GEMINI_KEY = (process.env.GEMINI_API_KEY || '').trim();

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
];

export async function GET() {
  try {
    let totalProcessed = 0;
    const processedItems: any[] = [];

    const parser = new Parser({
      customFields: {
        item: [['media:content', 'mediaContent', { keepArray: false }], ['enclosure', 'enclosure']],
      },
      headers: { 'User-Agent': USER_AGENTS[0] },
      timeout: 15000,
    });

    for (const source of RSS_SOURCES) {
      try {
        const feed = await parser.parseURL(source.url);
        const itemsToProcess = feed.items.slice(0, 5);

        for (const item of itemsToProcess) {
          const originalTitle = cleanHtml(item.title || '');
          if (!originalTitle) continue;

          // Check duplicate
          const { data: existing } = await supabase
            .from('news')
            .select('id')
            .eq('title', originalTitle)
            .single();
          if (existing) continue;

          let title = originalTitle;
          let summary = cleanHtml(item.contentSnippet || item.content || '');
          let isAiGenerated = false;

          // Hybrid AI Logic
          if (GEMINI_KEY) {
            try {
              const rawText = `${item.title}\n\n${item.contentSnippet || item.content || ''}`;
              const aiData = await summarizeNews(rawText);
              if (aiData.title) title = aiData.title;
              if (aiData.content) summary = aiData.content;
              isAiGenerated = true;
            } catch (aiErr) {
              console.warn(`Gemini failed for item, using direct RSS: ${aiErr}`);
            }
          }

          // Image Extraction
          let imageUrl = null;
          if (item.enclosure?.url) imageUrl = item.enclosure.url;
          else if (item.mediaContent?.$.url) imageUrl = item.mediaContent.$.url;
          else {
            const imgMatch = (item.content || '').match(/<img[^>]+src="([^"]+)"/);
            if (imgMatch) imageUrl = imgMatch[1];
          }

          // Slug Generation
          let slug = slugify(title);
          const { data: slugCheck } = await supabase.from('news').select('id').eq('slug', slug).single();
          if (slugCheck) {
            slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
          }

          await supabase.from('news').insert({
            title,
            summary: summary.substring(0, 500),
            content: cleanHtml(item.content || item.contentSnippet || ''),
            image_url: imageUrl,
            category: 'football',
            is_ai_generated: isAiGenerated,
            source_url: item.link || null,
            source_name: source.name,
            slug,
            created_at: new Date().toISOString(),
          });

          totalProcessed++;
          processedItems.push({ title, slug });
          await new Promise(r => setTimeout(r, 2000));
        }
      } catch (e) { console.error(`Source error ${source.name}:`, e); }
    }

    return NextResponse.json({ success: true, processedCount: totalProcessed, latest: processedItems });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
