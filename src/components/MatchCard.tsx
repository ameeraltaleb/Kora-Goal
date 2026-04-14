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
    <div className={`bento-box ${styles.card}`}>
      <div className={styles.header}>
        <span className={styles.tournament}>{tournament || ''}</span>
        {status === 'live' && <span className={styles.liveBadge}>مباشر</span>}
      </div>

      <div className={styles.matchMain}>
        <div className={styles.team}>
          <div className={styles.logoSlot}>
            {home_logo ? (
              <Image src={home_logo} alt={home_team} width={50} height={50} className={styles.logo} unoptimized />
            ) : (
              <span style={{fontSize: '2rem'}}>⚽</span>
            )}
          </div>
          <span className={styles.teamName}>{home_team}</span>
        </div>

        <div className={styles.scoreSection}>
          {status === 'upcoming' ? (
            <span className={styles.time}>{displayTime}</span>
          ) : (
            <span className={styles.score}>{score}</span>
          )}
        </div>

        <div className={styles.team}>
          <div className={styles.logoSlot}>
            {away_logo ? (
              <Image src={away_logo} alt={away_team} width={50} height={50} className={styles.logo} unoptimized />
            ) : (
              <span style={{fontSize: '2rem'}}>⚽</span>
            )}
          </div>
          <span className={styles.teamName}>{away_team}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.info}>
          {channel && <span className={styles.iconLabel}>📺 {channel}</span>}
          {commentator && <span className={styles.iconLabel}>🎤 {commentator}</span>}
        </div>
        <Link href={`/match/${id}`} className={styles.watchBtn}>
          {status === 'finished' ? 'ملخص المباراة' : 'شاهد البث'}
        </Link>
      </div>
    </div>
  );
}
