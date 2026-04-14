# 🏗️ البنية المعمارية لمنصة كورة غول

## 📐 مخطط البنية العامة

```
┌─────────────────────────────────────────────────────────────┐
│                     المستخدم (Browser)                       │
│                  http://localhost:3000                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Vercel / Local Server                       │
│                   Next.js 16.2.3                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   الصفحات    │  │  API Routes  │  │   Components │      │
│  │   (Pages)    │  │  (Backend)   │  │   (UI)       │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         ▼                  ▼                  ▼              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ /            │  │ /api/matches │  │ Header       │      │
│  │ /match/[id]  │  │ /api/proxy   │  │ Footer       │      │
│  │ /news        │  │ /api/cron/*  │  │ MatchSchedule│      │
│  │ /standings   │  │ /api/admin/* │  │ VideoPlayer  │      │
│  │ /admin       │  │ /api/contact │  │ NewsTicker   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   خدمات خارجية (External APIs)               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ football-data.org│  │ Sport360 RSS     │                │
│  │ (مباريات ونتائج) │  │ (أخبار رياضية)   │                │
│  └────────┬─────────┘  └────────┬─────────┘                │
│           │                      │                          │
│           ▼                      ▼                          │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ Google Gemini AI │  │ HLS Streams      │                │
│  │ (تلخيص الأخبار)  │  │ (بث مباشر)       │                │
│  └──────────────────┘  └──────────────────┘                │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase (PostgreSQL)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐  ┌────────┐  ┌──────────┐  ┌──────────┐     │
│  │ matches  │  │  news  │  │standings │  │  reports │     │
│  └──────────┘  └────────┘  └──────────┘  └──────────┘     │
│  ┌──────────┐  ┌──────────────┐                           │
│  │analytics │  │  contact_    │                           │
│  │          │  │  messages    │                           │
│  └──────────┘  └──────────────┘                           │
│                                                               │
│  ┌──────────────────────────────────────┐                  │
│  │    Realtime Subscriptions            │                  │
│  │    (Live Score Updates)              │                  │
│  └──────────────────────────────────────┘                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 تدفق البيانات (Data Flow)

### 1️⃣ جلب المباريات

```
football-data.org API
       │
       ▼ (HTTP Request)
/api/cron/fetch-matches
       │
       ▼ (Parse & Transform)
Supabase: matches table
       │
       ▼ (Realtime Subscription)
/match/[id] page
       │
       ▼ (Display)
User Browser
```

### 2️⃣ جلب الأخبار

```
Sport360 RSS Feed
       │
       ▼ (RSS Parser)
/api/cron/fetch-news
       │
       ▼ (AI Summarization)
Google Gemini API
       │
       ▼ (Store)
Supabase: news table
       │
       ▼ (Fetch)
/ and /news pages
       │
       ▼ (Display)
User Browser
```

### 3️⃣ البث المباشر

```
User clicks match
       │
       ▼
/match/[id] page loads
       │
       ▼
VideoPlayer component
       │
       ├─► HLS.js (for .m3u8)
       │      │
       │      ▼
       │   Stream Server 1
       │      │
       │      ▼ (Error?)
       │   Auto-switch to Server 2
       │
       └─► iframe (for embed URLs)
              │
              ▼
           External Player
```

### 4️⃣ تحديث الحالة تلقائياً

```
Every 5 minutes
       │
       ▼
/api/cron/update-status
       │
       ├─► upcoming → live (if time reached)
       │
       └─► live → finished (if 2h passed)
              │
              ▼
         Supabase: matches table
              │
              ▼ (Realtime)
         Connected clients update
```

---

## 📂 هيكل الملفات التفصيلي

```
منصة كورة غول/
│
├── 📄 التوثيق (Documentation)
│   ├── README.md                    ← نظرة عامة على المشروع
│   ├── QUICKSTART.md                ← دليل البدء السريع (5 دقائق)
│   ├── SETUP_GUIDE.md               ← دليل الإعداد الشامل
│   ├── PROJECT_SUMMARY.md           ← ملخص المشروع الكامل
│   ├── COMPLETION_REPORT.md         ← تقرير الإنجاز
│   ├── CHANGELOG.md                 ← سجل التغييرات
│   └── ARCHITECTURE.md              ← هذا الملف
│
├── ⚙️ الإعداد (Configuration)
│   ├── .env.local                   ← متغيرات البيئة (محلي)
│   ├── .env.example                 ← قالب المتغيرات
│   ├── .gitignore                   ← ملفات مستبعدة من Git
│   ├── package.json                 ← المكتبات والتبعيات
│   ├── tsconfig.json                ← إعدادات TypeScript
│   ├── next.config.ts               ← إعدادات Next.js
│   ├── vercel.json                  ← إعدادات Vercel + Cron
│   ├── eslint.config.mjs            ← إعدادات ESLint
│   └── supabase_schema.sql          ← مخطط قاعدة البيانات
│
├── 🎨 الواجهة الأمامية (Frontend)
│   └── src/
│       ├── app/                     ← Next.js App Router
│       │   ├── layout.tsx           ← التخطيط الأساسي (RTL)
│       │   ├── page.tsx             ← الصفحة الرئيسية (Bento)
│       │   ├── loading.tsx          ← حالة التحميل
│       │   ├── error.tsx            ← صفحة الخطأ
│       │   ├── not-found.tsx        ← صفحة 404
│       │   ├── favicon.ico          ← أيقونة الموقع
│       │   ├── robots.ts            ← ملف Robots.txt
│       │   ├── sitemap.ts           ← ملف Sitemap
│       │   │
│       │   ├── about/               ← صفحة عن الموقع
│       │   │   └── page.tsx
│       │   │
│       │   ├── contact/             ← صفحة الاتصال
│       │   │   └── page.tsx
│       │   │
│       │   ├── dmca/                ← صفحة DMCA
│       │   │   └── page.tsx
│       │   │
│       │   ├── privacy-policy/      ← سياسة الخصوصية
│       │   │   └── page.tsx
│       │   │
│       │   ├── terms/               ← شروط الاستخدام
│       │   │   └── page.tsx
│       │   │
│       │   ├── standings/           ← جدول الترتيب
│       │   │   ├── page.tsx
│       │   │   └── page.module.css
│       │   │
│       │   ├── news/                ← الأخبار
│       │   │   ├── page.tsx         ← قائمة الأخبار
│       │   │   └── [slug]/page.tsx  ← خبر فردي
│       │   │
│       │   ├── match/               ← المباريات
│       │   │   └── [id]/
│       │   │       ├── page.tsx     ← تفاصيل المباراة
│       │   │       └── page.module.css
│       │   │
│       │   ├── admin/               ← لوحة التحكم
│       │   │   ├── page.tsx         ← واجهة الإدارة
│       │   │   └── page.module.css
│       │   │
│       │   └── api/                 ← نقاط النهاية API
│       │       ├── matches/
│       │       │   └── route.ts     ← جلب المباريات
│       │       │
│       │       ├── proxy/
│       │       │   └── route.ts     ← وكيل CORS
│       │       │
│       │       ├── contact/
│       │       │   └── route.ts     ← نموذج الاتصال
│       │       │
│       │       ├── cron/            ← المهام المجدولة
│       │       │   ├── fetch-matches/
│       │       │   │   └── route.ts
│       │       │   ├── fetch-news/
│       │       │   │   └── route.ts
│       │       │   ├── fetch-standings/
│       │       │   │   └── route.ts
│       │       │   └── update-status/
│       │       │       └── route.ts
│       │       │
│       │       └── admin/
│       │           ├── dashboard/
│       │           │   └── route.ts ← إحصائيات الإدارة
│       │           ├── generate-news/
│       │           │   └── route.ts ← توليد أخبار AI
│       │           └── fetch-external-news/
│       │               └── route.ts ← جلب أخبار خارجية
│       │
│       ├── components/              ← مكونات React
│       │   ├── Header.tsx           ← شريط التنقل العلوي
│       │   ├── Footer.tsx           ← تذييل الصفحة
│       │   ├── MatchSchedule.tsx    ← جدول المباريات (تبويبات)
│       │   ├── MatchCard.tsx        ← بطاقة المباراة
│       │   ├── VideoPlayer.tsx      ← مشغل الفيديو (HLS)
│       │   ├── NewsTicker.tsx       ← شريط الأخبار المتحرك
│       │   ├── SidePlaylist.tsx     ← القائمة الجانبية
│       │   └── SyncButton.tsx       ← زر المزامنة
│       │
│       └── lib/                     ← مكتبات مساعدة
│           ├── supabase.ts          ← عميل Supabase
│           ├── gemini.ts            ← عميل Google Gemini
│           ├── types.ts             ← تعريفات TypeScript
│           └── useRealtimeMatch.ts  ← Realtime Hook
│
├── 🧪 الاختبار (Testing)
│   ├── test-app.bat                 ← سكريبت اختبار (Windows)
│   └── test-app.sh                  ← سكريبت اختبار (Linux/Mac)
│
├── 🌐 العام (Public)
│   └── public/                      ← الملفات العامة
│       └── (static assets)
│
└── 🔧 البناء (Build)
    ├── .next/                       ← ملفات البناء (توليد تلقائي)
    └── node_modules/                ← المكتبات المحملة
```

---

## 🔌 تدفق الطلبات (Request Flow)

### طلب صفحة رئيسية

```
User → http://localhost:3000/
  │
  ▼
Next.js Router
  │
  ├─► Server Component (page.tsx)
  │     │
  │     ├─► Fetch /api/matches (live matches)
  │     ├─► Fetch /api/news (latest 6)
  │     └─► Fetch /api/standings (PL top 5)
  │     │
  │     ▼
  │   Render HTML
  │     │
  │     ▼
  │   Send to Browser
  │
  └─► Client Components hydrate
        │
        ├─► MatchSchedule fetches matches
        ├─► NewsTicker starts scrolling
        └─► Realtime subscribes to live scores
```

### طلب صفحة مباراة

```
User → http://localhost:3000/match/123
  │
  ▼
Next.js Router (dynamic route)
  │
  ▼
Server Component
  │
  ├─► Fetch match where id=123
  ├─► Fetch other matches (sidebar)
  │
  ▼
Render page with:
  ├─► VideoPlayer (servers array)
  ├─► SidePlaylist (other matches)
  └─► Match details
  │
  ▼
Send to Browser
  │
  ▼
Client hydration
  │
  └─► VideoPlayer initializes HLS
        │
        ├─► Load .m3u8 stream
        ├─► Handle errors
        └─► Auto-switch servers if needed
```

### Cron Job تلقائي

```
Vercel Cron Scheduler (every 10 min)
  │
  ▼
GET /api/cron/fetch-matches
  │
  ▼
Fetch football-data.org API
  │
  ▼
Parse match data
  │
  ├─► For each match:
  │     │
  │     ├─► Check if exists (external_id)
  │     │
  │     ├─► Update if exists (status, score)
  │     └─► Insert if new (with default servers)
  │
  ▼
Supabase: matches table updated
  │
  ▼
Realtime notifies connected clients
```

---

## 🗄️ مخطط قاعدة البيانات

```
┌─────────────────────────────────────────┐
│              matches                     │
├─────────────────────────────────────────┤
│ id (PK)          │ SERIAL               │
│ home_team        │ TEXT                 │
│ home_logo        │ TEXT                 │
│ away_team        │ TEXT                 │
│ away_logo        │ TEXT                 │
│ match_time       │ TIMESTAMP            │
│ status           │ TEXT (upcoming/live/ │
│                  │         finished)     │
│ score            │ TEXT                 │
│ tournament       │ TEXT                 │
│ channel          │ TEXT                 │
│ commentator      │ TEXT                 │
│ servers          │ JSONB [{url, label}] │
│ external_id      │ TEXT (UNIQUE)        │
│ created_at       │ TIMESTAMP            │
└─────────────────────────────────────────┘
                  │
                  │ Realtime
                  ▼
          Connected Clients

┌─────────────────────────────────────────┐
│                news                      │
├─────────────────────────────────────────┤
│ id (PK)          │ SERIAL               │
│ title            │ TEXT                 │
│ summary          │ TEXT                 │
│ content          │ TEXT                 │
│ image_url        │ TEXT                 │
│ category         │ TEXT (football/      │
│                  │         transfers/    │
│                  │         analysis)     │
│ is_ai_generated  │ BOOLEAN              │
│ source_url       │ TEXT                 │
│ source_name      │ TEXT                 │
│ slug             │ TEXT (UNIQUE)        │
│ created_at       │ TIMESTAMP            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│             standings                    │
├─────────────────────────────────────────┤
│ id (PK)          │ SERIAL               │
│ league_code      │ TEXT (PL/PD/BL1/SA)  │
│ league_name      │ TEXT                 │
│ team             │ TEXT                 │
│ team_logo        │ TEXT                 │
│ position         │ INT                  │
│ mp               │ INT (matches played) │
│ w                │ INT (wins)           │
│ d                │ INT (draws)          │
│ l                │ INT (losses)         │
│ gf               │ INT (goals for)      │
│ ga               │ INT (goals against)  │
│ gd               │ INT (goal diff)      │
│ pts              │ INT (points)         │
│ updated_at       │ TIMESTAMP            │
│                  │                      │
│ UNIQUE(league_code, team)               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│              reports                     │
├─────────────────────────────────────────┤
│ id (PK)          │ SERIAL               │
│ match_id         │ INT (FK→matches)     │
│ server_index     │ INT                  │
│ status           │ TEXT (pending/       │
│                  │         resolved)     │
│ created_at       │ TIMESTAMP            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│             analytics                    │
├─────────────────────────────────────────┤
│ id (PK)          │ SERIAL               │
│ page_path        │ TEXT (UNIQUE)        │
│ visitor_count    │ INT                  │
│ last_visit       │ TIMESTAMP            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         contact_messages                 │
├─────────────────────────────────────────┤
│ id (PK)          │ SERIAL               │
│ name             │ TEXT                 │
│ email            │ TEXT                 │
│ message          │ TEXT                 │
│ is_read          │ BOOLEAN              │
│ created_at       │ TIMESTAMP            │
└─────────────────────────────────────────┘
```

---

## 🔐 الأمان

```
┌─────────────────────────────────────────┐
│         Security Layers                 │
├─────────────────────────────────────────┤
│                                         │
│  1. CORS Protection                     │
│     └─► Proxy endpoint validates origin │
│                                         │
│  2. API Key Protection                  │
│     └─► FOOTBALL_API_KEY in .env        │
│     └─► GEMINI_API_KEY in .env          │
│                                         │
│  3. Cron Secret (Optional)              │
│     └─► CRON_SECRET for authorization   │
│                                         │
│  4. Supabase RLS (Row Level Security)   │
│     └─► Can be enabled for auth         │
│                                         │
│  5. Environment Variables               │
│     └─► .env.local not in Git           │
│     └─► .gitignore configured           │
│                                         │
└─────────────────────────────────────────┘
```

---

## ⚡ الأداء والتحسينات

```
┌─────────────────────────────────────────┐
│         Performance Optimizations       │
├─────────────────────────────────────────┤
│                                         │
│  ✓ Static Generation (SSG)              │
│     └─► Home page revalidates every 60s │
│     └─► News revalidates every 2m       │
│     └─► Standings revalidates every 5m  │
│                                         │
│  ✓ Server Components                    │
│     └─► No client-side JS for rendering │
│     └─► Better SEO and performance      │
│                                         │
│  ✓ Image Optimization                   │
│     └─► Next.js Image component         │
│     └─► Lazy loading                    │
│     └─► Proper sizing                   │
│                                         │
│  ✓ Caching Strategy                     │
│     └─► Supabase queries cached         │
│     └─► API responses cached            │
│                                         │
│  ✓ Code Splitting                       │
│     └─► Automatic per route             │
│     └─► Client components separate      │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎯 ملخص البنية

**البنية العامة**: Next.js App Router مع Server Components

**قاعدة البيانات**: PostgreSQL عبر Supabase مع Realtime

**التخزين**: Vercel (Static) + Supabase (Database)

**الخدمات الخارجية**:
- football-data.org (بيانات المباريات)
- Sport360 RSS (الأخبار)
- Google Gemini (AI تلخيص)
- HLS Servers (البث)

**التحديث التلقائي**: Vercel Cron Jobs

**حالة المشروع**: ✅ جاهز للإنتاج

---

**آخر تحديث**: 14 أبريل 2026  
**الإصدار**: 1.0.0
