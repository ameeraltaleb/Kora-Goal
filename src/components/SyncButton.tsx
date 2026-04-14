"use client";

import { useState } from 'react';
import styles from './Header.module.css';

interface SyncButtonProps {
  type?: 'news' | 'matches' | 'standings' | 'scorers' | 'master';
}

export default function SyncButton({ type = 'news' }: SyncButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    
    // Helper to perform single fetch
    const doFetch = async (endpoint: string, label: string) => {
      try {
        const res = await fetch(endpoint);
        const data = await res.json().catch(() => ({ error: 'فشل في قراءة استجابة السيرفر' }));
        return { ok: res.ok && data.success, count: data.processedCount || 0, error: data.error };
      } catch (err) {
        return { ok: false, error: 'فشل الاتصال بخادم المزامنة' };
      }
    };

    if (type === 'master') {
      alert("⚠️ ستبدأ المزامنة الشاملة الآن. قد تستغرق ما يصل إلى دقيقتين لتجنب الحظر. يرجى الانتظار...");
      
      const results = [];
      results.push(await doFetch('/api/admin/fetch-matches', 'المباريات'));
      await new Promise(r => setTimeout(r, 2000));
      results.push(await doFetch('/api/admin/fetch-standings', 'الترتيب'));
      await new Promise(r => setTimeout(r, 2000));
      results.push(await doFetch('/api/admin/fetch-external-news', 'الأخبار'));
      
      const successCount = results.filter(r => r.ok).length;
      if (successCount === results.length) {
        alert("✅ تمت المزامنة الشاملة بنجاح لكافة الأقسام!");
      } else {
        alert(`⚠️ اكتملت المزامنة مع وجود بعض الأخطاء (${successCount}/${results.length} نجحوا).`);
      }
      setLoading(false);
      return;
    }

    const endpoint = 
      type === 'matches' ? '/api/admin/fetch-matches' : 
      type === 'standings' ? '/api/admin/fetch-standings' : 
      type === 'scorers' ? '/api/admin/fetch-scorers' : 
      '/api/admin/fetch-external-news';
      
    const label = 
      type === 'matches' ? 'مباريات' : 
      type === 'standings' ? 'جدول الترتيب' : 
      type === 'scorers' ? 'الهدافين' : 
      'أخبار';

    try {
      const res = await fetch(endpoint);
      const data = await res.json().catch(() => ({ error: 'فشل في قراءة استجابة السيرفر (ليست JSON)' }));
      
      if (res.ok && data.success) {
        alert(`✅ تم مزامنة ال${label} بنجاح! تم معالجة ${data.processedCount} عنصر.`);
      } else {
        const errorMsg = data.error || `خطأ غير معروف (Status: ${res.status})`;
        alert(`❌ فشل في المزامنة: ${errorMsg}`);
        console.error('Sync Error:', data);
      }
    } catch (err) {
      alert("🚫 فشل الاتصال بخادم المزامنة. تأكد من أن الموقع يعمل.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleSync} 
      className={styles.syncBtn}
      disabled={loading}
      title={type === 'matches' ? "مزامنة المباريات من الـ API" : "مزامنة الأخبار من الويب"}
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
