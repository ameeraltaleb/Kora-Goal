# ⚽ منصة كورة غول - Kora Goal

منصة رياضية عربية متكاملة لمتابعة مباريات كرة القدم، الأخبار، والترتيبات مع بث مباشر مجاني.

## 🌟 الميزات

- **📺 بث مباشر**: مشاهدة المباريات بجودة عالية مع دعم سيرفرات متعددة
- **⚡ نتائج مباشرة**: تحديث لحظي للنتائج عبر Supabase Realtime
- **📰 أخبار ذكية**: أخبار رياضية ملخصة بالذكاء الاصطناعي (Google Gemini)
- **🏆 جداول الترتيب**: تحديثات يومية لأهم الدوريات الأوروبية
- **📱 تصميم متجاوب**: واجهة عربية احترافية تعمل على جميع الأجهزة
- **🎨 تصميم عصري**: وضع داكن مع نظام Bento Grid الحديث

## 🚀 البدء السريع

### المتطلبات الأساسية
- Node.js 18+ 
- حساب مجاني على [Supabase](https://supabase.com)
- مفتاح API مجاني من [football-data.org](https://www.football-data.org/client/register)

### خطوات الإعداد

1. **تثبيت المكتبات**:
```bash
npm install
```

2. **إعداد متغيرات البيئة**:
```bash
# انسخ ملف المثال
cp .env.example .env.local

# ثم افتح .env.local واملأ القيم:
# - NEXT_PUBLIC_SUPABASE_URL (من Supabase Dashboard)
# - NEXT_PUBLIC_SUPABASE_ANON_KEY (من Supabase Dashboard)
# - FOOTBALL_API_KEY (من football-data.org)
```

3. **إعداد قاعدة البيانات**:
```bash
# انسخ محتوى ملف supabase_schema.sql
# الصقه في SQL Editor على Supabase Dashboard
# واضغط Run
```

4. **تشغيل التطبيق**:
```bash
npm run dev
```

5. **جلب البيانات الأولية**:
```
http://localhost:3000/api/cron/fetch-matches
http://localhost:3000/api/cron/fetch-news
http://localhost:3000/api/cron/fetch-standings
```

📖 **للتفاصيل الكاملة، راجع**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 🏗️ البنية التقنية

### Frontend
- **Next.js 16** - App Router مع Server Components
- **React 19** - أحدث إصدار
- **TypeScript** - كتابة آمنة
- **CSS Modules** - تصميم معزول

### Backend
- **Supabase** - قاعدة بيانات PostgreSQL + Realtime
- **API Routes** - Next.js Server APIs
- **Vercel Cron** - مهام مجدولة تلقائياً

### خدمات خارجية
- **football-data.org** - بيانات المباريات والنتائج
- **Sport360 RSS** - مصدر الأخبار الرياضية
- **Google Gemini** - تلخيص الأخبار بالذكاء الاصطناعي
- **HLS.js** - تشغيل بث M3U8

## 📁 بنية المشروع

```
src/
├── app/                    # الصفحات (Next.js App Router)
│   ├── page.tsx           # الصفحة الرئيسية
│   ├── match/[id]/        # صفحة المباراة
│   ├── news/              # صفحات الأخبار
│   ├── standings/         # جدول الترتيب
│   ├── admin/             # لوحة التحكم
│   └── api/               # نقاط النهاية API
├── components/            # مكونات React قابلة لإعادة الاستخدام
└── lib/                   # مكتبات مساعدة (Supabase, Gemini, Types)
```

## 🎯Endpoints API

### العامة
- `GET /api/matches?tab=today` - جلب المباريات
- `GET /api/proxy?url=...` - وكيل CORS للبث

### Cron Jobs (تلقائية)
- `/api/cron/fetch-matches` - كل 10 دقائق
- `/api/cron/fetch-news` - كل ساعتين
- `/api/cron/fetch-standings` - يومياً 6 صباحاً
- `/api/cron/update-status` - كل 5 دقائق

### الإدارة
- `/api/admin/generate-news` - توليد أخبار AI يدوياً
- `/api/admin/fetch-external-news` - جلب أخبار خارجية

## 🚀 النشر على Vercel

1. ارفع الكود إلى GitHub
2. اربط المشروع على Vercel
3. أضف متغيرات البيئة في إعدادات Vercel
4. اضغط Deploy!

📝 **ملاحظة**: Cron jobs تعمل تلقائياً بعد النشر حسب الجدول في `vercel.json`

## 📊 قاعدة البيانات

6 جداول رئيسية:
- `matches` - المباريات والنتائج والروابط
- `news` - الأخبار الرياضية
- `standings` - جداول الترتيب
- `reports` - بلاغات الأخطاء
- `analytics` - إحصائيات الزيارات
- `contact_messages` - رسائل التواصل

## 🛠️ التطوير المستقبلي

- [ ] نظام مصادقة للمديرين
- [ ] واجهة CRUD كاملة في لوحة التحكم
- [ ] نظام المفضلة والإشعارات
- [ ] دعم المزيد من الدوريات
- [ ] تطبيق موبايل (React Native)

## 📝 الترخيص

مشروع مفتوح المصدر للاستخدام التعليمي والتجاري.

## 🤝 المساهمة

المساهمات مرحب بها! افتح issue أو pull request.

---

صنع بـ ❤️ لعشاق كرة القدم العربية ⚽
