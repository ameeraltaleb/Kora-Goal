'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from './error.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <div className={styles.errorIcon}>⚠️</div>
        <h1 className={styles.errorTitle}>حدث خطأ غير متوقع</h1>
        <p className={styles.errorMessage}>
          نعتذر، لكن حدث خطأ أثناء تحميل الصفحة. يرجى المحاولة مرة أخرى.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <div className={styles.errorDetails}>
            <h3>تفاصيل الخطأ (للمطورين فقط):</h3>
            <pre>{error.message}</pre>
            {error.stack && <pre className={styles.stackTrace}>{error.stack}</pre>}
          </div>
        )}

        <div className={styles.errorActions}>
          <button onClick={reset} className={styles.retryBtn}>
            ↻ إعادة المحاولة
          </button>
          <Link href="/" className={styles.homeBtn}>
            🏠 العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
