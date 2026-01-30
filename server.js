const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const ALLOWED_DOMAINS = [
    'youtube.com',
    'www.youtube.com',
    'youtu.be',
    'vimeo.com',
    'www.vimeo.com'
];

const MAX_DURATION_FREE = 60;
const MAX_DURATION_PREMIUM = 90;

function validateUrlMiddleware(req, res, next) {
    const startTime = Date.now();
    
    const { url } = req.body;
    
    if (!url || typeof url !== 'string') {
        return res.status(400).json({
            success: false,
            error: 'يجب إرسال حقل url فقط',
            timestamp: new Date().toISOString()
        });
    }
    
    const bodyKeys = Object.keys(req.body);
    if (bodyKeys.length !== 1 || bodyKeys[0] !== 'url') {
        return res.status(400).json({
            success: false,
            error: 'يجب إرسال حقل url فقط، لا حقول إضافية',
            timestamp: new Date().toISOString()
        });
    }
    
    let parsedUrl;
    try {
        parsedUrl = new URL(url);
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: 'الرابط غير صالح',
            timestamp: new Date().toISOString()
        });
    }
    
    if (parsedUrl.protocol !== 'https:') {
        return res.status(400).json({
            success: false,
            error: 'يجب استخدام بروتوكول https فقط',
            timestamp: new Date().toISOString()
        });
    }
    
    const hostname = parsedUrl.hostname.toLowerCase();
    const isDomainAllowed = ALLOWED_DOMAINS.some(domain => hostname === domain || hostname.endsWith('.' + domain));
    
    if (!isDomainAllowed) {
        return res.status(400).json({
            success: false,
            error: 'الدومين غير مسموح. الدومينات المسموحة: YouTube, Vimeo',
            timestamp: new Date().toISOString()
        });
    }
    
    req.validatedUrl = parsedUrl;
    req.startTime = startTime;
    next();
}

async function extractMetadata(url) {
    const urlString = url.toString();
    const hostname = url.hostname.toLowerCase();
    
    let mockDuration = 45;
    let mockTitle = 'Sample Video';
    
    if (hostname.includes('youtube')) {
        mockDuration = 55;
        mockTitle = 'YouTube Video Sample';
    } else if (hostname.includes('vimeo')) {
        mockDuration = 70;
        mockTitle = 'Vimeo Video Sample';
    }
    
    return {
        duration: mockDuration,
        title: mockTitle,
        url: urlString
    };
}

app.post('/api/validate', validateUrlMiddleware, async (req, res) => {
    try {
        const metadata = await extractMetadata(req.validatedUrl);
        
        const userTier = req.headers['x-user-tier'] || 'free';
        const maxDuration = userTier === 'premium' ? MAX_DURATION_PREMIUM : MAX_DURATION_FREE;
        
        if (metadata.duration > maxDuration) {
            return res.status(400).json({
                success: false,
                error: `مدة الفيديو ${metadata.duration} ثانية تتجاوز الحد المسموح ${maxDuration} ثانية لحساب ${userTier}`,
                metadata: {
                    duration: metadata.duration,
                    title: metadata.title
                },
                timestamp: new Date().toISOString()
            });
        }
        
        const responseTime = Date.now() - req.startTime;
        
        return res.status(200).json({
            success: true,
            metadata: {
                duration: metadata.duration,
                title: metadata.title,
                url: metadata.url
            },
            userTier: userTier,
            maxDuration: maxDuration,
            responseTime: `${responseTime}ms`,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'خطأ في استخراج البيانات',
            timestamp: new Date().toISOString()
        });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/validate`);
    console.log(`⚡ Response time target: < 500ms`);
});

module.exports = { validateUrlMiddleware, extractMetadata };