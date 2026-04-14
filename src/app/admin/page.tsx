"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import SyncButton from '@/components/SyncButton';

interface AdminStats {
  totalMatches: number;
  totalNews: number;
  totalStandings: number;
  liveMatches: number;
  upcomingMatches: number;
  unreadMessages: number;
}

interface AdminData {
  success: boolean;
  stats: AdminStats;
  recent: {
    matches: any[];
    news: any[];
    messages: any[];
    reports: any[];
    upcoming: any[];
    live: any[];
  };
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'news' | 'messages'>('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/dashboard');
      const jsonData = await res.json();
      setData(jsonData);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      live: 'var(--primary-color)',
      upcoming: '#00d2ff',
      finished: '#888',
    };
    return (
      <span className={styles.statusBadge} style={{ backgroundColor: colors[status] || '#888' }}>
        {status === 'live' ? 'مباشر' : status === 'upcoming' ? 'قادم' : 'انتهى'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>جاري تحميل لوحة التحكم...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.errorContainer}>
        <p>حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى.</p>
        <button onClick={fetchDashboardData} className={styles.retryBtn}>إعادة المحاولة</button>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <h2 className={styles.adminTitle}>
          كورة <span className={styles.greenText}>غول</span>
        </h2>
        <p className={styles.adminSubtitle}>لوحة التحكم</p>

        <nav className={styles.adminNav}>
          <button
            className={activeTab === 'overview' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveTab('overview')}
          >
            📊 نظرة عامة
          </button>
          <button
            className={activeTab === 'matches' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveTab('matches')}
          >
            ⚽ المباريات
          </button>
          <button
            className={activeTab === 'news' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveTab('news')}
          >
            📰 الأخبار
          </button>
          <button
            className={activeTab === 'messages' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveTab('messages')}
          >
            💬 الرسائل
            {data.stats.unreadMessages > 0 && (
              <span className={styles.badge}>{data.stats.unreadMessages}</span>
            )}
          </button>
        </nav>

        <Link href="/" className={styles.backSite}>← العودة للموقع</Link>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topHeader}>
          <h1>لوحة التحكم المتقدمة</h1>
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.05)', padding: '5px 10px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>الأخبار:</span>
              <SyncButton type="news" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.05)', padding: '5px 10px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>المباريات:</span>
              <SyncButton type="matches" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.05)', padding: '5px 10px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>الترتيب:</span>
              <SyncButton type="standings" />
            </div>
            <button onClick={fetchDashboardData} className={styles.refreshBtn} title="تحديث الإحصائيات">↻</button>
          </div>
        </header>

        {/* Stats Grid */}
        <section className={styles.statsGrid}>
          <div className={`glass-card ${styles.statCard}`}>
            <span className={styles.statIcon}>⚽</span>
            <span className={styles.statLabel}>إجمالي المباريات</span>
            <span className={styles.statValue}>{data.stats.totalMatches}</span>
          </div>

          <div className={`glass-card ${styles.statCard}`}>
            <span className={styles.statIcon}>🔴</span>
            <span className={styles.statLabel}>مباريات مباشرة</span>
            <span className={styles.statValue} style={{ color: 'var(--primary-color)' }}>
              {data.stats.liveMatches}
            </span>
          </div>

          <div className={`glass-card ${styles.statCard}`}>
            <span className={styles.statIcon}>📰</span>
            <span className={styles.statLabel}>الأخبار</span>
            <span className={styles.statValue}>{data.stats.totalNews}</span>
          </div>

          <div className={`glass-card ${styles.statCard}`}>
            <span className={styles.statIcon}>💬</span>
            <span className={styles.statLabel}>رسائل غير مقروءة</span>
            <span className={styles.statValue} style={{ color: data.stats.unreadMessages > 0 ? '#ffd700' : '#888' }}>
              {data.stats.unreadMessages}
            </span>
          </div>
        </section>

        {/* Content based on active tab */}
        <div className={styles.contentArea}>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className={styles.bottomGrid}>
              {/* Live Matches */}
              <section className={`glass-card ${styles.section}`}>
                <h3>🔴 المباريات المباشرة</h3>
                {data.recent.live.length > 0 ? (
                  <div className={styles.list}>
                    {data.recent.live.map(match => (
                      <div key={match.id} className={styles.listItem}>
                        <div className={styles.listItemContent}>
                          <strong>{match.home_team} vs {match.away_team}</strong>
                          <span className={styles.listItemMeta}>{match.tournament}</span>
                        </div>
                        <span className={styles.score}>{match.score}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.emptyText}>لا توجد مباريات مباشرة حالياً</p>
                )}
              </section>

              {/* Recent News */}
              <section className={`glass-card ${styles.section}`}>
                <h3>📰 آخر الأخبار</h3>
                {data.recent.news.length > 0 ? (
                  <div className={styles.list}>
                    {data.recent.news.slice(0, 5).map(news => (
                      <div key={news.id} className={styles.listItem}>
                        <div className={styles.listItemContent}>
                          <strong>{news.title}</strong>
                          <span className={styles.listItemMeta}>
                            {new Date(news.created_at).toLocaleDateString('ar')}
                          </span>
                        </div>
                        <span className={styles.categoryTag}>{news.category}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.emptyText}>لا توجد أخبار حالياً</p>
                )}
              </section>

              {/* Health Monitor */}
              <section className={`glass-card ${styles.section}`}>
                <h3>🔍 مراقب الصحة</h3>
                {data.recent.reports.length > 0 ? (
                  <div className={styles.feed}>
                    {data.recent.reports.map(report => (
                      <div key={report.id} className={styles.feedItem}>
                        <div className={styles.dot} style={{ backgroundColor: report.status === 'pending' ? '#ff4757' : '#00ff88' }}></div>
                        <div className={styles.feedText}>
                          <p>بلاغ عن سيرفر في مباراة {report.matches?.home_team} vs {report.matches?.away_team}</p>
                          <span>{new Date(report.created_at).toLocaleString('ar')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.emptyText}>جميع السيرفرات تعمل بشكل طبيعي ✅</p>
                )}
              </section>

              {/* Upcoming Matches */}
              <section className={`glass-card ${styles.section}`}>
                <h3>⏰ المباريات القادمة</h3>
                {data.recent.upcoming.length > 0 ? (
                  <div className={styles.list}>
                    {data.recent.upcoming.map(match => (
                      <div key={match.id} className={styles.listItem}>
                        <div className={styles.listItemContent}>
                          <strong>{match.home_team} vs {match.away_team}</strong>
                          <span className={styles.listItemMeta}>
                            {new Date(match.match_time).toLocaleString('ar')}
                          </span>
                        </div>
                        {getStatusBadge(match.status)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.emptyText}>لا توجد مباريات قادمة</p>
                )}
              </section>
            </div>
          )}

          {/* Matches Tab */}
          {activeTab === 'matches' && (
            <section className={`glass-card ${styles.fullSection}`}>
              <div className={styles.sectionHeader}>
                <h3>إدارة المباريات</h3>
                <button className={styles.addBtn}>+ إضافة مباراة جديدة</button>
              </div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>المباراة</th>
                    <th>البطولة</th>
                    <th>الحالة</th>
                    <th>النتيجة</th>
                    <th>الوقت</th>
                    <th>الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent.matches.map(match => (
                    <tr key={match.id}>
                      <td><strong>{match.home_team} ضد {match.away_team}</strong></td>
                      <td>-</td>
                      <td>{getStatusBadge(match.status)}</td>
                      <td>{match.score || '0 - 0'}</td>
                      <td>{new Date(match.match_time).toLocaleString('ar')}</td>
                      <td>
                        <button className={styles.editBtn}>تعديل</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* News Tab */}
          {activeTab === 'news' && (
            <section className={`glass-card ${styles.fullSection}`}>
              <div className={styles.sectionHeader}>
                <h3>إدارة الأخبار</h3>
                <button className={styles.addBtn}>+ توليد أخبار جديدة</button>
              </div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>العنوان</th>
                    <th>التصنيف</th>
                    <th>التاريخ</th>
                    <th>الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent.news.map(news => (
                    <tr key={news.id}>
                      <td><strong>{news.title}</strong></td>
                      <td><span className={styles.categoryTag}>{news.category}</span></td>
                      <td>{new Date(news.created_at).toLocaleDateString('ar')}</td>
                      <td>
                        <button className={styles.editBtn}>عرض</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <section className={`glass-card ${styles.fullSection}`}>
              <h3>رسائل الاتصال</h3>
              {data.recent.messages.length > 0 ? (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>الاسم</th>
                      <th>البريد الإلكتروني</th>
                      <th>الرسالة</th>
                      <th>الحالة</th>
                      <th>التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent.messages.map(msg => (
                      <tr key={msg.id}>
                        <td>{msg.name}</td>
                        <td>{msg.email}</td>
                        <td className={styles.messageCell}>{msg.message.substring(0, 50)}...</td>
                        <td>
                          <span className={msg.is_read ? styles.readBadge : styles.unreadBadge}>
                            {msg.is_read ? 'مقروء' : 'غير مقروء'}
                          </span>
                        </td>
                        <td>{new Date(msg.created_at).toLocaleString('ar')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className={styles.emptyText}>لا توجد رسائل</p>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
