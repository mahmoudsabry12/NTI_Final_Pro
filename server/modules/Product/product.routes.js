const express = require('express');
const router = express.Router();
const multer = require('multer');
const productController = require('./product.controller');

const upload = multer({ dest: 'uploads/' });

// Create Product
router.post('/', upload.single('imgUrl'), (req, res) =>
  productController.createProduct(req, res)
);

// Get All Products with Pagination
router.get('/', (req, res) => productController.getAllProducts(req, res));

// Get Products by Category
router.get('/:category', (req, res) =>
  productController.getProductsByCategory(req, res)
);

// Get Product by ID
router.get('/product/:id', (req, res) =>
  productController.getProductById(req, res)
);

// Update Product
router.put('/:id', upload.single('imgUrl'), (req, res) =>
  productController.updateProduct(req, res)
);

// Delete Product
router.delete('/:id', (req, res) => productController.deleteProduct(req, res));

module.exports = router;
