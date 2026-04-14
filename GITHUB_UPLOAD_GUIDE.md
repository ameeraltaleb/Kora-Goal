# 🚀 دليل رفع المشروع إلى GitHub

> **⚠️ مهم جداً**: لا ترفع ملف `.env.local` لأنه يحتوي على مفاتيح API سرية!

---

## ✅ قبل البدء: التحقق من الأمان

### الملفات التي **يجب ألا** تُرفع:
- ❌ `.env.local` (يحتوي على مفاتيح Supabase و API)
- ❌ `node_modules/` (مجلد كبير جداً)
- ❌ `.next/` (ملفات البناء)

### الملفات التي **تم رفعها** بأمان:
- ✅ `.env.example` (قالب بدون مفاتيح حقيقية)
- ✅ جميع ملفات الكود
- ✅ جميع ملفات التوثيق

---

## الخطوة 1: إنشاء مستودع على GitHub

### 1.1 افتح GitHub
```
https://github.com/new
```

### 1.2 املأ البيانات:

| الحقل | القيمة |
|-------|--------|
| **Repository name** | `kora-goal` أو `منصة-كورة-غول` |
| **Description** | `منصة عربية لبث مباشر مباريات كرة القدم 🏆⚽` |
| **Visibility** | 🔒 Private (مستحسن) أو 🌍 Public |
| **Initialize with README** | ❌ **لا تُحدده** (لأننا لدينا README موجود) |
| **Add .gitignore** | ❌ **لا تُحدده** (لأننا لدينا .gitignore موجود) |
| **Choose a license** | ❌ **اختياري** |

### 1.3 اضغط على **"Create repository"**

### 1.4 انسخ رابط المستودع
سيظهر لك رابط مثل:
```
https://github.com/YOUR_USERNAME/kora-goal.git
```

---

## الخطوة 2: تهيئة Git محلياً

افتح Terminal (Command Prompt) واكتب:

```bash
cd "c:\Users\ameer_ila09zu\OneDrive\Desktop\منصة كورة غول"

# تهيئة Git
git init

# إضافة جميع الملفات (باستثناء الموجودة في .gitignore)
git add .

# أول commit
git commit -m "🚀 Initial commit - Kora Goal Platform

✅ Next.js 16.2.3 with App Router
✅ Supabase integration
✅ Football Data API
✅ Facebook-style UI/UX
✅ Complete SEO optimization
✅ Admin dashboard
✅ Live match streaming
✅ Automated cron jobs
✅ Arabic RTL support"
```

---

## الخطوة 3: ربط المستودع المحلي بـ GitHub

```bash
# استبدل YOUR_USERNAME باسم المستخدم الخاص بك
git remote add origin https://github.com/YOUR_USERNAME/kora-goal.git

# رفع الكود
git branch -M main
git push -u origin main
```

---

## الخطوة 4: التحقق من الرفع

افتح المتصفح على:
```
https://github.com/YOUR_USERNAME/kora-goal
```

يجب أن ترى جميع الملفات!

---

## ⚠️ تحديثات مستقبلية

### عند إجراء تغييرات جديدة:

```bash
# إضافة التغييرات
git add .

# commit
git commit -m "✨ وصف التغيير هنا"

# رفع للتغييرات
git push
```

---

## 🔐 حماية المفاتيح السرية

### ❌ لا ترفع أبداً:
```bash
# لا تفعل هذا!
git add .env.local
git commit -m "add env"
```

### ✅ بدلاً من ذلك:
```bash
# استخدم .env.example كمرجع
git add .env.example
git commit -m "add env template"
```

---

## 📋 قائمة التحقق قبل الرفع

- [x] `.gitignore` موجود ويحتوي على `.env*`
- [x] `.env.example` موجود كقالب
- [x] `.env.local` **غير موجود** في Git
- [x] `node_modules/` **غير موجود**
- [x] `.next/` **غير موجود**
- [x] جميع ملفات الكود جاهزة
- [x] جميع ملفات التوثيق جاهزة

---

## 🎯 أوامر Git سريعة

| الأمر | الوصف |
|------|-------|
| `git status` | عرض حالة الملفات |
| `git add .` | إضافة جميع التغييرات |
| `git commit -m "رسالة"` | حفظ التغييرات |
| `git push` | رفع للتغييرات |
| `git pull` | سحب التغييرات |
| `git log` | عرض سجل التغييرات |

---

## 📊 ما سيتم رفعه

### ✅ ملفات سيتم رفعها:
```
📁 src/                 (كل الكود)
📄 README.md
📄 package.json
📄 next.config.ts
📄 tsconfig.json
📄 .env.example          (قالب بدون مفاتيح)
📄 .gitignore
📄 vercel.json
📄 supabase_schema.sql
📄 DATABASE_SETUP_GUIDE.md
📄 SEO_AUDIT.md
📄 FACEBOOK_THEME.md
📄 HOMEPAGE_REDESIGN.md
📄 وغيرها من ملفات التوثيق
```

### ❌ ملفات لن يتم رفعها:
```
🚫 .env.local            (مفاتيح سرية)
🚫 node_modules/         (مكتبات محملة)
🚫 .next/                (ملفات بناء)
🚫 .vercel/              (إعدادات Vercel)
```

---

## 🚀 للنشر على Vercel (لاحقاً)

### بعد الرفع على GitHub:

1. افتح https://vercel.com
2. اضغط **"New Project"**
3. اختر المستودع من GitHub
4. أضف متغيرات البيئة:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   GEMINI_API_KEY
   FOOTBALL_API_KEY
   ```
5. اضغط **"Deploy"**
6. ✅ الموقع سينشر تلقائياً!

---

## 💡 نصائح مهمة

### 1. استخدم commits صغيرة
```bash
# جيد
git commit -m "fix: إصلاح زر المشاهدة"

# سيء
git commit -m "update"
```

### 2. اكتب رسائل واضحة
```bash
# جيد
git commit -m "feat: إضافة صفحة تفاصيل المباراة"

# سيء
git commit -m "changes"
```

### 3. استخدم branches للميزات الكبيرة
```bash
# إنشاء فرع جديد
git checkout -b feature/news-system

# بعد الانتهاء
git checkout main
git merge feature/news-system
```

---

## 🆘 حل المشاكل الشائعة

### ❌ مشكلة: "rejected fetching origin"
**الحل:**
```bash
git pull --rebase origin main
git push
```

### ❌ مشكلة: "large files detected"
**الحل:**
```bash
# تحقق من حجم الملفات
git rm -r --cached node_modules
git commit -m "remove node_modules"
git push
```

### ❌ مشكلة: ".env.local was committed"
**الحل الفوري:**
```bash
# حذف الملف من Git
git rm --cached .env.local
git commit -m "remove sensitive env file"

# تغيير المفاتيح على Supabase (إذا لزم الأمر)
```

---

## ✅ جاهز للرفع!

اتبع الخطوات بالترتيب:
1. ✅ أنشئ مستودع على GitHub
2. ✅ `git init`
3. ✅ `git add .`
4. ✅ `git commit -m "🚀 Initial commit"`
5. ✅ `git remote add origin <رابط-مستودعك>`
6. ✅ `git push -u origin main`

**مبروك! مشروعك الآن على GitHub!** 🎉

---

**ملاحظة**: المشروع جاهز وآمن للرفع. ملف `.env.local` محمي بواسطة `.gitignore` ولن يُرفع تلقائياً. ✅
