const productService = require('../services/ProductService');

class ProductController {
  async getAllProducts(req, res) {
    try {
      const queryParams = {
        search: req.query.search,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        page: req.query.page || 1,
        limit: req.query.limit || 9,
      };
      const result = await productService.getAllProducts(queryParams);
      res.status(200).json(result);
    } catch (error) {
      console.error('Controller error:', error.message);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getProductById(req, res) {
    try {
      const product = await productService.getProductById(req.params.id);
      res.status(200).json(product);
    } catch (error) {
      console.error('Controller error:', error.message);
      if (error.message === 'Product not found') {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = new ProductController();