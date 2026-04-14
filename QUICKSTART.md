# 🚀 البدء السريع - Kora Goal

> دليل سريع من 5 خطوات لتشغيل التطبيق

---

## ⏱️ الوقت المطلوب: 10 دقائق

---

## الخطوة 1: إعداد Supabase (3 دقائق)

### 1.1 إنشاء مشروع
1. افتح https://supabase.com
2. سجل دخول أو أنشئ حساب جديد
3. اضغط **New Project**
4. املأ:
   - **Name**: `kora-goal`
   - **Password**: (احفظها!)
   - **Region**: `Frankfurt` (لأفضل أداء في الشرق الأوسط)
5. انتظر دقيقة حتى ينتهي الإنشاء

### 1.2 الحصول على المفاتيح
1. اذهب إلى **Settings** (الترس) → **API**
2. انسخ:
   - **Project URL** → `https://xxxxx.supabase.co`
   - **anon public key** → `eyJhbGci...`

### 1.3 إنشاء الجداول
1. اذهب إلى **SQL Editor** (أيقونة `</>`)
2. اضغط **New query**
3. افتح ملف `supabase_schema.sql` من المشروع
4. انسخ كل شيء والصقه في المحرر
5. اضغط **Run** ✓

---

## الخطوة 2: الحصول على Football API Key (2 دقائق)

1. افتح https://www.football-data.org/client/register
2. أدخل بريدك الإلكتروني
3. اضغط **Register**
4. انسخ **API Key** الذي سيظهر

---

## الخطوة 3: تحديث .env.local (1 دقيقة)

افتح ملف `.env.local` واستبدل:

```env
# من Supabase Dashboard
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# من football-data.org
FOOTBALL_API_KEY=your-api-key-here
```

---

## الخطوة 4: تشغيل التطبيق (1 دقيقة)

افتح Terminal واكتب:

```bash
# تثبيت المكتبات (أول مرة فقط)
npm install

# تشغيل التطبيق
npm run dev
```

سيظهر:
```
✓ Ready in 3.2s
- Local: http://localhost:3000
```

---

## الخطوة 5: جلب البيانات الأولية (3 دقائق)

افتح هذه الروابط في المتصفح (واحد تلو الآخر):

### 1. جلب المباريات
```
http://localhost:3000/api/cron/fetch-matches
```
يجب أن ترى: `{"success": true, "message": "Processed X matches"}`

### 2. جلب الأخبار
```
http://localhost:3000/api/cron/fetch-news
```
يجب أن ترى: `{"success": true, "processedCount": X}`

### 3. جلب الترتيب
```
http://localhost:3000/api/cron/fetch-standings
```
يجب أن ترى: `{"success": true, "totalRows": X}`

---

## ✅ تهانينا! التطبيق جاهز

افتح http://localhost:3000 واستمتع!

---

## 🎯 الروابط المهمة

| الصفحة | الرابط |
|--------|--------|
| الرئيسية | http://localhost:3000 |
| المباريات | http://localhost:3000/match/[id] |
| الترتيب | http://localhost:3000/standings |
| الأخبار | http://localhost:3000/news |
| لوحة التحكم | http://localhost:3000/admin |

---

## 🔧 حل المشاكل الشائعة

### ❌ "Supabase credentials not configured"
**الحل**: تأكد من صحة URL و ANON_KEY في `.env.local`

### ❌ "لا توجد مباريات"
**الحل**: شغل `/api/cron/fetch-matches` وتحقق من `FOOTBALL_API_KEY`

### ❌ "FOOTBALL_API_KEY is not configured"
**الحل**: أضف المفتاح من الخطوة 2

### ❌ التطبيق لا يعمل
**الحل**: 
```bash
# أوقف التطبيق (Ctrl+C)
# ثم شغله مرة أخرى
npm run dev
```

---

## 📚 للمزيد من المساعدة

- 📖 `SETUP_GUIDE.md` - دليل شامل بالعربية
- 📊 `COMPLETION_REPORT.md` - تقرير الإكمال
- 📝 `README.md` - معلومات المشروع

---

## 🎉 الخطوات التالية

بعد تشغيل التطبيق:

1. استكشف الصفحة الرئيسية
2. افتح صفحة مباراة
3. جرب لوحة التحكم `/admin`
4. شغل Cron Jobs تلقائياً عند النشر على Vercel

---

**ملاحظة**: Cron Jobs ستعمل تلقائياً كل:
- 10 دقائق: المباريات
- ساعتين: الأخبار  
- يومياً: الترتيب

---

⚽ صنع بـ ❤️ لعشاق كرة القدم
