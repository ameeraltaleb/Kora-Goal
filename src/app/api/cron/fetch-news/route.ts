import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { summarizeNews } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/rss+xml, application/xml;q=0.9, */*;q=0.8'
  }
});

// مصادر RSS متعددة
const RSS_SOURCES = [
  { url: 'https://arabic.sport360.com/feed', name: 'Sport360' },
];

// توليد slug من العنوان
function generateSlug(title: string): string {
  return title
    .replace(/[^\u0621-\u064A\u0660-\u06690-9a-zA-Z\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 80)
    + '-' + Date.now().toString(36);
}

// تصنيف الخبر تلقائياً عبر كلمات مفتاحية
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

    for (const source of RSS_SOURCES) {
      try {
        const feed = await parser.parseURL(source.url);
        const itemsToProcess = feed.items.slice(0, 5);

        for (const item of itemsToProcess) {
          const title = item.title?.substring(0, 150) || '';
          
          // تحقق من عدم التكرار
          const { data: existing } = await supabase
            .from('news')
            .select('id')
            .eq('title', title)
            .single();

          if (existing) continue;

          // تلخيص بالذكاء الاصطناعي
          const rawText = `${item.title}\n\n${item.contentSnippet || item.content || ''}`;
          let summary = '';
          try {
            summary = await summarizeNews(rawText);
          } catch {
            summary = item.contentSnippet?.substring(0, 200) || '';
          }

          // استخراج صورة من المحتوى
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

          // تأخير بسيط لتجنب حد Gemini API
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (sourceError: any) {
        errors.push(`${source.name}: ${sourceError.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      processedCount: totalProcessed,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error: any) {
    console.error('Fetch News Cron Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
