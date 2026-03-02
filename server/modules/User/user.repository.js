const User = require('./user.model');
const logger = require('../../config/logger');

class UserRepository {
  async create(userData) {
    try {
      const user = new User(userData);
      const savedUser = await user.save();

      logger.info('User created', {
        action: 'USER_CREATE',
        userId: savedUser._id,
        email: savedUser.email,
      });

      return savedUser;
    } catch (err) {
      logger.error('Error creating user', {
        action: 'USER_CREATE_ERROR',
        email: userData.email,
        error: err.message,
        stack: err.stack,
      });
      throw err;
    }
  }

  async findByEmail(email) {
    try {
      const user = await User.findOne({ email });

      logger.info('Find user by email', {
        action: 'USER_FIND_BY_EMAIL',
        email,
        found: !!user,
        userId: user?._id,
      });

      return user;
    } catch (err) {
      logger.error('Error finding user by email', {
        action: 'USER_FIND_BY_EMAIL_ERROR',
        email,
        error: err.message,
        stack: err.stack,
      });
      throw err;
    }
  }

  async findById(id) {
    try {
      const user = await User.findById(id);

      logger.info('Find user by id', {
        action: 'USER_FIND_BY_ID',
        userId: id,
        found: !!user,
      });

      return user;
    } catch (err) {
      logger.error('Error finding user by id', {
        action: 'USER_FIND_BY_ID_ERROR',
        userId: id,
        error: err.message,
        stack: err.stack,
      });
      throw err;
    }
  }

  async updateById(id, updateData) {
    try {
      const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

      logger.info('User updated', {
        action: 'USER_UPDATE',
        userId: id,
        updatedFields: Object.keys(updateData),
      });

      return updatedUser;
    } catch (err) {
      logger.error('Error updating user', {
        action: 'USER_UPDATE_ERROR',
        userId: id,
        error: err.message,
        stack: err.stack,
      });
      throw err;
    }
  }

  async deleteById(id) {
    try {
      const deletedUser = await User.findByIdAndDelete(id);

      logger.info('User deleted', {
        action: 'USER_DELETE',
        userId: id,
        deleted: !!deletedUser,
      });

      return deletedUser;
    } catch (err) {
      logger.error('Error deleting user', {
        action: 'USER_DELETE_ERROR',
        userId: id,
        error: err.message,
        stack: err.stack,
      });
      throw err;
    }
  }

  async findAll() {
    try {
      const users = await User.find();

      logger.info('Find all users', {
        action: 'USER_FIND_ALL',
        total: users.length,
      });

      return users;
    } catch (err) {
      logger.error('Error finding all users', {
        action: 'USER_FIND_ALL_ERROR',
        error: err.message,
        stack: err.stack,
      });
      throw err;
    }
  }
}

module.exports = new UserRepository();