import styles from './SidePlaylist.module.css';
import Image from 'next/image';
import Link from 'next/link';

interface SidePlaylistProps {
  items: { id: number; title: string; subtitle: string; logo: string; score?: string }[];
  activeId?: number;
}

export default function SidePlaylist({ items, activeId }: SidePlaylistProps) {
  return (
    <div className={`glass-card ${styles.playlist}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>قنوات أخرى ومباريات جارية</h3>
        <p className={styles.subtitle}>{items.length} مصادر متاحة</p>
      </div>

      <div className={styles.list}>
        {items.map((item) => (
          <Link key={item.id} href={`/match/${item.id}`}>
            <div className={`${styles.item} ${activeId === item.id ? styles.active : ''}`}>
              <div className={styles.logoAndTitle}>
                <Image src={item.logo} alt={item.title} width={30} height={30} className={styles.logo} />
                <div className={styles.text}>
                  <span className={styles.itemTitle}>{item.title}</span>
                  <span className={styles.itemSubtitle}>{item.subtitle}</span>
                </div>
              </div>
              {item.score && <span className={styles.itemScore}>{item.score}</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
