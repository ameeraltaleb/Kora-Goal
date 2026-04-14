import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import NewsTicker from '@/components/NewsTicker';
import styles from './page.module.css';
import type { Metadata } from 'next';

export const revalidate = 600;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const decodedSlug = decodeURIComponent(params.slug);
  const { data: article } = await supabase
    .from('news')
    .select('title, summary, image_url, source_name')
    .eq('slug', decodedSlug)
    .single();

  if (!article) return { title: 'الخبر غير موجود' };

  return {
    title: `${article.title} | كورة غول`,
    description: article.summary?.substring(0, 160) || '',
    openGraph: {
      title: article.title,
      description: article.summary?.substring(0, 160) || '',
      images: article.image_url ? [{ url: article.image_url }] : [],
      type: 'article',
      siteName: 'منصة كورة غول',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary?.substring(0, 160) || '',
      images: article.image_url ? [article.image_url] : [],
    },
  };
}

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const decodedSlug = decodeURIComponent(params.slug);
  const { data: article } = await supabase
    .from('news')
    .select('*')
    .eq('slug', decodedSlug)
    .single();

  const { data: related } = await supabase
    .from('news')
    .select('id, title, slug, image_url, created_at')
    .neq('slug', params.slug)
    .order('created_at', { ascending: false })
    .limit(3);

  if (!article) {
    return (
      <main className={styles.container}>
        <NewsTicker />
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h1>404 | الخبر غير موجود</h1>
          <Link href="/news" className={styles.category}>← العودة للأخبار</Link>
        </div>
      </main>
    );
  }

  const shareUrl = `https://kora-goal.vercel.app/news/${article.slug}`;

  return (
    <main className={styles.container}>
      <NewsTicker />
      
      <article className={styles.articleWrapper}>
        <nav className={styles.breadcrumb}>
          <Link href="/">الرئيسية</Link> &raquo;
          <Link href="/news">الأخبار</Link> &raquo;
          <span>تفاصيل الخبر</span>
        </nav>

        <header className={styles.headerInfo}>
          <span className={styles.category}>{article.category || 'كرة قدم'}</span>
          <h1 className={styles.title}>{article.title}</h1>
          <div className={styles.meta}>
            <span>👤 كورة غول</span>
            <span>📅 {new Date(article.created_at).toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            {article.source_name && <span>📰 {article.source_name}</span>}
          </div>
        </header>

        {article.image_url && (
          <div className={styles.imageHero}>
            <Image src={article.image_url} alt={article.title} fill style={{ objectFit: 'cover' }} unoptimized priority />
          </div>
        )}

        {article.summary && (
          <div className={styles.summaryBox}>
            {article.summary}
          </div>
        )}

        {article.content && (
          <div className={styles.contentBody}>
            {article.content}
          </div>
        )}

        <footer className={styles.shareSection}>
          <span className={styles.shareLabel}>شارك الخبر مع أصدقائك:</span>
          <div className={styles.shareIcons}>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className={styles.shareBtn} title="Twitter">𝕏</a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className={styles.shareBtn} title="Facebook">f</a>
            <a href={`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" className={styles.shareBtn} title="WhatsApp">W</a>
          </div>
        </footer>

        {related && related.length > 0 && (
          <section className={styles.relatedSection}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>قد يهمك أيضاً</h3>
            <div className={styles.relatedGrid}>
              {related.map((r: any) => (
                <Link key={r.id} href={`/news/${r.slug}`} className={styles.relatedItem}>
                  <div className={styles.relatedThumb}>
                    {r.image_url && <Image src={r.image_url} alt={r.title} fill style={{ objectFit: 'cover' }} unoptimized />}
                  </div>
                  <h4 className={styles.relatedTitle}>{r.title}</h4>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
