import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundContent}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.errorTitle}>الصفحة غير موجودة</h1>
        <p className={styles.errorMessage}>
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        
        <div className={styles.suggestions}>
          <h3>الصفحات المتاحة:</h3>
          <ul>
            <li><Link href="/">🏠 الصفحة الرئيسية</Link></li>
            <li><Link href="/standings">🏆 جدول الترتيب</Link></li>
            <li><Link href="/news">📰 آخر الأخبار</Link></li>
          </ul>
        </div>

        <Link href="/" className={styles.homeBtn}>
          العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}
