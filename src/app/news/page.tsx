import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import NewsTicker from '@/components/NewsTicker';
import styles from './page.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'أخبار كرة القدم - آخر الأخبار الرياضية',
  description: 'آخر أخبار كرة القدم العالمية والعربية، انتقالات اللاعبين، تحليلات المباريات، وأهم التقارير الرياضية.',
  keywords: ['أخبار كرة قدم', 'انتقالات', 'تحليلات', 'أخبار رياضية'],
  openGraph: {
    title: 'أخبار كرة القدم - كورة غول',
    description: 'آخر أخبار كرة القدم العالمية والعربية',
    type: 'website',
    locale: 'ar_SA',
  },
};

export const revalidate = 120;

export default async function NewsPage() {
  const { data: news } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  const articles = news || [];

  return (
    <main className={styles.container}>
      <NewsTicker />
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>📰 آخر الأخبار الرياضية</h1>
          <p className={styles.subtitle}>أحدث الأخبار والتقارير من عالم كرة القدم</p>
        </div>

        {articles.length === 0 ? (
          <div className={styles.emptyState}>
            <span style={{ fontSize: '3rem' }}>📭</span>
            <p>لا توجد أخبار حالياً. سيتم جلبها تلقائياً.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {articles.map((article: any) => (
              <Link
                href={article.slug ? `/news/${article.slug}` : '#'}
                key={article.id}
                className={styles.card}
              >
                <div className={styles.cardImage}>
                  {article.image_url ? (
                    <Image src={article.image_url} alt={article.title} fill style={{ objectFit: 'cover' }} unoptimized />
                  ) : null}
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.category}>{article.category || 'كرة قدم'}</span>
                  <h3 className={styles.cardTitle}>{article.title}</h3>
                  <p className={styles.cardSummary}>{article.summary?.substring(0, 100)}...</p>
                  <div className={styles.cardMeta}>
                    <span>{article.source_name || 'كورة غول'}</span>
                    <span>{new Date(article.created_at).toLocaleDateString('ar')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
