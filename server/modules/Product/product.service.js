const fs = require('fs');
const path = require('path');
const cloudinary = require('../../config/cloudinary');
const productRepository = require('./product.repository');
const redisClient = require('../../config/redis');
const { invalidateProductsCache } = require('../../utils/cache.helper');
const logger = require('../../config/logger');


class ProductService {

  async uploadImage(filePath, defaultImagePath = null) {
    try {
      logger.info('Uploading image to Cloudinary');

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
      logger.error(`Image upload failed: ${err.message}`);
      throw new Error(`Image upload failed: ${err.message}`);
    }
  }

  async deleteImage(imageUrl) {
    try {
      logger.info('Deleting image from Cloudinary');

      const publicId = imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      logger.error(`Image deletion failed: ${err.message}`);
    }
  }

  async createProduct(productData) {

     logger.info('Creating new product');
    const product = await productRepository.create(productData);

    // Invalidate related Redis cache
    await invalidateProductsCache();
    
    logger.info(`Product created successfully: ${product.id}`);
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
      logger.info(`Cache hit for ${cacheKey}`);
      return {
      source: 'redis',
      data: JSON.parse(cached),
    };
    } 
    logger.info(`Cache miss for ${cacheKey} — querying DB`);

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

