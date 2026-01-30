# Akwadra Backend - API Validation

## نظرة عامة
تطبيق Backend بسيط يوفر نقطة نهاية `/api/validate` للتحقق من صحة البيانات.

## المميزات
- ✅ التحقق من صحة البريد الإلكتروني
- ✅ التحقق من اسم المستخدم
- ✅ التحقق من العمر
- ✅ التحقق من كلمة المرور
- ✅ التحقق من رقم الهاتف
- ✅ التحقق من الروابط (URLs)

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

## استخدام API

### نقطة النهاية: POST /api/validate

**مثال على الطلب:**
```json
{
  "email": "user@example.com",
  "username": "testuser",
  "age": 25,
  "password": "SecurePass123",
  "phone": "+1234567890",
  "url": "https://example.com"
}
```

**مثال على الاستجابة الناجحة:**
```json
{
  "success": true,
  "results": {
    "email": { "valid": true },
    "username": { "valid": true },
    "age": { "valid": true },
    "password": { "valid": true },
    "phone": { "valid": true },
    "url": { "valid": true }
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "fieldsValidated": 6
}
```

**مثال على الاستجابة مع أخطاء:**
```json
{
  "success": false,
  "results": {
    "email": { "valid": false, "error": "البريد الإلكتروني غير صالح" },
    "username": { "valid": true },
    "age": { "valid": false, "error": "العمر يجب أن يكون بين 13 و 120" }
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "fieldsValidated": 3
}
```

## قواعد التحقق

### البريد الإلكتروني (email)
- يجب أن يكون بتنسيق بريد إلكتروني صالح

### اسم المستخدم (username)
- الحد الأدنى 3 أحرف
- أحرف وأرقام وشرطة سفلية فقط

### العمر (age)
- يجب أن يكون رقماً
- بين 13 و 120

### كلمة المرور (password)
- الحد الأدنى 8 أحرف
- حرف كبير واحد على الأقل
- حرف صغير واحد على الأقل
- رقم واحد على الأقل

### رقم الهاتف (phone)
- تنسيق رقم هاتف دولي صالح

### الرابط (url)
- يجب أن يكون رابط URL صالح

## الملاحظات
- لا يتم تحميل أو تخزين أي بيانات
- التحقق يتم في الذاكرة فقط
- جميع الاستجابات تتضمن طابع زمني

## الترخيص
MIT