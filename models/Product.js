const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  images: {
    type: [String], 
    required: true,
    validate: {
      validator: function (images) {
        if (!images || images.length === 0) return false;
        const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
        return images.every((img) => urlRegex.test(img));
      },
      message: 'Images must be an array of valid URLs (at least one image required)',
    },
  },
  variants: [
    {
      color: { type: String, required: true },
      size: { type: String, required: true },
      inventory: { type: Number, required: true, min: 0 },
      _id: false,
    },
  ],
});

productSchema.path('variants').validate(function (variants) {
  const variantKeys = variants.map((v) => `${v.color}:${v.size}`);
  return new Set(variantKeys).size === variantKeys.length;
}, 'Duplicate color/size variant');

module.exports = mongoose.model('Product', productSchema);