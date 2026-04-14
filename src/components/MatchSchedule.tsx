"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './MatchSchedule.module.css';
import MatchCard from './MatchCard';
import type { MatchData } from '@/lib/types';

type TabType = 'today' | 'tomorrow' | 'yesterday';

export default function MatchSchedule() {
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, [activeTab]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/matches?tab=${activeTab}`);
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (err) {
      console.error('Failed to fetch matches:', err);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'yesterday' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('yesterday')}
        >
          مباريات أمس
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'today' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('today')}
        >
          مباريات اليوم
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'tomorrow' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('tomorrow')}
        >
          مباريات الغد
        </button>
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>جاري تحميل المباريات...</p>
        </div>
      ) : matches.length === 0 ? (
        <div className={styles.emptyState}>
          <p>لا توجد مباريات {activeTab === 'today' ? 'اليوم' : activeTab === 'tomorrow' ? 'غداً' : 'أمس'}</p>
        </div>
      ) : (
        Object.entries(
          matches.reduce((acc: any, m: any) => {
            const key = m.tournament || 'مباريات أخرى';
            if (!acc[key]) acc[key] = { name: key, logo: m.league_logo, items: [] };
            acc[key].items.push(m);
            return acc;
          }, {})
        ).map(([key, group]: any) => (
          <div key={key} className={styles.tournamentGroup}>
            <div className={styles.tournamentHeader}>
              {group.logo && <Image src={group.logo} alt="" width={22} height={22} unoptimized />}
              <h3 className={styles.tournamentName}>{group.name}</h3>
            </div>
            <div className={styles.matchesInGroup}>
              {group.items.map((match: any) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
