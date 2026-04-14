import styles from './loading.module.css';

export default function RootLoading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>جاري استدعاء البيانات...</p>
    </div>
  );
}
