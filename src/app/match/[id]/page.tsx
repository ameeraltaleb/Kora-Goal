import { supabase } from '@/lib/supabase';
import NewsTicker from '@/components/NewsTicker';
import VideoPlayer from '@/components/VideoPlayer';
import SidePlaylist from '@/components/SidePlaylist';
import styles from './page.module.css';
import type { Metadata, ResolvingMetadata } from 'next';

// Dynamic metadata for match pages
export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { data: match, error } = await supabase
    .from('matches')
    .select('home_team, away_team, tournament, status, score')
    .eq('id', params.id)
    .single();

  if (error || !match) {
    return {
      title: 'المباراة غير موجودة',
      robots: { index: false },
    };
  }

  const title = `بث مباشر: ${match.home_team} ضد ${match.away_team} | ${match.tournament || ''}`;
  const description = `شاهد البث المباشر لمباراة ${match.home_team} ضد ${match.away_team} في ${match.tournament || 'المباراة'}. النتيجة: ${match.score || '0 - 0'}`;

  return {
    title,
    description,
    keywords: [match.home_team, match.away_team, 'بث مباشر', match.tournament, 'مباراة'],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'ar_SA',
    },
  };
}

export const revalidate = 30; // 30s cache for live updates

export default async function MatchDetails({ params }: { params: { id: string } }) {
  // جلب المباراة الحالية
  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select('*')
    .eq('id', params.id)
    .single();

  if (matchError) {
    console.error('Error fetching match:', matchError);
  }

  // جلب المباريات الأخرى للقائمة الجانبية
  const { data: otherMatches, error: otherError } = await supabase
    .from('matches')
    .select('id, home_team, away_team, tournament, home_logo, score, status')
    .neq('id', params.id)
    .order('match_time', { ascending: true })
    .limit(5);

  if (otherError) {
    console.error('Error fetching other matches:', otherError);
  }

  if (!match) {
    return (
      <main className={styles.container}>
        <NewsTicker />
        <div className={styles.content}>
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <h1>المباراة غير موجودة</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>ربما تم حذفها أو انتهت صلاحيتها.</p>
          </div>
        </div>
      </main>
    );
  }

  const servers = match.servers || [];
  const sideItems = (otherMatches || []).map((m: any) => ({
    id: m.id,
    title: `${m.home_team} vs ${m.away_team}`,
    subtitle: m.tournament || '',
    logo: m.home_logo || '',
    score: m.score || undefined,
  }));

  return (
    <main className={styles.container}>
      <NewsTicker />

      <div className={styles.content}>
        <div className={styles.mainGrid}>
          {/* Column 1: Player */}
          <div className={styles.playerSection}>
            <div className={styles.matchMeta}>
              <h1 className={styles.matchTitle}>بث مباشر: {match.home_team} ضد {match.away_team}</h1>
              <div className={styles.matchBadges}>
                {match.tournament && <span className={styles.badge}>{match.tournament}</span>}
                {match.channel && <span className={styles.badge}>{match.channel}</span>}
                <span className={match.status === 'live' ? styles.liveBadge : styles.badge}>
                  {match.status === 'live' ? 'مباشر الآن' : match.status === 'finished' ? 'انتهت' : 'لم تبدأ'}
                </span>
              </div>
            </div>

            {servers.length > 0 ? (
              <VideoPlayer sources={servers} />
            ) : (
              <div style={{
                width: '100%', aspectRatio: '16/9', background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px'
              }}>
                <span style={{ fontSize: '3rem' }}>📡</span>
                <p style={{ color: 'var(--text-secondary)' }}>سيتم إضافة روابط البث قريباً</p>
              </div>
            )}

            <div className={styles.matchDescription}>
              <h3>عن المباراة</h3>
              <p>{match.home_team} ضد {match.away_team} - {match.tournament || 'مباراة'}</p>
              <div className={styles.matchDetailsList}>
                {match.commentator && (
                  <div className={styles.detailItem}><span>المعلق:</span> <strong>{match.commentator}</strong></div>
                )}
                {match.channel && (
                  <div className={styles.detailItem}><span>القناة:</span> <strong>{match.channel}</strong></div>
                )}
                <div className={styles.detailItem}><span>التوقيت:</span> <strong>{new Date(match.match_time).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })}</strong></div>
              </div>
            </div>
          </div>

          {/* Column 2: Sidebar */}
          <aside className={styles.sidebar}>
            <SidePlaylist items={sideItems} activeId={Number(params.id)} />

            <div className={styles.adSpace}>
              <span>مساحة إعلانية</span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
