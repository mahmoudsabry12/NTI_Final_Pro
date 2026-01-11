const redisClient = require('../config/redis');

const invalidateProductsCache = async () => {
  try {
    const keys = await redisClient.keys('products:*');
    if (keys.length) {
      await redisClient.del(keys);
    }
  } catch (err) {
    console.error('Cache invalidation failed:', err.message);
  }
};

module.exports = {
  invalidateProductsCache,
};
