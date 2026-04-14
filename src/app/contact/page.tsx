"use client";

import { useState } from 'react';
import NewsTicker from '@/components/NewsTicker';

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

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 18px', background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)', fontSize: '1rem', fontFamily: 'inherit',
    outline: 'none', transition: 'var(--transition)',
  };

  return (
    <main style={{minHeight: '100vh'}}>
      <div style={{maxWidth: '700px', margin: '0 auto', padding: '40px 20px 60px'}}>
        <h1 style={{fontSize: '2rem', fontWeight: 900, marginBottom: '10px', textAlign: 'center', fontFamily: "'Outfit', sans-serif"}}>
          📬 اتصل بنا
        </h1>
        <p style={{textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px'}}>
          لديك سؤال أو اقتراح أو ملاحظة؟ نسعد بتواصلك معنا.
        </p>

        {status === 'sent' ? (
          <div style={{textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)'}}>
            <span style={{fontSize: '3rem'}}>✅</span>
            <h2 style={{marginTop: '16px', fontWeight: 800}}>شكراً لتواصلك!</h2>
            <p style={{color: 'var(--text-secondary)', marginTop: '8px'}}>تم إرسال رسالتك بنجاح. سنرد عليك قريباً.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem'}}>الاسم</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                placeholder="أدخل اسمك"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem'}}>البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                placeholder="example@email.com"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem'}}>الرسالة</label>
              <textarea
                required
                value={form.message}
                onChange={e => setForm({...form, message: e.target.value})}
                placeholder="اكتب رسالتك هنا..."
                rows={5}
                style={{...inputStyle, resize: 'vertical'}}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              style={{
                padding: '16px', background: 'var(--primary-color)', color: '#000',
                border: 'none', borderRadius: 'var(--radius-md)', fontSize: '1rem',
                fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
                opacity: status === 'sending' ? 0.7 : 1,
              }}
            >
              {status === 'sending' ? 'جاري الإرسال...' : 'إرسال الرسالة'}
            </button>

            {status === 'error' && (
              <p style={{color: '#ff4757', textAlign: 'center'}}>حدث خطأ. يرجى المحاولة مرة أخرى.</p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
