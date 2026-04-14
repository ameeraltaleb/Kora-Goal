"use client";

import styles from './MatchCard.module.css';
import Image from 'next/image';
import Link from 'next/link';
import type { MatchData } from '@/lib/types';

interface MatchCardProps {
  match: MatchData;
}

export default function MatchCard({ match }: MatchCardProps) {
  const { id, home_team, home_logo, away_team, away_logo, match_time, status, score, tournament, channel, commentator } = match;

  const displayTime = match_time
    ? new Date(match_time).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <Link href={`/match/${id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.matchMain}>
          {/* Team 1 */}
          <div className={styles.team}>
            <span className={styles.teamName}>{home_team}</span>
            <div className={styles.logoWrapper}>
              {home_logo ? (
                <Image src={home_logo} alt={home_team} width={36} height={36} className={styles.logo} unoptimized />
              ) : (
                <span className={styles.placeholderLogo}>⚽</span>
              )}
            </div>
          </div>

          {/* Score/Time Section */}
          <div className={styles.centerSection}>
            <div className={styles.tournamentInfo}>
              {match.league_logo && <Image src={match.league_logo} alt="" width={16} height={16} unoptimized />}
              <span className={styles.tournamentName}>{tournament}</span>
            </div>

            <div className={styles.scoreBox}>
              {status === 'live' ? (
                <>
                  <span className={styles.liveScore}>{score || '0 - 0'}</span>
                  <div className={styles.liveIndicator}>
                    <span className={styles.pulse}></span>
                    مباشر
                  </div>
                </>
              ) : status === 'finished' ? (
                <>
                  <span className={styles.finalScore}>{score || '0 - 0'}</span>
                  <span className={styles.finalBadge}>انتهت</span>
                </>
              ) : (
                <>
                  <span className={styles.matchTime}>{displayTime}</span>
                  <span className={styles.upcomingBadge}>تبدأ قريباً</span>
                </>
              )}
            </div>

            <div className={styles.matchMeta}>
              {channel && <span className={styles.metaItem}>📺 {channel}</span>}
              {commentator && <span className={styles.metaItem}>🎤 {commentator}</span>}
            </div>
          </div>

          {/* Team 2 */}
          <div className={styles.team}>
            <div className={styles.logoWrapper}>
              {away_logo ? (
                <Image src={away_logo} alt={away_team} width={36} height={36} className={styles.logo} unoptimized />
              ) : (
                <span className={styles.placeholderLogo}>⚽</span>
              )}
            </div>
            <span className={styles.teamName}>{away_team}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
