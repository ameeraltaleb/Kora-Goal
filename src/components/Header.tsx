"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/news?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <Link href="/">
            <div className={styles.logoWrapper}>
              <Image
                src="/logo.png"
                alt="Kora Goal Logo"
                width={50}
                height={50}
                className={styles.logoImage}
              />
              <span className={styles.logoText}>كورة <span className={styles.greenText}>غول</span></span>
            </div>
          </Link>
        </div>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>الرئيسية</Link>
          <Link href="/standings" className={styles.navLink}>الترتيب</Link>
          <Link href="/scorers" className={styles.navLink}>الهدافين</Link>
          <Link href="/news" className={styles.navLink}>الأخبار</Link>
        </nav>

        <div className={styles.searchSection}>
          <form onSubmit={handleSearch} className={styles.searchBox}>
            <input
              type="text"
              placeholder="ابحث عن مباراة أو قناة..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className={styles.searchBtn}>
              <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
