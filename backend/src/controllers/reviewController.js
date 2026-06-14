const Review = require('../models/Review');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const { asyncHandler } = require('../middleware/errorMiddleware');

// Recalculate and persist property's average rating
const recalcPropertyRating = async (propertyId) => {
  const reviews = await Review.find({ property: propertyId, status: 'visible' });
  const count = reviews.length;
  const average = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

  await Property.findByIdAndUpdate(propertyId, {
    'rating.average': Math.round(average * 10) / 10,
    'rating.count': count,
  });
};

// @desc    Create a review (only for completed bookings)
// @route   POST /api/reviews
// @access  Private (guest)
exports.createReview = asyncHandler(async (req, res) => {
  const { property: propertyId, booking: bookingId, rating, comment } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

  if (booking.guest.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  if (!['completed', 'confirmed'].includes(booking.bookingStatus)) {
    return res.status(400).json({ success: false, message: 'You can only review completed stays' });
  }

  const existing = await Review.findOne({ booking: bookingId, user: req.user._id });
  if (existing) {
    return res.status(400).json({ success: false, message: 'You already reviewed this booking' });
  }

  const review = await Review.create({
    property: propertyId,
    user: req.user._id,
    booking: bookingId,
    rating,
    comment,
  });

  await recalcPropertyRating(propertyId);

  res.status(201).json({ success: true, review });
});

// @desc    Get reviews for a property
// @route   GET /api/reviews/property/:propertyId
// @access  Public
exports.getPropertyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ property: req.params.propertyId, status: 'visible' })
    .populate('user', 'name avatar')
    .sort('-createdAt');

  res.status(200).json({ success: true, count: reviews.length, reviews });
});

// @desc    Update own review
// @route   PUT /api/reviews/:id
// @access  Private (review owner)
exports.updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

  if (review.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  if (req.body.rating !== undefined) review.rating = req.body.rating;
  if (req.body.comment !== undefined) review.comment = req.body.comment;
  await review.save();

  await recalcPropertyRating(review.property);

  res.status(200).json({ success: true, review });
});

// @desc    Delete own review
// @route   DELETE /api/reviews/:id
// @access  Private (review owner, admin)
exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const propertyId = review.property;
  await review.deleteOne();
  await recalcPropertyRating(propertyId);

  res.status(200).json({ success: true, message: 'Review deleted' });
});
