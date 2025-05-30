const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  // Register a new user
  async register({ name, email, password }) {
    if (!name || !email || !password) {
      throw new Error('All fields are required');
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const user = await this.userRepository.create({ name, email, password });
    return user;
  }

  // Authenticate user and return tokens
  async login({ email, password }) {
    if (!email || !password) {
      throw new Error('All fields are required');
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email },
    };
  }

  // Generate a new access token using a valid refresh token
  async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new Error('Refresh token required');
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }

    const user = await this.userRepository.findById(decoded.userId);
    if (!user) {
      throw new Error('Invalid refresh token');
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });
    return { accessToken };
  }
}

module.exports = AuthService;