import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import NewsTicker from '@/components/NewsTicker';
import type { Metadata } from 'next';

export const revalidate = 300;

// Dynamic SEO metadata for each article
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data: article } = await supabase
    .from('news')
    .select('title, summary, image_url')
    .eq('slug', params.slug)
    .single();

  return {
    title: article?.title ? `${article.title} | كورة غول` : 'كورة غول',
    description: article?.summary?.substring(0, 160) || '',
    openGraph: {
      title: article?.title || '',
      description: article?.summary?.substring(0, 160) || '',
      images: article?.image_url ? [article.image_url] : [],
      type: 'article',
    },
  };
}

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const { data: article } = await supabase
    .from('news')
    .select('*')
    .eq('slug', params.slug)
    .single();

  // أخبار مشابهة
  const { data: related } = await supabase
    .from('news')
    .select('id, title, slug, image_url, created_at')
    .neq('slug', params.slug)
    .order('created_at', { ascending: false })
    .limit(3);

  if (!article) {
    return (
      <main style={{minHeight: '100vh'}}>
        <NewsTicker />
        <div style={{textAlign: 'center', padding: '80px 20px'}}>
          <h1>الخبر غير موجود</h1>
          <p style={{color: 'var(--text-secondary)', marginTop: '12px'}}>ربما تم حذفه أو تغيير الرابط.</p>
          <Link href="/news" style={{color: 'var(--primary-color)', marginTop: '20px', display: 'inline-block'}}>← العودة للأخبار</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{minHeight: '100vh'}}>
      <NewsTicker />
      <article style={{maxWidth: '800px', margin: '0 auto', padding: '30px 20px 60px'}}>
        {/* Category & Date */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
          <span style={{color: 'var(--primary-color)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase'}}>
            {article.category || 'كرة قدم'}
          </span>
          <span style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>
            {new Date(article.created_at).toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        {/* Title */}
        <h1 style={{fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.3, marginBottom: '20px', fontFamily: "'Outfit', sans-serif"}}>
          {article.title}
        </h1>

        {/* Source */}
        {article.source_name && (
          <div style={{marginBottom: '24px', fontSize: '0.85rem', color: 'var(--text-secondary)'}}>
            المصدر: <strong>{article.source_name}</strong>
            {article.source_url && (
              <> — <a href={article.source_url} target="_blank" rel="noopener noreferrer" style={{color: 'var(--primary-color)'}}>رابط المصدر الأصلي</a></>
            )}
          </div>
        )}

        {/* Image */}
        {article.image_url && (
          <div style={{width: '100%', height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '30px', position: 'relative', background: 'var(--bg-card)'}}>
            <Image src={article.image_url} alt={article.title} fill style={{objectFit:'cover'}} unoptimized />
          </div>
        )}

        {/* Summary */}
        {article.summary && (
          <div style={{
            padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)', marginBottom: '30px', borderRight: '4px solid var(--primary-color)',
            fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)'
          }}>
            {article.summary}
          </div>
        )}

        {/* Full Content */}
        {article.content && (
          <div style={{fontSize: '1.05rem', lineHeight: 2, color: 'var(--text-primary)'}}>
            {article.content}
          </div>
        )}

        {/* Share */}
        <div style={{
          marginTop: '40px', padding: '20px', background: 'var(--bg-card)', 
          border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span style={{fontWeight: 800}}>شارك الخبر:</span>
          <div style={{display: 'flex', gap: '12px'}}>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://koragoal.com/news/${article.slug}`)}`} target="_blank" rel="noopener noreferrer" style={{color: 'var(--text-secondary)', fontSize: '1.2rem'}}>𝕏</a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://koragoal.com/news/${article.slug}`)}`} target="_blank" rel="noopener noreferrer" style={{color: 'var(--text-secondary)', fontSize: '1.2rem'}}>f</a>
            <a href={`https://wa.me/?text=${encodeURIComponent(article.title + ' https://koragoal.com/news/' + article.slug)}`} target="_blank" rel="noopener noreferrer" style={{color: 'var(--text-secondary)', fontSize: '1.2rem'}}>W</a>
          </div>
        </div>

        {/* Related Articles */}
        {related && related.length > 0 && (
          <div style={{marginTop: '50px'}}>
            <h3 style={{fontSize: '1.4rem', fontWeight: 900, marginBottom: '20px'}}>أخبار ذات صلة</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px'}}>
              {related.map((r: any) => (
                <Link key={r.id} href={r.slug ? `/news/${r.slug}` : '#'} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)', overflow: 'hidden', textDecoration: 'none', color: 'inherit'
                }}>
                  <div style={{height: '120px', background: 'linear-gradient(135deg, #1a2a1a, #0d1117)', position: 'relative'}}>
                    {r.image_url && <Image src={r.image_url} alt={r.title} fill style={{objectFit:'cover'}} unoptimized />}
                  </div>
                  <div style={{padding: '14px'}}>
                    <h4 style={{fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.4}}>{r.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Link href="/news" style={{color: 'var(--primary-color)', fontWeight: 800, display: 'block', marginTop: '30px', textDecoration: 'none'}}>
          ← العودة لكل الأخبار
        </Link>
      </article>
    </main>
  );
}
