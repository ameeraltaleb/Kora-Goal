"use client";

import { useState } from 'react';
import styles from './page.module.css';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>📬 اتصل بنا</h1>
        <p className={styles.subtitle}>
          لديك سؤال أو اقتراح أو ملاحظة؟ نسعد بتواصلك معنا.
        </p>

        {status === 'sent' ? (
          <div className={styles.successBox}>
            <span className={styles.successIcon}>✅</span>
            <h2 className={styles.successTitle}>شكراً لتواصلك!</h2>
            <p className={styles.successMessage}>تم إرسال رسالتك بنجاح. سنرد عليك قريباً.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              <label className={styles.fieldLabel}>الاسم</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="أدخل اسمك"
                className={styles.input}
              />
            </div>

            <div>
              <label className={styles.fieldLabel}>البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="example@email.com"
                className={styles.input}
              />
            </div>

            <div>
              <label className={styles.fieldLabel}>الرسالة</label>
              <textarea
                required
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="اكتب رسالتك هنا..."
                rows={5}
                className={styles.textarea}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className={styles.submitBtn}
            >
              {status === 'sending' ? 'جاري الإرسال...' : 'إرسال الرسالة'}
            </button>

            {status === 'error' && (
              <p className={styles.errorText}>حدث خطأ. يرجى المحاولة مرة أخرى.</p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
