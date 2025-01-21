const express = require('express');
const cloudinary = require('../config/cloudinary'); // استيراد إعداد Cloudinary
const multer = require('multer'); // مكتبة لتحميل الملفات
const fs = require('fs'); // للتعامل مع الملفات
const router = express.Router();

// إعداد Multer لتخزين الملفات مؤقتًا
const upload = multer({ dest: 'uploads/' });

// رفع صورة إلى Cloudinary
router.post('/upload', upload.single('imgUrl'), async (req, res) => {
    try {
        // رفع الملف إلى Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // حذف الملف المؤقت بعد رفعه
        fs.unlinkSync(req.file.path);

        // استرجاع رابط الصورة المرفوعة
        res.json({ success: true, url: result.secure_url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
