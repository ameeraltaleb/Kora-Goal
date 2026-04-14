import Link from 'next/link';
import Image from 'next/image';
import NewsTicker from '@/components/NewsTicker';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';
import type { Metadata } from 'next';

const LEAGUES = [
  { code: 'PL', name: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 الإنجليزي' },
  { code: 'PD', name: '🇪🇸 الإسباني' },
  { code: 'SA', name: '🇮🇹 الإيطالي' },
  { code: 'BL1', name: '🇩🇪 الألماني' },
  { code: 'FL1', name: '🇫🇷 الفرنسي' },
  { code: 'CL', name: '🇪🇺 دوري الأبطال' },
  { code: 'DED', name: '🇳🇱 الهولندي' },
  { code: 'PPL', name: '🇵🇹 البرتغالي' },
  { code: 'BSA', name: '🇧🇷 البرازيلي' },
  { code: 'ELC', name: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 الدرجة الأولى' },
  { code: 'EC', name: '🏆 اليورو' },
  { code: 'CLI', name: '🌎 ليبرتادوريس' },
];

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: { searchParams: { league?: string } }): Promise<Metadata> {
  const code = searchParams.league || 'PL';
  const league = LEAGUES.find(l => l.code === code);
  return {
    title: `ترتيب ${league?.name || 'الدوري'} | كورة غول`,
    description: `جدول ترتيب ${league?.name || 'الدوري'} بتحديث لحظي للنقاط والمراكز والنتائج.`,
  };
}

export default async function Standings({
  searchParams,
}: {
  searchParams: { league?: string };
}) {
  const activeLeague = searchParams?.league || 'PL';

  const { data: standings } = await supabase
    .from('standings')
    .select('*')
    .eq('league_code', activeLeague)
    .order('position', { ascending: true });

  const rows = standings || [];

  return (
    <main className={styles.container}>
      <NewsTicker />

      <div className={styles.content}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>ترتيب الدوريات</h1>
          <div className={styles.tabs}>
            {LEAGUES.map((league) => (
              <Link
                key={league.code}
                href={`/standings?league=${league.code}`}
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
                <th className={styles.teamCol}>الفريق</th>
                <th>لعب</th>
                <th>ف</th>
                <th>ت</th>
                <th>خ</th>
                <th className={styles.hideMobile}>+/-</th>
                <th>نقاط</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? rows.map((row: any) => (
                <tr key={row.id}>
                  <td>{row.position}</td>
                  <td className={styles.teamCol}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {row.team_logo && (
                        <Image src={row.team_logo} alt={row.team} width={24} height={24} style={{ objectFit: 'contain' }} unoptimized />
                      )}
                      <strong>{row.team}</strong>
                    </div>
                  </td>
                  <td>{row.mp}</td>
                  <td>{row.w}</td>
                  <td>{row.d}</td>
                  <td>{row.l}</td>
                  <td className={styles.hideMobile}>{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                  <td className={styles.ptsCol}>{row.pts}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    لا توجد بيانات ترتيب بعد. سيتم تحديثها تلقائياً.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
