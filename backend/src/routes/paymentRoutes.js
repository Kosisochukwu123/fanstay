const express = require('express');
const router = express.Router();
const {
  createCryptoCharge,
  coinbaseWebhook,
  getCryptoPaymentStatus,
  submitGiftCard,
  getPendingGiftCards,
  reviewGiftCard,
  getPaymentByBooking,
  getGiftCardProviders,
  submitTicketGiftCard

} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');
const upload = require('../middleware/upload');

// Public
router.get('/giftcard/providers', getGiftCardProviders);

// Crypto (Coinbase Commerce)
router.post('/crypto/create-charge', protect, paymentLimiter, createCryptoCharge);
// NOTE: webhook route is mounted separately in server.js with raw body parser
router.get('/crypto/:paymentId/status', protect, getCryptoPaymentStatus);

// Gift card
router.post('/giftcard/submit', protect, paymentLimiter, upload.single('giftCardImage'), submitGiftCard);
router.get('/giftcard/pending', protect, authorize('admin'), getPendingGiftCards);
router.put('/giftcard/:paymentId/review', protect, authorize('admin'), reviewGiftCard);

// Shared
router.get('/booking/:bookingId', protect, getPaymentByBooking);

router.post(
  '/giftcard/submit-ticket',
  protect,
  submitTicketGiftCard
);

module.exports = router;

// Export webhook handler separately for raw-body mounting
module.exports.coinbaseWebhook = coinbaseWebhook;
