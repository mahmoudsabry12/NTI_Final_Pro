const productService = require('./product.service');
const path = require('path');
const logger = require('../../config/logger');


class ProductController {
  async createProduct(req, res) {
    const { title, description, category, stock, price } = req.body;
    try {
      logger.info(`Creating product: ${title} in category: ${category}`);
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
      logger.info(`Product created successfully: ${product.id}`);

      res.status(201).json({
        message: 'Product added successfully!',
        product,
      });
    } catch (err) {
      logger.error(`Create product error: ${err.message}`);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  }

  async getProductsByCategory(req, res) {
    const { category } = req.params;
    try {
      logger.info(`Get products in Category: ${category}`);
      const products = await productService.getProductsByCategory(category);
      res.status(200).json(products);
    } catch (err) {
      logger.error(`Get product category : ${err.message}`);
      if (err.message === 'Products not found') {
        return res.status(404).json({ message: 'Products not found' });
      }
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getProductById(req, res) {
    const { id } = req.params;
    try {
      logger.info(`Get product With Id : ${id} `);
      const product = await productService.getProductById(id);
      res.status(200).json(product);
    } catch (err) {
      logger.error(`Get product With Id : ${err.message}`);
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
      const limit = parseInt(req.query.limit) || 10;
      const result = await productService.getAllProducts(page, limit);
      logger.info(`Get products of page : '${page}'`);
      res.status(200).json(result);
    } catch (err) {
      logger.error(`Get products error: ${err.message}`);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async updateProduct(req, res) {
    const { title, description, category, stock, price } = req.body;
    try {
      logger.info(`Updating product with Id : ${req.params.id} `);

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
      logger.error(`Updating product error: ${err.message}`);
      console.error(err.message);
      if (err.message === 'Product not found') {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(500).json({ error: 'Server error' });
    }
  }

  async deleteProduct(req, res) {
    try {
      logger.info(`Deleting product with Id : ${req.params.id} `);
      await productService.deleteProduct(req.params.id);
      res.status(200).json({ message: 'Product deleted successfully!' });
    } catch (err) {
      logger.error(`Deleting product error: ${err.message}`);
      console.error(err.message);
      if (err.message === 'Product not found') {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = new ProductController();


