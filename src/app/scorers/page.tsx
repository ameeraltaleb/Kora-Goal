import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import NewsTicker from '@/components/NewsTicker';
import styles from './page.module.css';

const LEAGUES = [
  { code: 'PL', name: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 الإنجليزي' },
  { code: 'PD', name: '🇪🇸 الإسباني' },
  { code: 'SA', name: '🇮🇹 الإيطالي' },
  { code: 'BL1', name: '🇩🇪 الألماني' },
  { code: 'FL1', name: '🇫🇷 الفرنسي' },
];

export const revalidate = 600;

export default async function ScorersPage({
  searchParams,
}: {
  searchParams: { league?: string };
}) {
  const activeLeague = searchParams?.league || 'PL';

  const { data: scorers } = await supabase
    .from('scorers')
    .select('*')
    .eq('league_code', activeLeague)
    .order('goals', { ascending: false })
    .limit(20);

  const rows = scorers || [];

  return (
    <main className={styles.container}>
      <NewsTicker />
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>🎯 هدافي الدوريات الكبرى</h1>
          <div className={styles.tabs}>
            {LEAGUES.map((league) => (
              <a
                key={league.code}
                href={`/scorers?league=${league.code}`}
                className={activeLeague === league.code ? styles.tabActive : styles.tab}
              >
                {league.name}
              </a>
            ))}
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th style={{ textAlign: 'right' }}>اللاعب</th>
                <th>الفريق</th>
                <th>الأهداف</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? rows.map((row: any, i: number) => (
                <tr key={row.id}>
                  <td>{i + 1}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>{row.player_name}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                      {row.team_logo && <Image src={row.team_logo} alt={row.team_name} width={20} height={20} unoptimized />}
                      <span>{row.team_name}</span>
                    </div>
                  </td>
                  <td className={styles.goalsCol}>{row.goals}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className={styles.emptyMsg}>لا توجد بيانات حالياً. سيتم تحديثها قريباً.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
