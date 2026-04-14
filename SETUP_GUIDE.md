# 🚀 دليل إكمال إعداد منصة كورة غول

## الخطوة 1: إعداد قاعدة بيانات Supabase

### 1.1 إنشاء مشروع Supabase
1. اذهب إلى https://supabase.com
2. سجل حساب مجاني أو سجل دخول
3. اضغط على **New Project**
4. اختر:
   - **Project name**: `kora-goal` (أو أي اسم تريده)
   - **Database Password**: اختر كلمة مرور قوية واحفظها
   - **Region**: أقرب سيرفر لموقعك (مثلاً `Europe - Frankfurt` للشرق الأوسط)
5. اضغط **Create new project** وانتظر دقيقة حتى يتم الإنشاء

### 1.2 الحصول على مفاتيح API
1. بعد إنشاء المشروع، اذهب إلى **Project Settings** (الترس في الأسفل)
2. اختر **API** من القائمة الجانبية
3. انسخ القيم التالية:
   - **Project URL** → الصقه في `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → الصقه في `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 1.3 إنشاء الجداول
1. في لوحة تحكم Supabase، اذهب إلى **SQL Editor** (أيقونة `</>`)
2. اضغط **New query**
3. انسخ كامل محتوى ملف `supabase_schema.sql` والصقه في المحرر
4. اضغط **Run** لتنفيذ الاستعلامات وإنشاء جميع الجداول

### 1.4 تفعيل Realtime (للبث المباشر)
1. اذهب إلى **Database** > **Replication**
2. فعل **Realtime** إذا لم يكن مفعلاً
3. أضف جدول `matches` إلى قائمة Realtime:
   - اذهب إلى **Database** > **Tables**
   - اختر جدول `matches`
   - فعّل **Enable Realtime**

---

## الخطوة 2: إعداد API كرة القدم

### 2.1 التسجيل في football-data.org
1. اذهب إلى https://www.football-data.org/client/register
2. سجل بريدك الإلكتروني واحصل على **API Key** مجاني
3. انسخ المفتاح والصقه في `FOOTBALL_API_KEY` في ملف `.env.local`

**ملاحظة**: الخطة المجانية تسمح بـ 10 طلبات/دقيقة وهو كافٍ للتشغيل

---

## الخطوة 3: تحديث ملف .env.local

افتح ملف `.env.local` واملأ القيم:

```env
# Supabase - من الخطوة 1.2
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# Gemini AI - موجود بالفعل
GEMINI_API_KEY=AIzaSyDk2xzBEDZD8uQrUz_oh2yMS5cQevVOqaQ

# Football Data - من الخطوة 2.1
FOOTBALL_API_KEY=your-football-api-key-here

# اختياري: لحماية cron jobs
CRON_SECRET=any-random-string-here
```

---

## الخطوة 4: تشغيل التطبيق

```bash
# تثبيت المكتبات (إذا لم تكن مثبتة)
npm install

# تشغيل وضع التطوير
npm run dev
```

افتح المتصفح على: http://localhost:3000

---

## الخطوة 5: جلب البيانات الأولية

بعد تشغيل التطبيق، افتح الروابط التالية في المتصفح لجلب البيانات:

### 5.1 جلب المباريات
```
http://localhost:3000/api/cron/fetch-matches
```

### 5.2 جلب الأخبار
```
http://localhost:3000/api/cron/fetch-news
```

### 5.3 جلب الترتيب
```
http://localhost:3000/api/cron/fetch-standings
```

### 5.4 تحديث حالة المباريات
```
http://localhost:3000/api/cron/update-status
```

---

## الخطوة 6: النشر على Vercel (اختياري)

### 6.1 الربط مع GitHub
1. ارفع الكود إلى مستودع GitHub خاص بك
2. اذهب إلى https://vercel.com
3. اضغط **New Project** واختر المستودع

### 6.2 إضافة متغيرات البيئة
في إعدادات المشروع على Vercel، أضف نفس المتغيرات من `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`
- `FOOTBALL_API_KEY`
- `CRON_SECRET` (اختياري)

### 6.3 تفعيل Cron Jobs
الملف `vercel.json` موجود بالفعل ويحتوي على:
- جلب المباريات كل 10 دقائق
- جلب الأخبار كل ساعتين
- جلب الترتيب يومياً الساعة 6 صباحاً
- تحديث حالة المباريات كل 5 دقائق

**ملاحظة**: في الخطة المجانية على Vercel، أقل فترة هي 10 دقائق

---

## ✅ التحقق من نجاح الإعداد

### علامات نجاح الإعداد:
- [ ] الصفحة الرئيسية تعرض أخبار أو رسالة "لا توجد أخبار"
- [ ] يمكنك التبديل بين تبويبات المباريات (أمس/اليوم/غد)
- [ ] صفحة الترتيب تعرض جدول الدوري الإنجليزي
- [ ] عند النقر على مباراة، تذهب لصفحة التفاصيل

### إذا ظهرت مشاكل:
1. **خطأ في الاتصال بـ Supabase**: تأكد من صحة URL و ANON_KEY
2. **لا توجد مباريات**: شغل `/api/cron/fetch-matches` وتأكد من `FOOTBALL_API_KEY`
3. **خطأ في الأخبار**: شغل `/api/cron/fetch-news` وتحقق من `GEMINI_API_KEY`

---

## 🎯 الخطوات التالية لتحسين التطبيق

بعد إكمال الإعداد الأساسي، يمكنك:

1. **إكمال لوحة التحكم**: ربطها بالبيانات الحقيقية وإضافة CRUD operations
2. **نظام المصادقة**: إضافة تسجيل دخول للمديرين
3. **إدارة السيرفرات**: واجهة لتعديل روابط البث لكل مباراة
4. **نظام التقارير**: السماح للمستخدمين بالإبلاغ عن سيرفرات لا تعمل
5. **المفضلة**: السماح للمستخدمين بحفظ مبارياتهم المفضلة
6. **الإشعارات**: تنبيه المستخدمين قبل بداية المباريات

---

## 📞 الدعم

إذا واجهت مشكلة:
1. تحقق من Console للأخطاء
2. تأكد من جميع المتغيرات في `.env.local`
3. راجع سجلات Supabase Dashboard
