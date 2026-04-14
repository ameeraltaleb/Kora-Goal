import { supabase } from '@/lib/supabase';
import styles from './NewsTicker.module.css';

export default async function NewsTicker() {
  // جلب آخر 8 أخبار من قاعدة البيانات
  const { data: news } = await supabase
    .from('news')
    .select('title')
    .order('created_at', { ascending: false })
    .limit(8);

  const headlines = news?.map(n => n.title) || [
    'مرحباً بكم في منصة كورة غول — أخبار رياضية على مدار الساعة',
  ];

  return (
    <div className={styles.tickerContainer}>
      <div className={styles.tickerLabel}>أحدث الأخبار</div>
      <div className={styles.tickerWrapper}>
        <div className={styles.tickerContent}>
          {headlines.concat(headlines).map((news, index) => (
            <span key={index} className={styles.newsItem}>{news}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
