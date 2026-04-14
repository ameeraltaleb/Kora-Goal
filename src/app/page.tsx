import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import MatchSchedule from '@/components/MatchSchedule';
import NewsTicker from '@/components/NewsTicker';
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

export default async function Home() {
  const [newsRes, matchesRes, standingsRes] = await Promise.all([
    supabase.from('news').select('*').order('created_at', { ascending: false }).limit(6),
    supabase.from('matches').select('*').order('match_time', { ascending: true }).limit(8),
    supabase.from('standings').select('*').eq('league_code', 'PL').order('position', { ascending: true }).limit(5),
  ]);

  const news = newsRes.data || [];
  const allMatches = matchesRes.data || [];
  const standings = standingsRes.data || [];

  const liveMatches = allMatches.filter((m: any) => m.status === 'live');
  const todayMatches = allMatches.filter((m: any) => m.status === 'upcoming' || m.status === 'live').slice(0, 6);

  const featuredNews = news[0];
  const sideNews = news.slice(1, 3);
  const trendingNews = news.slice(0, 4);

  return (
    <main className={styles.main}>
      {/* SEO: Hidden H1 for accessibility and search engines */}
      <h1 className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
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

            <div className={styles.liveCardsGrid}>
              {liveMatches.map((match: any) => (
                <Link href={`/match/${match.id}`} key={match.id} className={styles.liveCard} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className={styles.liveCardHeader}>
                    <span className={styles.liveBadge}>
                      <span className={styles.liveDot}></span>
                      LIVE
                    </span>
                    <span className={styles.liveTournament}>{match.tournament || 'مباراة'}</span>
                  </div>

                  <div className={styles.liveCardBody}>
                    <div className={styles.liveTeam}>
                      {match.home_logo && (
                        <div className={styles.liveTeamLogo}>
                          <Image src={match.home_logo} alt={match.home_team} width={40} height={40} style={{ objectFit: 'contain' }} unoptimized />
                        </div>
                      )}
                      <span className={styles.teamName}>{match.home_team}</span>
                    </div>

                    <div className={styles.liveScoreSection}>
                      <div className={styles.liveScore}>{match.score || '0 - 0'}</div>
                    </div>

                    <div className={styles.liveTeam}>
                      <span className={styles.teamName}>{match.away_team}</span>
                      {match.away_logo && (
                        <div className={styles.liveTeamLogo}>
                          <Image src={match.away_logo} alt={match.away_team} width={40} height={40} style={{ objectFit: 'contain' }} unoptimized />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.liveCardFooter}>
                    <span className={styles.watchBtn}>▶ شاهد البث المباشر</span>
                  </div>
                </Link>
              ))}
            </div>
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
            {sideNews.map((item: any, i: number) => (
              <Link href={item?.slug ? `/news/${item.slug}` : '#'} key={i} className={styles.newsCard} style={{ textDecoration: 'none', color: 'inherit' }}>
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

        {/* ========== SECTION 4: STANDINGS + TRENDING (2 Widgets) ========== */}
        <div className={styles.widgetsGrid}>
          {/* Standings Mini Table */}
          <div className={styles.widgetCard}>
            <div className={styles.widgetHeader}>
              <span className={styles.widgetTitle}>🏆 ترتيب الدوري الإنجليزي</span>
              <Link href="/standings" className={styles.widgetLink}>عرض الكل</Link>
            </div>
            <div className={styles.widgetBody}>
              <table className={styles.miniTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th style={{ textAlign: 'right' }}>الفريق</th>
                    <th>لعب</th>
                    <th>+/-</th>
                    <th>نقاط</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.length > 0 ? standings.map((row: any) => (
                    <tr key={row.id}>
                      <td>{row.position}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{row.team}</td>
                      <td>{row.mp}</td>
                      <td>{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                      <td className={styles.pointsCell}>{row.pts}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
                        يتم تحديث الترتيب تلقائياً
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trending News */}
          <div className={styles.widgetCard}>
            <div className={styles.widgetHeader}>
              <span className={styles.widgetTitle}>🔥 الأخبار الرائجة</span>
              <Link href="/news" className={styles.widgetLink}>المزيد ←</Link>
            </div>
            <div className={styles.widgetBody}>
              {trendingNews.length > 0 ? trendingNews.map((item: any, i: number) => (
                <Link href={item.slug ? `/news/${item.slug}` : '#'} key={i} className={styles.trendItem} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className={styles.trendNumber}>{i + 1}</div>
                  <div className={styles.trendContent}>
                    <span className={styles.trendTitle}>{item.title}</span>
                    <span className={styles.trendTime}>
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('ar', { day: 'numeric', month: 'short' }) : ''}
                    </span>
                  </div>
                </Link>
              )) : (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>لا توجد أخبار حالياً</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
