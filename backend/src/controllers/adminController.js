const User = require("../models/User");
const Property = require("../models/Property");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Review = require("../models/Review");
const GiftCardProvider = require("../models/GiftCardProvider");
const { asyncHandler } = require("../middleware/errorMiddleware");
const GiftCardSubmission = require("../models/GiftCardSubmission");
const Setting = require("../models/Setting");
const HospitalitySubmission=
require('../models/HospitalitySubmission');

// ================== USERS ==================

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin)
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;
  const query = {};
  if (role) query.role = role;
  if (search)
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password")
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(query),
  ]);

  res
    .status(200)
    .json({
      success: true,
      count: users.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      users,
    });
});

// @desc    Update user role / active status
// @route   PUT /api/admin/users/:id
// @access  Private (admin)
exports.updateUser = asyncHandler(async (req, res) => {
  const { role, isActive, isHostVerified } = req.body;
  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  if (isHostVerified !== undefined) user.isHostVerified = isHostVerified;

  await user.save();
  res.status(200).json({ success: true, user: user.toSafeObject() });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (admin)
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });
  await user.deleteOne();
  res.status(200).json({ success: true, message: "User deleted" });
});

// @desc    Get pending host applications
// @route   GET /api/admin/hosts/pending
// @access  Private (admin)
exports.getPendingHostApplications = asyncHandler(async (req, res) => {
  const users = await User.find({ hostApprovalStatus: "pending" }).select(
    "-password",
  );
  res.status(200).json({ success: true, count: users.length, users });
});

// @desc    Approve or reject host application
// @route   PUT /api/admin/hosts/:id/review
// @access  Private (admin)
exports.reviewHostApplication = asyncHandler(async (req, res) => {
  const { decision } = req.body; // 'approved' | 'rejected'
  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  if (decision === "approved") {
    user.role = "host";
    user.hostApprovalStatus = "approved";
    user.isHostVerified = true;
  } else if (decision === "rejected") {
    user.hostApprovalStatus = "rejected";
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Invalid decision" });
  }

  await user.save();
  res.status(200).json({ success: true, user: user.toSafeObject() });
});

// ================== LISTINGS ==================

// @desc    Get all properties (admin view, includes inactive/pending)
// @route   GET /api/admin/properties
// @access  Private (admin)
exports.getAllProperties = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [properties, total] = await Promise.all([
    Property.find(query)
      .populate("host", "name email")
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit)),
    Property.countDocuments(query),
  ]);

  res
    .status(200)
    .json({
      success: true,
      count: properties.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      properties,
    });
});

// @desc    Update property status (approve/suspend listing)
// @route   PUT /api/admin/properties/:id/status
// @access  Private (admin)
exports.updatePropertyStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'active' | 'inactive' | 'pending_review'
  const property = await Property.findById(req.params.id);
  if (!property)
    return res
      .status(404)
      .json({ success: false, message: "Property not found" });

  property.status = status;
  await property.save();
  res.status(200).json({ success: true, property });
});

// ================== BOOKINGS ==================

// @desc    Get all bookings (admin view)
// @route   GET /api/admin/bookings
// @access  Private (admin)
exports.getAllBookings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.bookingStatus = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .populate("property", "title location")
      .populate("guest", "name email")
      .populate("host", "name email")
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit)),
    Booking.countDocuments(query),
  ]);

  res
    .status(200)
    .json({
      success: true,
      count: bookings.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      bookings,
    });
});

// ================== ANALYTICS ==================

// @desc    Platform analytics overview
// @route   GET /api/admin/analytics
// @access  Private (admin)
exports.getAnalytics = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalHosts,
    totalGuests,
    totalProperties,
    totalBookings,
    confirmedBookings,
    revenueAgg,
    bookingsByMonth,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "host" }),
    User.countDocuments({ role: "guest" }),
    Property.countDocuments(),
    Booking.countDocuments(),
    Booking.countDocuments({ bookingStatus: "confirmed" }),
    Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Booking.aggregate([
      { $match: { bookingStatus: { $in: ["confirmed", "completed"] } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),
  ]);

  res.status(200).json({
    success: true,
    analytics: {
      totalUsers,
      totalHosts,
      totalGuests,
      totalProperties,
      totalBookings,
      confirmedBookings,
      totalRevenue: revenueAgg[0]?.total || 0,
      bookingsByMonth,
    },
  });
});

// ================== REVIEW MODERATION ==================

// @desc    Get all reviews (admin)
// @route   GET /api/admin/reviews
// @access  Private (admin)
exports.getAllReviews = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = {};
  if (status) query.status = status;

  const reviews = await Review.find(query)
    .populate("user", "name email")
    .populate("property", "title")
    .sort("-createdAt");

  res.status(200).json({ success: true, count: reviews.length, reviews });
});

// @desc    Moderate a review (flag/remove/restore)
// @route   PUT /api/admin/reviews/:id/moderate
// @access  Private (admin)
exports.moderateReview = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'visible' | 'flagged' | 'removed'
  const review = await Review.findById(req.params.id);
  if (!review)
    return res
      .status(404)
      .json({ success: false, message: "Review not found" });

  review.status = status;
  await review.save();

  // Recalculate property rating after moderation
  const propertyId = review.property;
  const reviews = await Review.find({
    property: propertyId,
    status: "visible",
  });
  const count = reviews.length;
  const average =
    count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
  await Property.findByIdAndUpdate(propertyId, {
    "rating.average": Math.round(average * 10) / 10,
    "rating.count": count,
  });

  res.status(200).json({ success: true, review });
});

// ================== GIFT CARD PROVIDERS ==================

// @desc    Add a supported gift card provider
// @route   POST /api/admin/giftcard-providers
// @access  Private (admin)
exports.createGiftCardProvider = asyncHandler(async (req, res) => {
  const provider = await GiftCardProvider.create(req.body);
  res.status(201).json({ success: true, provider });
});

// @desc    Get all gift card providers (admin)
// @route   GET /api/admin/giftcard-providers
// @access  Private (admin)
exports.getAllGiftCardProviders = asyncHandler(async (req, res) => {
  const providers = await GiftCardProvider.find().sort("name");
  res.status(200).json({ success: true, providers });
});

// @desc    Update gift card provider
// @route   PUT /api/admin/giftcard-providers/:id
// @access  Private (admin)
exports.updateGiftCardProvider = asyncHandler(async (req, res) => {
  const provider = await GiftCardProvider.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
  );
  if (!provider)
    return res
      .status(404)
      .json({ success: false, message: "Provider not found" });
  res.status(200).json({ success: true, provider });
});

// @desc    Delete gift card provider
// @route   DELETE /api/admin/giftcard-providers/:id
// @access  Private (admin)
exports.deleteGiftCardProvider = asyncHandler(async (req, res) => {
  const provider = await GiftCardProvider.findById(req.params.id);
  if (!provider)
    return res
      .status(404)
      .json({ success: false, message: "Provider not found" });
  await provider.deleteOne();
  res.status(200).json({ success: true, message: "Provider deleted" });
});



exports.getHospitalitySubmissions=
async(req,res)=>{

const submissions=
await HospitalitySubmission.find()
.populate(
'user',
'name email'
)
.sort({
createdAt:-1
});

res.json({
success:true,
submissions
});

};

// ===================== GIFT CARD SUBMISSION CONTROLLERS =====================

/**
 * Get all gift card submissions
 * @route GET /api/admin/gift-card-submissions
 * @access Private/Admin
 */
const getGiftCardSubmissions = async (req, res) => {
  try {
    const submissions = await GiftCardSubmission.find()
      .populate("user", "name email avatar")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error("Error fetching gift card submissions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch gift card submissions",
      error: error.message,
    });

    console.log("ADMIN FOUND:", submissions);
  }
};

/**
 * Approve a gift card submission
 * @route PUT /api/admin/gift-card-submissions/:id/approve
 * @access Private/Admin
 */
const approveGiftCardSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    // Find the submission
    const submission = await GiftCardSubmission.findById(id);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Gift card submission not found",
      });
    }

    // Check if already reviewed
    if (submission.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `This submission has already been ${submission.status}`,
      });
    }

    // Update status
    submission.status = "approved";
    submission.adminNotes = adminNotes || "Approved by admin";
    submission.adminReviewedBy = req.user.id;
    submission.reviewedAt = new Date();
    await submission.save();

    // Populate for response
    await submission.populate("user", "name email");

    res.status(200).json({
      success: true,
      message: "Gift card approved successfully",
      submission,
    });
  } catch (error) {
    console.error("Error approving gift card:", error);
    res.status(500).json({
      success: false,
      message: "Failed to approve gift card",
      error: error.message,
    });
  }
};

/**
 * Reject a gift card submission
 * @route PUT /api/admin/gift-card-submissions/:id/reject
 * @access Private/Admin
 */
const rejectGiftCardSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    // Find the submission
    const submission = await GiftCardSubmission.findById(id);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Gift card submission not found",
      });
    }

    // Check if already reviewed
    if (submission.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `This submission has already been ${submission.status}`,
      });
    }

    // Update status
    submission.status = "rejected";
    submission.adminNotes = adminNotes || "Rejected by admin";
    submission.adminReviewedBy = req.user.id;
    submission.reviewedAt = new Date();
    await submission.save();

    // Populate for response
    await submission.populate("user", "name email");

    res.status(200).json({
      success: true,
      message: "Gift card rejected",
      submission,
    });
  } catch (error) {
    console.error("Error rejecting gift card:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject gift card",
      error: error.message,
    });
  }
};

// ===================== CRYPTO ADDRESS CONTROLLERS =====================

/**
 * Get crypto address for payments
 * @route GET /api/admin/settings/crypto-address
 * @access Private/Admin
 */
const getCryptoAddress = async (req, res) => {
  try {
    // Try to find existing setting
    let setting = await Setting.findOne({ key: "crypto_address" });

    if (!setting) {
      // Return default if not set
      return res.status(200).json({
        success: true,
        address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        network: "USDT (ERC-20)",
        isDefault: true,
      });
    }

    res.status(200).json({
      success: true,
      address: setting.value,
      network: setting.network || "USDT (ERC-20)",
      isDefault: false,
      updatedAt: setting.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching crypto address:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch crypto address",
      error: error.message,
    });
  }
};

/**
 * Update crypto address for payments
 * @route PUT /api/admin/settings/crypto-address
 * @access Private/Admin
 */
const updateCryptoAddress = async (req, res) => {
  try {
    const { address, network } = req.body;

    // Validate address is provided
    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    // Validate Ethereum address format
    if (!address.startsWith("0x") || address.length !== 42) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid Ethereum address format. Must start with 0x and be 42 characters long.",
      });
    }

    // Find and update or create
    let setting = await Setting.findOne({ key: "crypto_address" });

    if (setting) {
      // Update existing
      setting.value = address;
      setting.network = network || "USDT (ERC-20)";
      setting.updatedAt = new Date();
      await setting.save();
    } else {
      // Create new
      setting = new Setting({
        key: "crypto_address",
        value: address,
        network: network || "USDT (ERC-20)",
      });
      await setting.save();
    }

    res.status(200).json({
      success: true,
      message: "Crypto address updated successfully",
      address: setting.value,
      network: setting.network,
      updatedAt: setting.updatedAt,
    });
  } catch (error) {
    console.error("Error updating crypto address:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update crypto address",
      error: error.message,
    });
  }
};

// ===================== EXPORTS =====================
exports.getGiftCardSubmissions = getGiftCardSubmissions;
exports.approveGiftCardSubmission = approveGiftCardSubmission;
exports.rejectGiftCardSubmission = rejectGiftCardSubmission;
exports.getCryptoAddress = getCryptoAddress;
exports.updateCryptoAddress = updateCryptoAddress;
