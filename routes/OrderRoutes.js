const express = require('express');
const nodemailer = require('nodemailer');
const OrderRepository = require('../repositories/OrderRepository');
const ProductRepository = require('../repositories/ProductRepository');
const EmailService = require('../services/EmailService');
const OrderService = require('../services/OrderService');
const OrderController = require('../controllers/OrderController');
const Order = require('../models/Order');
const Product = require('../models/Product');

const router = express.Router();

// Mailtrap setup
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// Dependency Injection
const orderRepository = new OrderRepository(Order);
const productRepository = new ProductRepository(Product);
const emailService = new EmailService(transporter);
const orderService = new OrderService(orderRepository, productRepository, emailService);
const orderController = new OrderController(orderService);

router.post('/', (req, res) => orderController.createOrder(req, res));
router.get('/:orderNumber', (req, res) => orderController.getOrder(req, res));

module.exports = router;