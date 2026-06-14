const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'USD' },

    // Crypto fields
    transactionHash: { type: String, default: '' },
    coinbaseChargeId: { type: String, default: '' },
    coinbaseChargeCode: { type: String, default: '' },

    // Gift card fields
    giftCardProvider: { type: String, default: '' },
    giftCardCode: { type: String, default: '', select: false },
    giftCardImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    adminReviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    adminNote: { type: String, default: '' },

    paymentProvider: {
      type: String,
      enum: ['coinbase_commerce', 'gift_card'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'expired', 'awaiting_admin_review'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
