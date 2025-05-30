const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customer: {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email format'],
    },
    phone: {
      type: String,
      required: true,
      match: [/^\+?\d{1,4}[-.\s]?\d{1,14}$/, 'Invalid phone number format'], 
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: {
      type: String,
      required: true,
      match: [/^\d{5}(-\d{4})?$/, 'Invalid zip code format'], 
    },
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      variant: {
        color: { type: String, required: true },
        size: { type: String, required: true },
      },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 },
      image: {
        type: String,
        match: [/^https?:\/\/[^\s/$.?#].[^\s]*$/, 'Image must be a valid URL'],
      }, 
    },
    { _id: false, validate: [arrayLimit, 'Too many items in the order (maximum 50)'] },
  ],
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Declined', 'Error', 'Shipped', 'Delivered'], 
    required: true,
    default: 'Pending'
  },
  createdAt: { type: Date, default: Date.now },
});

// Limit items array size
function arrayLimit(val) {
  return val.length <= 50;
}

// Indexes for faster lookups
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ createdAt: -1 }); 

module.exports = mongoose.model('Order', orderSchema);