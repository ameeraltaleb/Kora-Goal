# 🗄️ دليل إعداد قاعدة البيانات - Supabase

> **الوقت المطلوب**: 5-7 دقائق  
> **التكلفة**: مجاني تماماً (خطة Free Tier)

---

## 📋 قبل البدء: ما تحتاجه

- ✅ حساب على Supabase (سأنشئه لك في الخطوات)
- ✅ ملف `supabase_schema.sql` موجود في مشروعك
- ✅ ملف `.env.local` جاهز للتحديث

---

## الخطوة 1: إنشاء حساب Supabase (دقيقة واحدة)

### 1.1 افتح الموقع
```
https://supabase.com
```

### 1.2 سجل دخول
- اضغط على **"Start your project"** أو **"Sign In"**
- يمكنك التسجيل عبر:
  - ✅ GitHub (مستحسن)
  - ✅ Google
  - ✅ Email

---

## الخطوة 2: إنشاء مشروع جديد (دقيقتين)

### 2.1 اضغط على "New Project"
![New Project Button]

### 2.2 املأ البيانات:

| الحقل | القيمة المقترحة |
|-------|-----------------|
| **Name** | `kora-goal` أو `منصة-كورة-غول` |
| **Database Password** | `KoraGoal2026!` (أو أي كلمة مرور قوية - **احفظها!**) |
| **Region** | `West Europe (London)` أو `Frankfurt` (أقرب للشرق الأوسط) |

### 2.3 انتظر دقيقة واحدة
سيظهر لك:
```
✅ Your project is ready!
```

---

## الخطوة 3: الحصول على مفاتيح API (دقيقة واحدة)

### 3.1 اذهب إلى الإعدادات
- من القائمة الجانبية (يسار)، اضغط على **"Settings"** ⚙️ (الترس في الأسفل)
- ثم اضغط على **"API"**

### 3.2 انسخ القيم التالية:

#### **Project URL**
```
https://xxxxxxxxxxxxx.supabase.co
```
(ستجدها في أعلى الصفحة)

#### **anon/public key**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
(ستجدها في قسم "Project API keys")

---

## الخطوة 4: تحديث ملف .env.local (30 ثانية)

### 4.1 افتح الملف
افتح ملف `.env.local` من مجلد المشروع

### 4.2 استبدل القيم الحالية:

#### ❌ قبل (القيم الحالية - placeholder):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### ✅ بعد (استبدلها بقيمك الحقيقية):
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9xxxxxxxxxxxxx

# Gemini AI Configuration
GEMINI_API_KEY=AIzaSyDk2xzBEDZD8uQrUz_oh2yMS5cQevVOqaQ

# Football Data API
FOOTBALL_API_KEY=27a6276346064d37805fc916e9938f60
```

### 4.3 احفظ الملف
`Ctrl + S`

---

## الخطوة 5: إنشاء الجداول في قاعدة البيانات (دقيقتين)

### 5.1 افتح SQL Editor
- من لوحة تحكم Supabase (يسار)
- اضغط على **"SQL Editor"** (أيقونة `</>`)

### 5.2 أنشئ استعلام جديد
- اضغط على **"New query"** (زر أزرق في الأعلى)

### 5.3 انسخ الكود من ملف supabase_schema.sql
1. افتح ملف `supabase_schema.sql` من مشروعك
2. حدد كل شيء (`Ctrl + A`)
3. انسخ (`Ctrl + C`)

### 5.4 الصق ونفّذ
1. الصق الكود في SQL Editor (`Ctrl + V`)
2. اضغط على زر **"Run"** (أسفل يمين الشاشة) أو `Ctrl + Enter`

### 5.5 النتيجة المتوقعة
ستظهر رسالة خضراء:
```
✅ Success. No rows returned
```

أو:
```
✅ CREATE TABLE
✅ CREATE INDEX
```

---

## الخطوة 6: تفعيل Realtime (30 ثانية)

> **مهم**: لتحديث النتائج لحظة بلحظة أثناء المباريات

### 6.1 اذهب إلى Database
- من القائمة الجانبية (يسار)
- اضغط على **"Database"** أو **"Table Editor"**

### 6.2 فعّل Realtime لجدول matches
- اضغط على جدول **"matches"**
- اضغط على **"Enable Realtime"** أو تأكد من أنه مفعّل

### 6.3 طريقة أخرى (من Replication)
- اذهب إلى **Database** → **Replication**
- فعّل **"Realtime"** إذا لم يكن مفعلاً
- أضف جدول `matches` إلى القائمة

---

## الخطوة 7: التحقق من نجاح الإعداد (دقيقة واحدة)

### 7.1 تحقق من الجداول
- من **"Table Editor"** (يسار)
- يجب أن ترى **6 جداول**:
  ```
  ✅ matches
  ✅ news
  ✅ standings
  ✅ reports
  ✅ analytics
  ✅ contact_messages
  ```

### 7.2 تحقق من .env.local
تأكد أن الملف يحتوي على:
- ✅ `NEXT_PUBLIC_SUPABASE_URL` = رابط حقيقي (ليس placeholder)
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` = مفتاح حقيقي (ليس placeholder)

---

## الخطوة 8: إعادة تشغيل الخادم (10 ثواني)

### 8.1 أوقف الخادم الحالي
في Terminal، اضغط:
```
Ctrl + C
```

### 8.2 شغّله مرة أخرى
```bash
npm run dev
```

### 8.3 افتح المتصفح
```
http://localhost:3000
```

---

## الخطوة 9: جلب البيانات الأولية (دقيقة واحدة)

افتح هذه الروابط في المتصفح (واحد تلو الآخر):

### 9.1 جلب المباريات
```
http://localhost:3000/api/cron/fetch-matches
```
**النتيجة المتوقعة:**
```json
{
  "success": true,
  "message": "Processed 4 matches",
  "totalFromAPI": 4
}
```

### 9.2 جلب الترتيب
```
http://localhost:3000/api/cron/fetch-standings
```
**النتيجة المتوقعة:**
```json
{
  "success": true,
  "message": "Updated standings for 4 leagues",
  "totalRows": 80
}
```

### 9.3 جلب الأخبار (اختياري)
```
http://localhost:3000/api/cron/fetch-news
```
**النتيجة المتوقعة:**
```json
{
  "success": true,
  "processedCount": 5
}
```

---

## ✅ التحقق النهائي

افتح `http://localhost:3000` وتحقق من:

| العنصر | يجب أن تراه |
|--------|-------------|
| **الصفحة الرئيسية** | ✅ تحميل بدون أخطاء |
| **المباريات** | ✅ بطاقات مباريات حقيقية |
| **الترتيب** | ✅ جدول الدوري الإنجليزي |
| **الأخبار** | ✅ أخبار (إذا شغلت fetch-news) |

---

## 🐛 حل المشاكل الشائعة

### ❌ مشكلة: "Supabase credentials not configured"
**السبب**: لم تحفظ ملف `.env.local`  
**الحل**: 
1. تأكد من استبدال القيم
2. احفظ الملف (`Ctrl + S`)
3. أعد تشغيل الخادم (`Ctrl + C` ثم `npm run dev`)

---

### ❌ مشكلة: "relation matches does not exist"
**السبب**: لم تنفذ ملف `supabase_schema.sql`  
**الحل**:
1. افتح SQL Editor في Supabase
2. الصق محتوى الملف
3. اضغط Run

---

### ❌ مشكلة: "Invalid API key"
**السبب**: نسخت المفتاح خطأ  
**الحل**:
1. اذهب إلى Settings → API
2. انسخ `anon public` كاملاً
3. تأكد أنه يبدأ بـ `eyJhbGci...`
4. الصقه في `.env.local`

---

### ❌ مشكلة: الصفحة فارغة/بيضاء
**السبب**: البيانات لم تُجلب بعد  
**الحل**:
1. شغّل `/api/cron/fetch-matches`
2. ثم `/api/cron/fetch-standings`
3. أعد تحميل الصفحة

---

## 📊 مثال كامل لملف .env.local الناجح

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlicHJyeWx4ZnB6bHFtbmllY2VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxMDAwMDAwMH0.abcdef123456789

# Gemini AI Configuration
GEMINI_API_KEY=AIzaSyDk2xzBEDZD8uQrUz_oh2yMS5cQevVOqaQ

# Football Data API
FOOTBALL_API_KEY=27a6276346064d37805fc916e9938f60

# Optional: Cron job security
# CRON_SECRET=my-secret-string-123
```

---

## 🎯 ملخص الخطوات السريع

```
1. سجّل في supabase.com
2. أنشئ مشروع جديد
3. انسخ URL و ANON KEY
4. الصقهم في .env.local
5. نفّذ ملف supabase_schema.sql
6. فعّل Realtime
7. أعد تشغيل npm run dev
8. شغّل /api/cron/fetch-matches
9. ✅ جاهز!
```

---

## 📞 للمساعدة

إذا واجهت مشكلة:
1. تحقق من Console في المتصفح (`F12`)
2. تحقق من Terminal للأخطاء
3. تأكد من `.env.local`
4. تأكد من أن الجداول موجودة في Supabase

---

**الوقت الإجمالي**: ~7 دقائق  
**التكلفة**: مجاني 💚  
**الصعوبة**: سهلة ⭐⭐
