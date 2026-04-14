import styles from './MiniStandingsWidget.module.css';

interface StandingsRow {
  id: number;
  position: number;
  team: string;
  mp: number;
  pts: number;
}

interface MiniStandingsWidgetProps {
  title: string;
  rows: StandingsRow[];
}

export default function MiniStandingsWidget({ title, rows }: MiniStandingsWidgetProps) {
  return (
    <div className={styles.widgetCard}>
      <div className={styles.widgetHeader}>
        <span className={styles.widgetTitle}>{title}</span>
      </div>
      <div className={styles.widgetBody}>
        <table className={styles.miniTable}>
          <thead>
            <tr>
              <th>#</th>
              <th style={{ textAlign: 'right' }}>الفريق</th>
              <th>لعب</th>
              <th>نقاط</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? rows.map((row) => (
              <tr key={row.id}>
                <td className={styles.posCell}>{row.position}</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{row.team}</td>
                <td>{row.mp}</td>
                <td className={styles.pointsCell}>{row.pts}</td>
              </tr>
            )) : (
              <tr><td colSpan={4} className={styles.emptyMsg}>سيتم التحديث قريباً</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
