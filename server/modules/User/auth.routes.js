const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

// Register
router.post('/register', (req, res) => authController.register(req, res));

// Login
router.post('/login', (req, res) => authController.login(req, res));

module.exports = router;
