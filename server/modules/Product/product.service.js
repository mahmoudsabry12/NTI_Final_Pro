const fs = require('fs');
const path = require('path');
const cloudinary = require('../../config/cloudinary');
const productRepository = require('./product.repository');
const redisClient = require('../../config/redis');
const { invalidateProductsCache } = require('../../utils/cache.helper');

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

    const product = await productRepository.create(productData);

    // Invalidate related Redis cache
    await invalidateProductsCache();

    return product
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
    
     const cacheKey = `products:page=${page}:limit=${limit}`;

    // check Redis cache
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return {
      source: 'redis',
      data: JSON.parse(cached),
    };
    } 

    const skip = (page - 1) * limit;
    const products = await productRepository.findAll(skip, limit);
    const totalProducts = await productRepository.countAll();
    const totalPages = Math.ceil(totalProducts / limit);

   const result = {
      products,
      currentPage: page,
      totalPages,
      totalProducts,
    };

    // store data in Redis cache for 10 seconds
    await redisClient.setEx(cacheKey, 10, JSON.stringify(result));

    return {
      source:'db',
      data:result
    };
  }

  async updateProduct(id, productData) {
    const updatedProduct = await productRepository.updateById(id, productData)
    await invalidateProductsCache();
    return updatedProduct;
  }

  async deleteProduct(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    await this.deleteImage(product.imgUrl);
    const deletedProduct = await productRepository.deleteById(id);

    await invalidateProductsCache();
    return deletedProduct;
  }
}

module.exports = new ProductService();

