const express = require('express');
const router = express.Router();
const Product = require('../Model/product')
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const path = require('path');


const upload = multer({ dest: 'uploads/' });


router.post('/', upload.single('imgUrl'), async (req, res) => {
    const { title, description, category, stock, price } = req.body;

    let imgUrl = '';
    try {
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imgUrl = result.secure_url;


            fs.unlinkSync(req.file.path);
        } else {
            const defaultImagePath = path.join(__dirname, '..', 'uploads', 'a.png');
            const result = await cloudinary.uploader.upload(defaultImagePath);
            imgUrl = result.secure_url;
        }


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
router.get('/product/:id', async (req, res) => {
    const { id } = req.params;

    try {
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6; 

 
        const skip = (page - 1) * limit;

        const products = await Product.find()
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);

        res.status(200).json({
            products,
            currentPage: page,
            totalPages,
            totalProducts,
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

        let imgUrl = product.imgUrl; 
        if (req.file) {
            const publicId = product.imgUrl.split('/').pop().split('.')[0]; 
            await cloudinary.uploader.destroy(publicId);

            const result = await cloudinary.uploader.upload(req.file.path);
            imgUrl = result.secure_url;

            fs.unlinkSync(req.file.path);
        }

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
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const publicId = product.imgUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Product deleted successfully!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});



module.exports = router;
