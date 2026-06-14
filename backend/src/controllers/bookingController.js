const Booking = require('../models/Booking');
const Property = require('../models/Property');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { sendEmail, bookingConfirmationTemplate } = require('../utils/email');

// @desc    Create a booking (status starts as pending until payment confirms)
// @route   POST /api/bookings
// @access  Private (guest)
exports.createBooking = asyncHandler(async (req, res) => {
  const { property: propertyId, checkIn, checkOut, guestsCount, paymentMethod } = req.body;

  const property = await Property.findById(propertyId);
  if (!property) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkInDate >= checkOutDate) {
    return res.status(400).json({ success: false, message: 'Check-out must be after check-in' });
  }

  // Check for overlapping confirmed/pending bookings
  const overlapping = await Booking.findOne({
    property: propertyId,
    bookingStatus: { $in: ['pending', 'confirmed'] },
    checkIn: { $lt: checkOutDate },
    checkOut: { $gt: checkInDate },
  });

  if (overlapping) {
    return res.status(409).json({ success: false, message: 'Property is not available for the selected dates' });
  }

  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  const totalAmount = nights * property.pricePerNight;

  const booking = await Booking.create({
    property: propertyId,
    guest: req.user._id,
    host: property.host,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    guestsCount: guestsCount || 1,
    totalAmount,
    paymentMethod,
    paymentStatus: 'pending',
    bookingStatus: 'pending',
  });

  res.status(201).json({ success: true, booking });
});

// @desc    Get bookings for logged-in guest (booking history)
// @route   GET /api/bookings/my
// @access  Private (guest)
exports.getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ guest: req.user._id })
    .populate('property', 'title images location pricePerNight')
    .sort('-createdAt');

  res.status(200).json({ success: true, count: bookings.length, bookings });
});

// @desc    Get bookings for host's properties (reservation management)
// @route   GET /api/bookings/host
// @access  Private (host, admin)
exports.getHostBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ host: req.user._id })
    .populate('property', 'title images location')
    .populate('guest', 'name email avatar')
    .sort('-createdAt');

  res.status(200).json({ success: true, count: bookings.length, bookings });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private (guest who owns it, host, admin)
exports.getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('property')
    .populate('guest', 'name email avatar')
    .populate('host', 'name email avatar');

  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

  const isOwnerGuest = booking.guest._id.toString() === req.user._id.toString();
  const isOwnerHost = booking.host._id.toString() === req.user._id.toString();
  if (!isOwnerGuest && !isOwnerHost && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
  }

  res.status(200).json({ success: true, booking });
});

// @desc    Host accepts or rejects a booking
// @route   PUT /api/bookings/:id/status
// @access  Private (host who owns property, admin)
exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const { bookingStatus } = req.body; // 'confirmed' | 'rejected' | 'cancelled' | 'completed'

  const booking = await Booking.findById(req.params.id).populate('property');
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

  if (booking.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const validTransitions = ['confirmed', 'rejected', 'cancelled', 'completed'];
  if (!validTransitions.includes(bookingStatus)) {
    return res.status(400).json({ success: false, message: 'Invalid booking status' });
  }

  booking.bookingStatus = bookingStatus;
  await booking.save();

  if (bookingStatus === 'confirmed') {
    const guestUser = await require('../models/User').findById(booking.guest);
    sendEmail({
      to: guestUser.email,
      subject: 'Your FanStay booking is confirmed!',
      html: bookingConfirmationTemplate(booking, booking.property),
    });
  }

  res.status(200).json({ success: true, booking });
});

// @desc    Cancel own booking (guest)
// @route   PUT /api/bookings/:id/cancel
// @access  Private (guest who owns it)
exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

  if (booking.guest.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  if (['cancelled', 'completed', 'rejected'].includes(booking.bookingStatus)) {
    return res.status(400).json({ success: false, message: `Cannot cancel a ${booking.bookingStatus} booking` });
  }

  booking.bookingStatus = 'cancelled';
  await booking.save();

  res.status(200).json({ success: true, booking });
});
