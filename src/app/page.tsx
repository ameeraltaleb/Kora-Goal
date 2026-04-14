import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import MatchSchedule from '@/components/MatchSchedule';
import MatchCard from '@/components/MatchCard';
import NewsTicker from '@/components/NewsTicker';
import MiniStandingsWidget from '@/components/MiniStandingsWidget';
import styles from './page.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'كورة غول - بث مباشر لمباريات اليوم | نتائج وترتيب',
  description: 'شاهد البث المباشر لمباريات اليوم مجاناً. نتائج المباريات لحظة بلحظة، جدول ترتيب الدوريات، وآخر أخبار كرة القدم العربية والعالمية.',
  keywords: ['بث مباشر مباريات', 'مباريات اليوم', 'نتائج المباريات', 'ترتيب الدوري', 'أخبار كرة قدم'],
  openGraph: {
    title: 'كورة غول - بث مباشر لمباريات اليوم',
    description: 'شاهد البث المباشر لمباريات اليوم مجاناً مع كورة غول',
    type: 'website',
    locale: 'ar_SA',
  },
};

export const revalidate = 60;

const STANDINGS_LEAGUES = [
  { code: 'PL', name: 'الدوري الإنجليزي' },
  { code: 'PD', name: 'الدوري الإسباني' },
  { code: 'SA', name: 'الدوري الإيطالي' },
  { code: 'BL1', name: 'الدوري الألماني' },
];

export default async function Home() {
  const [newsRes, matchesRes, ...standingsResults] = await Promise.all([
    supabase.from('news').select('*').order('created_at', { ascending: false }).limit(6),
    supabase.from('matches').select('*').order('match_time', { ascending: true }).limit(10),
    ...STANDINGS_LEAGUES.map(l =>
      supabase.from('standings').select('*').eq('league_code', l.code).order('position', { ascending: true }).limit(5)
    ),
  ]);

  if (newsRes.error) console.error('Error fetching news:', newsRes.error);
  if (matchesRes.error) console.error('Error fetching matches:', matchesRes.error);

  const news = newsRes.data || [];
  const allMatches = matchesRes.data || [];

  const standingsData: Record<string, any[]> = {};
  STANDINGS_LEAGUES.forEach((league, i) => {
    if (standingsResults[i].error) console.error(`Error fetching ${league.code} standings:`, standingsResults[i].error);
    standingsData[league.code] = standingsResults[i].data || [];
  });

  const liveMatches = allMatches.filter((m: any) => m.status === 'live');
  const featuredNews = news[0];
  const sideNews = news.slice(1, 3);

  return (
    <main className={styles.main}>
      {/* SEO: Hidden H1 for accessibility and search engines */}
      <h1 className="sr-only">
        كورة غول - بث مباشر لمباريات اليوم، نتائج المباريات، جدول الترتيب، وآخر أخبار كرة القدم
      </h1>

      <NewsTicker />
      <div className={styles.contentContainer}>

        {/* ========== SECTION 1: LIVE NOW (Full Width) ========== */}
        {liveMatches.length > 0 && (
          <section className={styles.liveSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.liveIcon}></span>
              <h2 className={styles.sectionTitle}>مباريات مباشرة الآن</h2>
              <span className={styles.liveCount}>{liveMatches.length} مباراة</span>
            </div>

            {Object.entries(
              liveMatches.reduce((acc: any, m: any) => {
                const key = m.tournament || 'مباريات مباشرة';
                if (!acc[key]) acc[key] = { logo: m.league_logo, items: [] };
                acc[key].items.push(m);
                return acc;
              }, {})
            ).map(([tournament, group]: any) => (
              <div key={tournament} className={styles.tournamentLiveGroup}>
                <div className={styles.tournamentLiveHeader}>
                  {group.logo && <Image src={group.logo} alt="" width={20} height={20} unoptimized />}
                  <span>{tournament}</span>
                </div>
                <div className={styles.liveRowsContainer}>
                  {group.items.map((match: any) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ========== SECTION 2: TODAY'S MATCHES (Full Width) ========== */}
        <section className={styles.matchesSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>مباريات اليوم</h2>
          </div>
          <MatchSchedule />
        </section>

        {/* ========== SECTION 3: NEWS (Simplified - 3 Cards) ========== */}
        <section className={styles.newsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>آخر الأخبار</h2>
            <Link href="/news" className={styles.viewAllLink}>عرض جميع الأخبار ←</Link>
          </div>

          <div className={styles.newsGrid}>
            {/* Featured News Card */}
            {featuredNews && (
              <Link href={featuredNews.slug ? `/news/${featuredNews.slug}` : '#'} className={`${styles.newsCard} ${styles.newsCardFeatured}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={styles.newsImageContainer}>
                  {featuredNews.image_url && (
                    <Image src={featuredNews.image_url} alt={featuredNews.title || ''} fill style={{ objectFit: 'cover' }} unoptimized />
                  )}
                  <div className={styles.newsOverlay}>
                    <span className={styles.newsCategory}>{featuredNews.category || 'أخبار'}</span>
                    <h3 className={styles.newsTitleFeatured}>{featuredNews.title}</h3>
                  </div>
                </div>
              </Link>
            )}

            {/* Side News Cards */}
            {sideNews.map((item: any) => (
              <Link href={item?.slug ? `/news/${item.slug}` : '#'} key={item.id} className={styles.newsCard} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={styles.newsCardContent}>
                  {item.image_url && (
                    <div className={styles.newsThumb}>
                      <Image src={item.image_url} alt={item.title || ''} fill style={{ objectFit: 'cover' }} unoptimized />
                    </div>
                  )}
                  <div className={styles.newsTextContent}>
                    <span className={styles.newsCategory}>{item.category || 'أخبار'}</span>
                    <h4 className={styles.newsTitleSmall}>{item.title}</h4>
                    <span className={styles.newsTime}>
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('ar', { day: 'numeric', month: 'short' }) : ''}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ========== SECTION 4: MULTI-LEAGUE STANDINGS (Full Width Grid) ========== */}
        <section className={styles.standingsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>🏆 ترتيب الدوريات الكبرى</h2>
            <Link href="/standings" className={styles.viewAllLink}>التفاصيل الكاملة ←</Link>
          </div>

          <div className={styles.widgetsGrid}>
            {STANDINGS_LEAGUES.map((league) => (
              <MiniStandingsWidget
                key={league.code}
                title={league.name}
                rows={standingsData[league.code]}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
