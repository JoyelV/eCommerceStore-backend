class OrderRepository {
  constructor(OrderModel) {
    this.Order = OrderModel;
  }

  async findByOrderNumber(orderNumber) {
    try {
      return await this.Order.findOne({ orderNumber });
    } catch (error) {
      throw new Error(`Failed to find order: ${error.message}`);
    }
  }

  async create(orderData, session) {
    try {
      const order = new this.Order(orderData);
      return await order.save({ session });
    } catch (error) {
      if (error.code === 11000) { 
        throw new Error('Order number already exists');
      }
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }
}

module.exports = OrderRepository;