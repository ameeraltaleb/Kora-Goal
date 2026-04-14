import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import styles from './NewsTicker.module.css';

export default async function NewsTicker() {
  const cutOffDate = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .or(`status.eq.live,and(status.eq.finished,match_time.gt.${cutOffDate})`)
    .order('status', { ascending: false }) // Live first
    .order('match_time', { ascending: false });

  const tickerItems = matches || [];

  return (
    <div className={styles.tickerContainer}>
      <div className={styles.tickerLabel}>نتائج ومباريات</div>
      <div className={styles.tickerWrapper}>
        <div className={styles.tickerContent}>
          {tickerItems.length > 0 ? tickerItems.concat(tickerItems).map((match, index) => (
            <Link key={index} href={`/match/${match.id}`} className={styles.matchItem}>
              {match.status === 'live' ? (
                <span className={styles.liveBadge}><span className={styles.pulse}></span> مباشر</span>
              ) : (
                <span className={styles.finalBadge}>انتهت</span>
              )}
              
              <div className={styles.matchTeams}>
                <div className={styles.team}>
                  {match.home_logo && <Image src={match.home_logo} alt="" width={16} height={16} unoptimized />}
                  <span>{match.home_team}</span>
                </div>
                <span className={styles.score}>{match.score || '0 - 0'}</span>
                <div className={styles.team}>
                  <span>{match.away_team}</span>
                  {match.away_logo && <Image src={match.away_logo} alt="" width={16} height={16} unoptimized />}
                </div>
              </div>
            </Link>
          )) : (
            <span className={styles.matchItem}>لا توجد مباريات مباشرة حالياً — تابعنا للمزيد</span>
          )}
        </div>
      </div>
    </div>
  );
}
