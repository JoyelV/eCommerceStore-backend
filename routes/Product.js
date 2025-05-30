const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/', (req, res) => productController.getAllProducts(req, res));
router.get('/:id', (req, res) => productController.getProductById(req, res));

module.exports = router;