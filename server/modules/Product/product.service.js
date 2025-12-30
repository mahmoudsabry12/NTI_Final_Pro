const fs = require('fs');
const path = require('path');
const cloudinary = require('../../config/cloudinary');
const productRepository = require('./product.repository');

class ProductService {
  async uploadImage(filePath, defaultImagePath = null) {
    try {
      if (filePath) {
        const result = await cloudinary.uploader.upload(filePath);
        fs.unlinkSync(filePath);
        return result.secure_url;
      } else if (defaultImagePath) {
        const result = await cloudinary.uploader.upload(defaultImagePath);
        return result.secure_url;
      }
      return '';
    } catch (err) {
      throw new Error(`Image upload failed: ${err.message}`);
    }
  }

  async deleteImage(imageUrl) {
    try {
      const publicId = imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error('Image deletion failed:', err.message);
    }
  }

  async createProduct(productData) {
    return await productRepository.create(productData);
  }

  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async getProductsByCategory(category) {
    const products = await productRepository.findByCategory(category);
    if (products.length === 0) {
      throw new Error('Products not found');
    }
    return products;
  }

  async getAllProducts(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const products = await productRepository.findAll(skip, limit);
    const totalProducts = await productRepository.countAll();
    const totalPages = Math.ceil(totalProducts / limit);

    return {
      products,
      currentPage: page,
      totalPages,
      totalProducts,
    };
  }

  async updateProduct(id, productData) {
    return await productRepository.updateById(id, productData);
  }

  async deleteProduct(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    await this.deleteImage(product.imgUrl);
    return await productRepository.deleteById(id);
  }
}

module.exports = new ProductService();

