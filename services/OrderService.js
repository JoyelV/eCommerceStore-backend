const mongoose = require('mongoose');

class OrderService {
  constructor(orderRepository, productRepository, emailService) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
    this.emailService = emailService;
  }

  simulateTransaction() {
    const outcomes = ['Approved', 'Declined', 'Error'];
    return outcomes[Math.floor(Math.random() * outcomes.length)];
  }

  async createOrder({ customer, items, productId, variant, quantity }) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let orderItems = [];
      const productsToUpdate = new Map(); 

      if (items && items.length > 0) {
        // Multi-item order
        for (const item of items) {
          // Deep validation of variant
          if (typeof item.variant !== 'object' || 
              typeof item.variant.color !== 'string' || 
              typeof item.variant.size !== 'string') {
            throw new Error(`Item with productId ${item.productId} has an invalid variant format`);
          }

          const product = await this.productRepository.findById(item.productId, session);
          if (!product) {
            throw new Error(`Product not found: ${item.productId}`);
          }

          const variantIndex = product.variants.findIndex(
            (v) => v.color === item.variant.color && v.size === item.variant.size
          );
          if (variantIndex === -1) {
            throw new Error(`Invalid variant: ${item.variant.color}, ${item.variant.size}`);
          }
          if (product.variants[variantIndex].inventory < item.quantity) {
            throw new Error(`Insufficient inventory for ${product.name}`);
          }

          orderItems.push({
            productId: product._id,
            name: product.name,
            variant: item.variant,
            quantity: item.quantity,
            price: product.price,
            image: product.images[0] || 'https://samples-files.com/samples/images/jpg/1920-1080-sample.jpg',
          });

          // Store product for inventory update
          productsToUpdate.set(product._id.toString(), { product, variantIndex, quantity: item.quantity });
        }
      } else if (productId && variant && quantity) {
        // Single-item order
        if (typeof variant !== 'object' || 
            typeof variant.color !== 'string' || 
            typeof variant.size !== 'string') {
          throw new Error('Invalid variant format');
        }

        const product = await this.productRepository.findById(productId, session);
        if (!product) {
          throw new Error('Product not found');
        }

        const variantIndex = product.variants.findIndex(
          (v) => v.color === variant.color && v.size === variant.size
        );
        if (variantIndex === -1) {
          throw new Error('Invalid variant');
        }
        if (product.variants[variantIndex].inventory < quantity) {
          throw new Error('Insufficient inventory');
        }

        orderItems.push({
          productId: product._id,
          name: product.name,
          variant,
          quantity,
          price: product.price,
          image: product.images[0] || 'https://samples-files.com/samples/images/jpg/1920-1080-sample.jpg',
        });

        productsToUpdate.set(product._id.toString(), { product, variantIndex, quantity });
      } else {
        throw new Error('Order items or product details are required');
      }

      // Simulate transaction (in real case, this would be a call to payment gateway)
      const transactionStatus = this.simulateTransaction();

      // Generate unique order number with retry logic
      let orderNumber;
      let attempts = 0;
      const maxAttempts = 3;
      while (attempts < maxAttempts) {
        orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const existingOrder = await this.orderRepository.findByOrderNumber(orderNumber);
        if (!existingOrder) break;
        attempts++;
        if (attempts === maxAttempts) {
          throw new Error('Failed to generate unique order number after multiple attempts');
        }
      }

      const orderData = {
        orderNumber,
        customer,
        items: orderItems,
        status: transactionStatus,
      };
      const order = await this.orderRepository.create(orderData, session);

      // Deduct inventory only if payment was successful
      if (transactionStatus === 'Approved') {
        for (const { product, variantIndex, quantity } of productsToUpdate.values()) {
          await this.productRepository.updateInventory(product, variantIndex, quantity, session);
        }
      }

      // Commit transaction after all changes are successful
      await session.commitTransaction();

      // Send order confirmation email (doesn't affect order transaction flow)
      try {
        await this.emailService.sendOrderEmail(customer.email, order, transactionStatus);
      } catch (emailError) {
        console.error('Failed to send email:', emailError.stack); 
      }

      return { orderNumber, status: transactionStatus };
    } catch (error) {
      await session.abortTransaction(); 
      throw error;
    } finally {
      session.endSession(); 
    }
  }

  async getOrderByNumber(orderNumber) {
    const order = await this.orderRepository.findByOrderNumber(orderNumber);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }
}

module.exports = OrderService;
