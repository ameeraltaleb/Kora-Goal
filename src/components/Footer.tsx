import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            كورة <span>غول</span>
          </div>
          <p className={styles.tagline}>منصتك الأولى لمتابعة أهم مباريات اليوم والنتائج مباشرة بنقرة واحدة وبدون تقطيع.</p>
        </div>

        <div className={styles.linksSection}>
          <div className={styles.linksGroup}>
            <h4>أقسام الموقع</h4>
            <Link href="/">الرئيسية</Link>
            <Link href="/news">الأخبار</Link>
            <Link href="/standings">جدول الترتيب</Link>
          </div>
          
          <div className={styles.linksGroup}>
            <h4>الموقع</h4>
            <Link href="/about">من نحن</Link>
            <Link href="/contact">اتصل بنا</Link>
            <Link href="/privacy-policy">سياسة الخصوصية</Link>
            <Link href="/dmca">حقوق الملكية DMCA</Link>
            <Link href="/terms">شروط الاستخدام</Link>
          </div>
        </div>
      </div>
      
      <div className={styles.bottomBar}>
        <p>© {new Date().getFullYear()} كورة غول - جميع الحقوق محفوظة</p>
      </div>
    </footer>
  );
};

export default Footer;
