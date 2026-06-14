const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getHostBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const { validate, bookingRules } = require('../middleware/validators');

router.post('/', protect, bookingRules, validate, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/host', protect, authorize('host', 'admin'), getHostBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/status', protect, authorize('host', 'admin'), updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
