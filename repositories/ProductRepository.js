class ProductRepository {
  constructor(ProductModel) {
    this.Product = ProductModel;
  }

  // Fetch products with query, pagination, and limit
  async findProducts(query, skip, limit) {
    try {
      return await this.Product.find(query).skip(skip).limit(limit);
    } catch (error) {
      throw new Error(`Database error while fetching products: ${error.message}`);
    }
  }

  // Count total products matching the query
  async countProducts(query) {
    try {
      return await this.Product.countDocuments(query);
    } catch (error) {
      throw new Error(`Database error while counting products: ${error.message}`);
    }
  }

  // Fetch a single product by ID 
  async findProductById(id, session = null) {
    try {
      return await this.findById(id, session);
    } catch (error) {
      throw new Error(`Database error while fetching product by ID: ${error.message}`);
    }
  }

  // Fetch a single product by ID with session support 
  async findById(id, session = null) {
    try {
      const query = this.Product.findById(id);
      if (session) {
        query.session(session);
      }
      return await query.exec();
    } catch (error) {
      throw new Error(`Database error while fetching product by ID: ${error.message}`);
    }
  }

  // Update inventory for a specific variant 
  async updateInventory(product, variantIndex, quantity, session = null) {
    try {
      if (!product || !product.variants || variantIndex < 0 || variantIndex >= product.variants.length) {
        throw new Error('Invalid product or variant index');
      }
      product.variants[variantIndex].inventory -= quantity;
      return await product.save({ session });
    } catch (error) {
      throw new Error(`Database error while updating inventory: ${error.message}`);
    }
  }
}

module.exports = ProductRepository;