import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import NewsTicker from '@/components/NewsTicker';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './page.module.css';
import type { Metadata } from 'next';

const LEAGUES = [
  { code: 'PL', name: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 الإنجليزي' },
  { code: 'PD', name: '🇪🇸 الإسباني' },
  { code: 'SA', name: '🇮🇹 الإيطالي' },
  { code: 'BL1', name: '🇩🇪 الألماني' },
  { code: 'FL1', name: '🇫🇷 الفرنسي' },
];

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ league?: string }> | { league?: string } }): Promise<Metadata> {
  const resolvedParams = 'then' in searchParams ? await searchParams : searchParams;
  const code = resolvedParams.league || 'PL';
  const league = LEAGUES.find(l => l.code === code);
  return {
    title: `هدافي ${league?.name || 'الدوري'} | كورة غول`,
    description: `قائمة هدافي ${league?.name || 'الدوري'}، الأهداف، والتمريرات الحاسمة محدثة لحظياً.`,
  };
}

export default async function ScorersPage({
  searchParams,
}: {
  searchParams: Promise<{ league?: string }> | { league?: string };
}) {
  const resolvedParams = 'then' in searchParams ? await searchParams : searchParams;
  const activeLeague = resolvedParams?.league || 'PL';

  const { data: scorers, error } = await supabase
    .from('scorers')
    .select('*')
    .eq('league_code', activeLeague)
    .order('goals', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching scorers:', error);
  }

  const rows = scorers || [];

  return (
    <main className={styles.container}>
      <NewsTicker />

      <div className={styles.content}>
        <Breadcrumb items={[{ label: 'هدافي الدوريات' }]} />
        <div className={styles.header}>
          <h1 className={styles.title}>🎯 هدافي الدوريات الكبرى</h1>
          <div className={styles.tabs}>
            {LEAGUES.map((league) => (
              <Link
                key={league.code}
                href={`/scorers?league=${league.code}`}
                className={activeLeague === league.code ? styles.tabActive : styles.tab}
              >
                {league.name}
              </Link>
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
