const sanitizeHtml = require('sanitize-html');

class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  async createOrder(req, res) {
    try {
      const { items, productId, variant, quantity, customer } = req.body;

      // Basic customer presence check
      if (!customer) {
        return res.status(400).json({ error: 'Customer details are required' });
      }

      // Sanitize customer fields to prevent script injection
      const sanitizedCustomer = {};
      for (const key in customer) {
        sanitizedCustomer[key] = sanitizeHtml(customer[key], {
          allowedTags: [],
          allowedAttributes: {},
        });
      }

      // Validate order items or single product details
      if (!items && !(productId && variant && quantity)) {
        return res.status(400).json({ error: 'Order items or product details are required' });
      }

      // Validate items array if provided
      if (items) {
        if (!Array.isArray(items) || items.length === 0) {
          return res.status(400).json({ error: 'Items must be a non-empty array' });
        }
        // Limit the number of items to prevent abuse
        if (items.length > 50) {
          return res.status(400).json({ error: 'Too many items in the order (maximum 50)' });
        }
        for (const [index, item] of items.entries()) {
          if (!item.productId || !item.variant || !item.quantity) {
            return res.status(400).json({
              error: `Item at index ${index} is missing required fields (productId, variant, quantity)`,
            });
          }
          if (!item.variant.color || !item.variant.size) {
            return res.status(400).json({
              error: `Item at index ${index} is missing variant details (color, size)`,
            });
          }
          if (typeof item.quantity !== 'number' || item.quantity < 1 || !Number.isInteger(item.quantity)) {
            return res.status(400).json({
              error: `Item at index ${index} has an invalid quantity (must be a positive integer)`,
            });
          }
        }
      } else {
        // Validate single-item details
        if (!variant.color || !variant.size) {
          return res.status(400).json({ error: 'Variant must include color and size' });
        }
        if (typeof quantity !== 'number' || quantity < 1 || !Number.isInteger(quantity)) {
          return res.status(400).json({ error: 'Quantity must be a positive integer' });
        }
      }

      const result = await this.orderService.createOrder({ items, productId, variant, quantity, customer: sanitizedCustomer });

      console.log(`Order created successfully: ${result.orderNumber}, Status: ${result.status}`);

      res.status(201).json(result);
    } catch (error) {
      // Differentiate between client and server errors
      if (error.message.includes('Product not found') || 
          error.message.includes('Invalid variant') || 
          error.message.includes('Insufficient inventory') || 
          error.message.includes('Order items or product details are required')) {
        console.error('Client error during order creation:', error.message);
        return res.status(400).json({ error: error.message });
      }
      console.error('Server error during order creation:', error.stack);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getOrder(req, res) {
    try {
      const { orderNumber } = req.params;
      if (!orderNumber) {
        return res.status(400).json({ error: 'Order number is required' });
      }

      const order = await this.orderService.getOrderByNumber(orderNumber);

      console.log(`Order retrieved successfully: ${orderNumber}`);
      res.json(order);
    } catch (error) {
      if (error.message === 'Order not found') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Server error during order retrieval:', error.stack);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = OrderController;