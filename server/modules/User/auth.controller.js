const authService = require('./auth.service');

class AuthController {
  async register(req, res) {
    const { username, email, password } = req.body;

    try {
      if (!username || !email || !password) {
        return res.status(400).json({
          message: 'Username, email, and password are required',
        });
      }

      const user = await authService.registerUser(username, email, password);
      res.status(201).json({
        message: 'User registered successfully',
        userId: user._id,
        username: user.username,
        email: user.email,
      });
    } catch (err) {
      console.error(err.message);
      if (err.message === 'Email already exists') {
        return res.status(400).json({ message: 'Email already exists' });
      }
      res.status(500).json({
        message: 'Server Error',
        error: err.message,
      });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const result = await authService.loginUser(email, password);
      res.status(200).json({
        message: 'Login successful',
        ...result,
      });
    } catch (err) {
      console.error(err.message);
      if (err.message === 'Email and password are required') {
        return res.status(400).json({ message: 'Email and password required' });
      }
      if (err.message === 'User not found') {
        return res.status(404).json({ message: 'User not found' });
      }
      if (err.message === 'Invalid credentials') {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      res.status(500).json({
        message: 'Server Error',
        error: err.message,
      });
    }
  }
}

module.exports = new AuthController();
