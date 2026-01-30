const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const validationRules = {
    email: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? { valid: true } : { valid: false, error: 'البريد الإلكتروني غير صالح' };
    },
    username: (value) => {
        if (!value || value.length < 3) {
            return { valid: false, error: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' };
        }
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            return { valid: false, error: 'اسم المستخدم يجب أن يحتوي على أحرف وأرقام فقط' };
        }
        return { valid: true };
    },
    age: (value) => {
        const age = parseInt(value);
        if (isNaN(age)) {
            return { valid: false, error: 'العمر يجب أن يكون رقماً' };
        }
        if (age < 13 || age > 120) {
            return { valid: false, error: 'العمر يجب أن يكون بين 13 و 120' };
        }
        return { valid: true };
    },
    password: (value) => {
        if (!value || value.length < 8) {
            return { valid: false, error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' };
        }
        if (!/[A-Z]/.test(value)) {
            return { valid: false, error: 'كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل' };
        }
        if (!/[a-z]/.test(value)) {
            return { valid: false, error: 'كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل' };
        }
        if (!/[0-9]/.test(value)) {
            return { valid: false, error: 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل' };
        }
        return { valid: true };
    },
    phone: (value) => {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
        return phoneRegex.test(value) ? { valid: true } : { valid: false, error: 'رقم الهاتف غير صالح' };
    },
    url: (value) => {
        try {
            new URL(value);
            return { valid: true };
        } catch {
            return { valid: false, error: 'الرابط غير صالح' };
        }
    }
};

app.post('/api/validate', (req, res) => {
    const data = req.body;
    
    if (!data || typeof data !== 'object') {
        return res.status(400).json({
            success: false,
            error: 'البيانات المرسلة غير صالحة',
            timestamp: new Date().toISOString()
        });
    }
    
    const results = {};
    let hasErrors = false;
    
    for (const [field, value] of Object.entries(data)) {
        if (validationRules[field]) {
            const validationResult = validationRules[field](value);
            results[field] = validationResult;
            if (!validationResult.valid) {
                hasErrors = true;
            }
        } else {
            results[field] = {
                valid: true,
                warning: 'لا توجد قاعدة تحقق لهذا الحقل'
            };
        }
    }
    
    const response = {
        success: !hasErrors,
        results: results,
        timestamp: new Date().toISOString(),
        fieldsValidated: Object.keys(data).length
    };
    
    if (hasErrors) {
        return res.status(400).json(response);
    }
    
    return res.status(200).json(response);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/validate`);
});