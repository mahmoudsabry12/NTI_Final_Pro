const express = require('express');
const router = express.Router();
const Product = require('../Model/product')
const multer = require('multer'); // لتحميل الملفات
const fs = require('fs'); // للتعامل مع الملفات
const cloudinary = require('../config/cloudinary'); // إعداد Cloudinary

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('imgUrl'), async (req, res) => {
    const { title, description, category, stock, price,imgUrl } = req.body;

    try {
        let imgUrl = '';

        // تحقق من وجود صورة وارفعها إلى Cloudinary
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imgUrl = result.secure_url; // احصل على الرابط الآمن للصورة

            // احذف الملف المؤقت
            fs.unlinkSync(req.file.path);
        }

        // إنشاء منتج جديد مع رابط الصورة
        const newProduct = new Product({ 
            title, 
            description, 
            category, 
            stock, 
            price, 
            imgUrl 
        });

        await newProduct.save();

        res.status(201).json({ message: 'Product added successfully!', product: newProduct });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});


// GET ALL Products of Specific Category
router.get('/:category', async (req, res) => {
    const { category } = req.params;

    try {
        const productsByCategory = await Product.find({ category });
        if (productsByCategory.length === 0) {
            return res.status(404).json({ message: 'Products not found' });
        }
        res.status(200).json(productsByCategory);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET Product by ID
// GET المنتج باستخدام الـ ID

// GET Product by ID
router.get('/product/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // البحث عن المنتج باستخدام ID
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});





// GET ALL Products with Pagination
router.get('/', async (req, res) => {
    try {
        // تحديد الصفحة والحد الافتراضي في حالة عدم تقديم قيم
        const page = parseInt(req.query.page) || 1; // الصفحة الافتراضية 1
        const limit = parseInt(req.query.limit) || 10; // الحد الافتراضي 10 منتجات في الصفحة

        // حساب عدد العناصر التي يجب تخطيها بناءً على الصفحة المحددة
        const skip = (page - 1) * limit;

        // استعلام Mongoose مع pagination
        const products = await Product.find()
            .skip(skip)      // تخطي المنتجات التي تم عرضها في الصفحات السابقة
            .limit(limit);   // تحديد عدد المنتجات في الصفحة

        // حساب العدد الإجمالي للمنتجات
        const totalProducts = await Product.countDocuments();

        // حساب عدد الصفحات بناءً على العدد الإجمالي للمنتجات
        const totalPages = Math.ceil(totalProducts / limit);

        res.status(200).json({
            products,          // المنتجات في الصفحة الحالية
            currentPage: page, // الصفحة الحالية
            totalPages,        // إجمالي الصفحات
            totalProducts,     // إجمالي المنتجات
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});







// GET ALL Products
// router.get('/', async (req, res) => {
//     try {
//         const products = await Product.find();
//         if (!products) {
//             return res.status(404).json({ message: 'Products not found' });
//         }
//         res.status(200).json(products);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ error: 'Server error' });
//     }
// });



// UPDATE Product
// UPDATE Product
router.put('/:id', upload.single('imgUrl'), async (req, res) => {
    const { title, description, category, stock, price } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // إذا كان هناك صورة جديدة
        let imgUrl = product.imgUrl; // احتفظ بالصورة القديمة إذا لم يتم رفع صورة جديدة
        if (req.file) {
            // حذف الصورة القديمة من Cloudinary
            const publicId = product.imgUrl.split('/').pop().split('.')[0]; // استخراج public_id
            await cloudinary.uploader.destroy(publicId);

            // رفع الصورة الجديدة إلى Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);
            imgUrl = result.secure_url;

            // حذف الملف المؤقت
            fs.unlinkSync(req.file.path);
        }

        // تحديث المنتج
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                category,
                stock,
                price,
                imgUrl,
            },
            { new: true }
        );

        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});


// DELETE Product
router.delete('/:id', async (req, res) => {
    try {
        // العثور على المنتج باستخدام ID
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // حذف الصورة من Cloudinary
        const publicId = product.imgUrl.split('/').pop().split('.')[0]; // استخراج public_id من الرابط
        await cloudinary.uploader.destroy(publicId);

        // حذف المنتج من قاعدة البيانات
        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Product deleted successfully!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});



module.exports = router;
