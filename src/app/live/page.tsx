import { supabase } from '@/lib/supabase';
import MatchCard from '@/components/MatchCard';
import Breadcrumb from '@/components/Breadcrumb';
import NewsTicker from '@/components/NewsTicker';
import styles from './page.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مباريات اليوم بث مباشر | يلا شوت كورة غول',
  description: 'شاهد البث المباشر لمباريات اليوم مجاناً بدون تقطيع. تغطية حصرية ومباشرة لجميع البطولات العربية والعالمية، الدوريات الكبرى ونتائج حية لحظة بلحظة.',
  keywords: ['مباريات اليوم', 'بث مباشر', 'كورة غول', 'يلا شوت', 'مباريات مباشرة', 'كرة قدم', 'مشاهدة مباريات'],
  alternates: {
    canonical: 'https://kora-goal.vercel.app/live',
  },
  openGraph: {
    title: 'مباريات اليوم بث مباشر | كورة غول',
    description: 'شاهد مباريات اليوم بث مباشر بأعلى جودة لمختلف البطولات.',
    url: 'https://kora-goal.vercel.app/live',
    type: 'website',
  },
};

export const revalidate = 60; // 60 seconds

export default async function LiveMatchesPage() {
  // Fetch today's matches
  const { data: matches, error } = await supabase
    .from('matches')
    .select('*')
    // Get a reasonable amount of recent matches
    .order('match_time', { ascending: false })
    .limit(30);

  if (error) {
    console.error('Error fetching live matches:', error);
  }

  const liveMatches = (matches || []).filter(m => m.status === 'مباشر');
  const otherMatches = (matches || []).filter(m => m.status !== 'مباشر');
  
  // Sort other matches by time ascending so upcoming are first
  otherMatches.sort((a, b) => new Date(a.match_time).getTime() - new Date(b.match_time).getTime());

  // Put live matches first
  const displayMatches = [...liveMatches, ...otherMatches];

  return (
    <main className={styles.container}>
      <NewsTicker />
      
      <Breadcrumb 
        items={[
          { label: 'الرئيسية', href: '/' },
          { label: 'مباريات اليوم بث مباشر' }
        ]} 
      />

      <header className={styles.header}>
        <h1 className={styles.title}>مباريات اليوم بث مباشر</h1>
        <p className={styles.description}>
          تابع أقوى مباريات اليوم بث مباشر وتغطية حصرية لجميع البطولات. نوفر لك متابعة حية لنتائج المباريات وأحدث التفاصيل للأندية المفضلة لديك لحظة بلحظة.
        </p>
      </header>

      {displayMatches.length > 0 ? (
        <div className={styles.matchesGrid}>
          {displayMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className={styles.noMatches}>
          <h3>لا توجد مباريات حالياً</h3>
          <p>بإمكانك متابعة آخر الأخبار الرياضية في الوقت الحالي.</p>
        </div>
      )}
    </main>
  );
}
