const Product = require('../models/Product');
const ProductRepository = require('../repositories/ProductRepository');

const productRepository = new ProductRepository(Product);

class ProductService {
  async getAllProducts({ search, minPrice, maxPrice, page = 1, limit = 9 }) {
    try {
      const query = {};
      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        productRepository.findProducts(query, skip, Number(limit)),
        productRepository.countProducts(query),
      ]);

      return {
        products,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Service error while fetching products: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      const product = await productRepository.findProductById(id);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      throw new Error(`Service error while fetching product by ID: ${error.message}`);
    }
  }
}

module.exports = new ProductService();