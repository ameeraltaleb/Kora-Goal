import NewsTicker from '@/components/NewsTicker';

export default function AboutPage() {
  return (
    <main style={{minHeight: '100vh'}}>
      <NewsTicker />
      <div style={{maxWidth: '800px', margin: '0 auto', padding: '40px 20px 60px'}}>
        <h1 style={{fontSize: '2.2rem', fontWeight: 900, marginBottom: '20px', textAlign: 'center', fontFamily: "'Outfit', sans-serif"}}>
          عن منصة كورة غول ⚽
        </h1>

        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)', padding: '32px', marginBottom: '30px',
          lineHeight: 2, fontSize: '1.05rem', color: 'var(--text-secondary)'
        }}>
          <p style={{marginBottom: '20px'}}>
            <strong style={{color: 'var(--text-primary)'}}>كورة غول</strong> هي منصة رياضية عربية شاملة تهدف لتقديم تجربة متابعة رياضية لا مثيل لها. نؤمن أن كل مشجع يستحق الوصول السهل والسريع لأهم المباريات والأخبار الرياضية.
          </p>
          <p style={{marginBottom: '20px'}}>
            تأسست المنصة بهدف تقديم خدمة بث مباشر مجانية وعالية الجودة لأهم المباريات العالمية والعربية، إلى جانب تغطية إخبارية شاملة تعمل بالذكاء الاصطناعي.
          </p>
          <p>
            نحرص على تحديث البيانات لحظة بلحظة — من نتائج المباريات إلى جداول الترتيب وآخر أخبار الانتقالات — لنكون رفيقك الأول في عالم كرة القدم.
          </p>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px'}}>
          {[
            { icon: '📡', title: 'بث مباشر', desc: 'مباريات اليوم بجودة عالية' },
            { icon: '🤖', title: 'ذكاء اصطناعي', desc: 'أخبار ملخصة بالـ AI' },
            { icon: '📊', title: 'ترتيبات حية', desc: '4 دوريات أوروبية كبرى' },
            { icon: '⚡', title: 'تحديث لحظي', desc: 'كل 5 دقائق تلقائياً' },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)', padding: '24px', textAlign: 'center'
            }}>
              <span style={{fontSize: '2rem', display: 'block', marginBottom: '10px'}}>{item.icon}</span>
              <h3 style={{fontWeight: 800, marginBottom: '6px', fontSize: '1rem'}}>{item.title}</h3>
              <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
