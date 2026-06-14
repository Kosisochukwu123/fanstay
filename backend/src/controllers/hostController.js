const Booking = require('../models/Booking');
const Property = require('../models/Property');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Host earnings dashboard summary
// @route   GET /api/host/earnings
// @access  Private (host, admin)
exports.getEarnings = asyncHandler(async (req, res) => {
  const hostId = req.user._id;

  const [totalEarningsAgg, earningsByMonth, propertiesCount, bookingsCount, pendingBookings] = await Promise.all([
    Booking.aggregate([
      { $match: { host: hostId, paymentStatus: 'paid', bookingStatus: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    Booking.aggregate([
      { $match: { host: hostId, paymentStatus: 'paid', bookingStatus: { $in: ['confirmed', 'completed'] } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
    Property.countDocuments({ host: hostId }),
    Booking.countDocuments({ host: hostId }),
    Booking.countDocuments({ host: hostId, bookingStatus: 'pending' }),
  ]);

  res.status(200).json({
    success: true,
    earnings: {
      totalEarnings: totalEarningsAgg[0]?.total || 0,
      earningsByMonth,
      propertiesCount,
      bookingsCount,
      pendingBookings,
    },
  });
});
