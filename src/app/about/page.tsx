import NewsTicker from '@/components/NewsTicker';
import styles from './page.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'من نحن — كورة غول',
  description: 'تعرف على منصة كورة غول، المنصة الرياضية العربية الشاملة لمتابعة البث المباشر والأخبار والنتائج.',
  openGraph: {
    title: 'من نحن — كورة غول',
    description: 'تعرف على منصة كورة غول، المنصة الرياضية العربية الشاملة.',
    type: 'website',
    locale: 'ar_SA',
  },
};

const features = [
  { icon: '📡', title: 'بث مباشر', desc: 'مباريات اليوم بجودة عالية' },
  { icon: '🤖', title: 'ذكاء اصطناعي', desc: 'أخبار ملخصة بالـ AI' },
  { icon: '📊', title: 'ترتيبات حية', desc: '4 دوريات أوروبية كبرى' },
  { icon: '⚡', title: 'تحديث لحظي', desc: 'كل 5 دقائق تلقائياً' },
];

export default function AboutPage() {
  return (
    <main className={styles.container}>
      <NewsTicker />
      <div className={styles.content}>
        <h1 className={styles.title}>عن منصة كورة غول ⚽</h1>

        <div className={styles.descriptionCard}>
          <p>
            <strong>كورة غول</strong> هي منصة رياضية عربية شاملة تهدف لتقديم تجربة متابعة رياضية لا مثيل لها. نؤمن أن كل مشجع يستحق الوصول السهل والسريع لأهم المباريات والأخبار الرياضية.
          </p>
          <p>
            تأسست المنصة بهدف تقديم خدمة بث مباشر مجانية وعالية الجودة لأهم المباريات العالمية والعربية، إلى جانب تغطية إخبارية شاملة تعمل بالذكاء الاصطناعي.
          </p>
          <p>
            نحرص على تحديث البيانات لحظة بلحظة — من نتائج المباريات إلى جداول الترتيب وآخر أخبار الانتقالات — لنكون رفيقك الأول في عالم كرة القدم.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((item, i) => (
            <div key={i} className={styles.featureCard}>
              <span className={styles.featureIcon}>{item.icon}</span>
              <h3 className={styles.featureTitle}>{item.title}</h3>
              <p className={styles.featureDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
