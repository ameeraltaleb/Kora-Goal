"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Breadcrumb.module.css';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className={styles.breadcrumb} aria-label="مسار التنقل">
      <ol className={styles.list}>
        <li className={styles.item}>
          <Link href="/" className={styles.link}>الرئيسية</Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className={styles.item}>
            <span className={styles.separator}>/</span>
            {item.href ? (
              <Link href={item.href} className={styles.link}>{item.label}</Link>
            ) : (
              <span className={styles.current} aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
