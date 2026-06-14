const mongoose = require('mongoose');

const giftCardProviderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    logo: { type: String, default: '' },
    instructions: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GiftCardProvider', giftCardProviderSchema);
