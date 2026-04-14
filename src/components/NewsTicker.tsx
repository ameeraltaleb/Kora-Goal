import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import styles from './NewsTicker.module.css';

export default async function NewsTicker() {
  const { data: news } = await supabase
    .from('news')
    .select('title, slug')
    .order('created_at', { ascending: false })
    .limit(8);

  const headlines = news || [];

  return (
    <div className={styles.tickerContainer}>
      <div className={styles.tickerLabel}>أحدث الأخبار</div>
      <div className={styles.tickerWrapper}>
        <div className={styles.tickerContent}>
          {headlines.length > 0 ? headlines.concat(headlines).map((item, index) => (
            <Link key={index} href={item.slug ? `/news/${item.slug}` : '#'} className={styles.newsItem}>
              {item.title}
            </Link>
          )) : (
            <span className={styles.newsItem}>مرحباً بكم في منصة كورة غول — أخبار رياضية على مدار الساعة</span>
          )}
        </div>
      </div>
    </div>
  );
}
