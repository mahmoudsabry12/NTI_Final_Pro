const authService = require('./auth.service');
const logger = require('../../config/logger');

class AuthController {

  async register(req, res) {
    const { username, email, password } = req.body;

    logger.info('Register attempt', {
      action: 'REGISTER_ATTEMPT',
      email,
      ip: req.ip,
      route: req.originalUrl,
      method: req.method,
    });

    try {
      // validation
      if (!username || !email || !password) {
        logger.warn('Register failed - missing fields', {
          action: 'REGISTER_FAILED',
          email,
          reason: 'Missing fields',
        });

        return res.status(400).json({
          message: 'Username, email, and password are required',
        });
      }

      const user = await authService.registerUser(username, email, password);

      logger.info('User registered successfully', {
        action: 'REGISTER_SUCCESS',
        userId: user._id,
        email,
      });

      res.status(201).json({
        message: 'User registered successfully',
        userId: user._id,
        username: user.username,
        email: user.email,
      });

    } catch (err) {

      logger.error('Register error', {
        action: 'REGISTER_ERROR',
        email,
        error: err.message,
        stack: err.stack,
      });

      if (err.message === 'Email already exists') {
        return res.status(400).json({
          message: 'Email already exists',
        });
      }

      res.status(500).json({
        message: 'Server Error',
      });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    logger.info('Login attempt', {
      action: 'LOGIN_ATTEMPT',
      email,
      ip: req.ip,
      route: req.originalUrl,
    });

    try {
      const result = await authService.loginUser(email, password);

      logger.info('Login success', {
        action: 'LOGIN_SUCCESS',
        userId: result.userId,
        email,
      });

      res.status(200).json({
        message: 'Login successful',
        ...result,
      });

    } catch (err) {

      logger.warn('Login failed', {
        action: 'LOGIN_FAILED',
        email,
        reason: err.message,
      });

      if (err.message === 'Email and password are required') {
        return res.status(400).json({
          message: 'Email and password required',
        });
      }

      if (err.message === 'User not found') {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      if (err.message === 'Invalid credentials') {
        return res.status(400).json({
          message: 'Invalid credentials',
        });
      }

      logger.error('Unexpected login error', {
        action: 'LOGIN_ERROR',
        email,
        error: err.message,
        stack: err.stack,
      });

      res.status(500).json({
        message: 'Server Error',
      });
    }
  }
}

module.exports = new AuthController();