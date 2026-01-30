# Akwadra Backend - Video URL Validation API

## نظرة عامة
تطبيق Backend يوفر نقطة نهاية `/api/validate` للتحقق من صحة روابط الفيديو واستخراج البيانات الوصفية.

## المميزات الجديدة
- ✅ التحقق من روابط الفيديو (YouTube, Vimeo)
- ✅ قبول HTTPS فقط
- ✅ التحقق من الدومينات المسموحة
- ✅ استخراج metadata (المدة والعنوان)
- ✅ التحقق من المدة حسب نوع الحساب (Free/Premium)
- ✅ استجابة سريعة (< 500ms)
- ⛔ ممنوع تحميل الفيديو
- ⛔ ممنوع التخزين

## التثبيت
```bash
npm install
```

## التشغيل
```bash
npm start
```

للتطوير مع إعادة التحميل التلقائي:
```bash
npm run dev
```

## استخدام API الجديد

### نقطة النهاية: POST /api/validate

**مثال على الطلب:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Headers اختيارية:**
```
x-user-tier: free | premium
```

**مثال على الاستجابة الناجحة:**
```json
{
  "success": true,
  "metadata": {
    "duration": 55,
    "title": "YouTube Video Sample",
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  "userTier": "free",
  "maxDuration": 60,
  "responseTime": "125ms",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**مثال على الاستجابة مع أخطاء:**
```json
{
  "success": false,
  "error": "مدة الفيديو 70 ثانية تتجاوز الحد المسموح 60 ثانية لحساب free",
  "metadata": {
    "duration": 70,
    "title": "Vimeo Video Sample"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## قواعد التحقق

### الرابط (URL)
- يجب أن يكون HTTPS فقط
- يجب أن يكون من الدومينات المسموحة:
  - youtube.com
  - www.youtube.com
  - youtu.be
  - vimeo.com
  - www.vimeo.com

### المدة (Duration)
- **Free Account**: حد أقصى 60 ثانية
- **Premium Account**: حد أقصى 90 ثانية

### القيود
- يجب إرسال حقل `url` فقط
- لا يتم قبول أي حقول إضافية
- لا يتم تحميل أو تخزين الفيديو
- استخراج metadata فقط

## الأداء
- زمن الاستجابة المستهدف: أقل من 500ms
- معالجة سريعة بدون تحميل ملفات

## الترخيص
MIT