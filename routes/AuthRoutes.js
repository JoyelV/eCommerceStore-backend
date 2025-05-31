const express = require('express');
const AuthController = require('../controllers/AuthController');
const UserRepository = require('../repositories/UserRepository');
const AuthService = require('../services/AuthService');
const User = require('../models/User');

const router = express.Router();

// Dependency Injection
const userRepository = new UserRepository(User);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/refresh-token', (req, res) => authController.refreshToken(req, res));

module.exports = router;