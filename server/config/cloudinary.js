const cloudinary = require('cloudinary').v2;
require('dotenv').config()
// إعداد Cloudinary باستخدام المتغيرات البيئية
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // اسم الكلاود الخاص بك
    api_key: process.env.CLOUDINARY_API_KEY,       // مفتاح API
    api_secret: process.env.CLOUDINARY_API_SECRET, // السر الخاص بـ API
});

module.exports = cloudinary;
