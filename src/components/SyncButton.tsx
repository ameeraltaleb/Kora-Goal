"use client";

import { useState } from 'react';
import styles from './Header.module.css';

export default function SyncButton() {
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/fetch-external-news');
      const data = await res.json();
      if (data.success) {
        alert(`تم المزامنة بنجاح! تم جلب ${data.processedCount} خبر جديد.`);
      } else {
        alert(`خطأ في المزامنة: ${data.error}`);
      }
    } catch (err) {
      alert("فشل الاتصال بخادم المزامنة.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleSync} 
      className={styles.syncBtn}
      disabled={loading}
      title="مزامنة الأخبار من الويب"
    >
      <svg 
        className={`${styles.syncIcon} ${loading ? styles.spinning : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        width="20" 
        height="20"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      {loading ? 'جاري المزامنة...' : ''}
    </button>
  );
}
