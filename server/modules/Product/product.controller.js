const productService = require('./product.service');
const path = require('path');

class ProductController {
  async createProduct(req, res) {
    const { title, description, category, stock, price } = req.body;
    try {
      const defaultImagePath = path.join(__dirname, '../../uploads', 'a.png');
      const imgUrl = await productService.uploadImage(
        req.file?.path,
        req.file ? null : defaultImagePath
      );

      const productData = {
        title,
        description,
        category,
        stock,
        price,
        imgUrl,
      };

      const product = await productService.createProduct(productData);
      res.status(201).json({
        message: 'Product added successfully!',
        product,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  }

  async getProductsByCategory(req, res) {
    const { category } = req.params;
    try {
      const products = await productService.getProductsByCategory(category);
      res.status(200).json(products);
    } catch (err) {
      console.error(err.message);
      if (err.message === 'Products not found') {
        return res.status(404).json({ message: 'Products not found' });
      }
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getProductById(req, res) {
    const { id } = req.params;
    try {
      const product = await productService.getProductById(id);
      res.status(200).json(product);
    } catch (err) {
      console.error(err.message);
      if (err.message === 'Product not found') {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getAllProducts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;

      const result = await productService.getAllProducts(page, limit);
      res.status(200).json(result);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async updateProduct(req, res) {
    const { title, description, category, stock, price } = req.body;
    try {
      const product = await productService.getProductById(req.params.id);

      let imgUrl = product.imgUrl;
      if (req.file) {
        await productService.deleteImage(product.imgUrl);
        imgUrl = await productService.uploadImage(req.file.path);
      }

      const updateData = {
        title,
        description,
        category,
        stock,
        price,
        imgUrl,
      };

      const updatedProduct = await productService.updateProduct(
        req.params.id,
        updateData
      );
      res.status(200).json(updatedProduct);
    } catch (err) {
      console.error(err.message);
      if (err.message === 'Product not found') {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(500).json({ error: 'Server error' });
    }
  }

  async deleteProduct(req, res) {
    try {
      await productService.deleteProduct(req.params.id);
      res.status(200).json({ message: 'Product deleted successfully!' });
    } catch (err) {
      console.error(err.message);
      if (err.message === 'Product not found') {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = new ProductController();


