import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { summarizeNews } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { slugify, cleanHtml } from '@/lib/utils';

const RSS_SOURCES = [
  { url: 'https://www.aljazeera.net/sport/rss', name: 'Al Jazeera' },
  { url: 'https://feeds.bbci.co.uk/arabic/sport/rss.xml', name: 'BBC Arabic' },
  { url: 'https://www.skynewsarabia.com/rss/sport.xml', name: 'Sky News Sport' },
  { url: 'https://www.alarabiya.net/.mrss/ar/sport.xml', name: 'Al Arabiya' },
  { url: 'https://arabic.cnn.com/api/v1/rss/sport/rss.xml', name: 'CNN Arabic' },
  { url: 'https://www.filgoal.com/rss/world.xml', name: 'FilGoal' },
  { url: 'https://arabic.rt.com/rss/sport/', name: 'RT Arabic' },
  { url: 'https://www.shorouknews.com/rss/sport', name: 'Al Shorouk' },
];

const SPORTS_KEYWORDS = ['كرة', 'كورة', 'مباراة', 'لاعب', 'هدف', 'دوري', 'بطولة', 'نادي', 'منتخب', 'ملعب', 'اعتزال', 'تعاقد', 'انتقالات', 'المدرب', 'الفيفا', 'أبطال', 'مدريد', 'برشلونة', 'نيمار', 'ميسي', 'رونالدو', 'صلاح'];

function isSportsRelated(text: string): boolean {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return SPORTS_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

export async function GET() {
  try {
    // 1. Cleanup: Delete non-sports news or news with null slugs to fix 404 issues
    await supabase.from('news').delete().is('slug', null);
    
    let totalProcessed = 0;
    const processedItems: any[] = [];
    const parser = new Parser({
      customFields: {
        item: [['media:content', 'mediaContent', { keepArray: false }], ['enclosure', 'enclosure']],
      },
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 15000,
    });

    for (const source of RSS_SOURCES) {
      try {
        const feed = await parser.parseURL(source.url);
        const itemsToProcess = feed.items.slice(0, 8);

        for (const item of itemsToProcess) {
          const originalTitle = cleanHtml(item.title || '');
          const originalSummary = cleanHtml(item.contentSnippet || item.content || '');

          // STRICT FILTER: Sports only
          if (!isSportsRelated(originalTitle) && !isSportsRelated(originalSummary)) {
            continue;
          }

          const { data: existing } = await supabase.from('news').select('id').eq('title', originalTitle).single();
          if (existing) continue;

          let title = originalTitle;
          let summary = originalSummary;
          let isAiGenerated = false;

          // AI Summarization
          if (process.env.GEMINI_API_KEY) {
            try {
              const aiData = await summarizeNews(`${title}\n\n${summary}`);
              if (aiData.title) title = aiData.title;
              if (aiData.content) summary = aiData.content;
              isAiGenerated = true;
            } catch (e) { console.warn('Gemini fallback to direct RSS'); }
          }

          // Slug Generation (Crucial for 404 fix)
          let slug = slugify(title);
          const { data: slugCheck } = await supabase.from('news').select('id').eq('slug', slug).single();
          if (slugCheck) {
            slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
          }

          let imageUrl = item.enclosure?.url || item.mediaContent?.$.url;
          if (!imageUrl) {
            const imgMatch = (item.content || '').match(/<img[^>]+src="([^"]+)"/);
            if (imgMatch) imageUrl = imgMatch[1];
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
          await new Promise(r => setTimeout(r, 1000));
        }
      } catch (e) { console.error(`Source ${source.name} error:`, e); }
    }

    return NextResponse.json({ success: true, processedCount: totalProcessed, latest: processedItems });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
