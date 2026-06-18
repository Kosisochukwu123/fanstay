const mongoose = require('mongoose');

const giftCardSubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Category 1', 'Category 2', 'Category 3', 'Category 4']
  },
  giftCardImage: {
    type: String,
    required: true
  },
  giftCardAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  adminReviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
giftCardSubmissionSchema.index({ status: 1, createdAt: -1 });
giftCardSubmissionSchema.index({ user: 1 });

module.exports = mongoose.model('GiftCardSubmission', giftCardSubmissionSchema);