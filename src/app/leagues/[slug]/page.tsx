import { supabase } from '@/lib/supabase';
import MatchCard from '@/components/MatchCard';
import Breadcrumb from '@/components/Breadcrumb';
import NewsTicker from '@/components/NewsTicker';
import MiniStandingsWidget from '@/components/MiniStandingsWidget';
import styles from './page.module.css';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 3600; // Cache for 1 hour

// Map slugs to API codes and Arabic names
const LEAGUES_DATA: Record<string, { code: string, name: string, desc: string }> = {
  'premier-league': {
    code: 'PL',
    name: 'الدوري الإنجليزي الممتاز',
    desc: 'تابع أحدث أخبار، مباريات، وترتيب الدوري الإنجليزي الممتاز (البريميرليج) حصرياً على كورة غول.',
  },
  'la-liga': {
    code: 'PD',
    name: 'الدوري الإسباني',
    desc: 'تغطية شاملة لمباريات وترتيب الدوري الإسباني (الليغا) لحظة بلحظة مع كورة غول.',
  },
  'serie-a': {
    code: 'SA',
    name: 'الدوري الإيطالي',
    desc: 'تابع منافسات الكالتشيو، مباريات وترتيب الدوري الإيطالي مع تغطية مستمرة.',
  },
  'bundesliga': {
    code: 'BL1',
    name: 'الدوري الألماني',
    desc: 'جدول مباريات، ترتيب، وأخبار الدوري الألماني الممتاز (البوندسليغا).',
  },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const league = LEAGUES_DATA[params.slug];
  
  if (!league) {
    return { title: 'البطولة غير موجودة' };
  }

  const title = `جدول مباريات وترتيب ${league.name} | كورة غول`;
  
  return {
    title,
    description: league.desc,
    keywords: [league.name, 'ترتيب', 'مباريات', 'بث مباشر', 'أخبار', 'كورة غول'],
    alternates: {
      canonical: `https://kora-goal.vercel.app/leagues/${params.slug}`,
    },
    openGraph: {
      title,
      description: league.desc,
      url: `https://kora-goal.vercel.app/leagues/${params.slug}`,
      type: 'website',
    },
  };
}

export default async function LeaguePage({ params }: { params: { slug: string } }) {
  const league = LEAGUES_DATA[params.slug];

  if (!league) {
    notFound();
  }

  // Fetch all related data
  const [matchesRes, standingsRes] = await Promise.all([
    supabase
      .from('matches')
      .select('*')
      .ilike('tournament', `%${league.name}%`)
      .order('match_time', { ascending: false })
      .limit(10),
    supabase
      .from('standings')
      .select('*')
      .eq('league_code', league.code)
      .order('position', { ascending: true })
      .limit(20)
  ]);

  const matches = matchesRes.data || [];
  const standings = standingsRes.data || [];

  return (
    <main className={styles.container}>
      <NewsTicker />
      
      <Breadcrumb 
        items={[
          { label: 'الرئيسية', href: '/' },
          { label: 'البطولات' },
          { label: league.name }
        ]} 
      />

      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{league.name}</h1>
          <p className={styles.description}>{league.desc}</p>
        </div>
      </div>

      <div className={styles.sections}>
        {/* المباريات Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>أهم المباريات</h2>
          </div>
          
          {matches.length > 0 ? (
            <div className={styles.matchesGrid}>
              {matches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className={styles.noData}>لا توجد مباريات مسجلة حالياً لهذه البطولة.</div>
          )}
        </section>

        {/* الترتيب Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>جدول الترتيب</h2>
          </div>
          
          {standings.length > 0 ? (
            <MiniStandingsWidget rows={standings} title={league.name} />
          ) : (
            <div className={styles.noData}>جدول الترتيب غير متاح حالياً.</div>
          )}
        </section>
      </div>
    </main>
  );
}
