const crypto = require("crypto");
const coinbase = require("../config/coinbase");
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const GiftCardProvider = require("../models/GiftCardProvider");
const { asyncHandler } = require("../middleware/errorMiddleware");
const { uploadBufferToCloudinary } = require("../utils/cloudinaryUpload");
const { sendEmail, bookingConfirmationTemplate } = require("../utils/email");
const GiftCardSubmission = require("../models/GiftCardSubmission");
const HospitalitySubmission = require("../models/HospitalitySubmission");

const { resources } = coinbase;
const { Charge } = resources;

// ================== CRYPTO PAYMENT FLOW (Coinbase Commerce) ==================

// @desc    Step 1-2: Create Coinbase Commerce checkout charge for a booking
// @route   POST /api/payments/crypto/create-charge
// @access  Private (guest)
exports.createCryptoCharge = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId).populate(
    "property",
    "title images",
  );
  if (!booking)
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });

  if (booking.guest.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  if (booking.paymentMethod !== "crypto") {
    return res.status(400).json({
      success: false,
      message: "Booking is not set up for crypto payment",
    });
  }

  if (booking.paymentStatus === "paid") {
    return res
      .status(400)
      .json({ success: false, message: "Booking already paid" });
  }

  const chargeData = {
    name: `FanStay Booking - ${booking.property.title}`,
    description: `Stay from ${new Date(booking.checkIn).toDateString()} to ${new Date(booking.checkOut).toDateString()}`,
    pricing_type: "fixed_price",
    local_price: {
      amount: booking.totalAmount.toFixed(2),
      currency: booking.currency || "USD",
    },
    metadata: {
      bookingId: booking._id.toString(),
      userId: req.user._id.toString(),
    },
    redirect_url: `${process.env.CLIENT_URL}/bookings/${booking._id}?payment=success`,
    cancel_url: `${process.env.CLIENT_URL}/bookings/${booking._id}?payment=cancelled`,
  };

  const charge = await Charge.create(chargeData);

  const payment = await Payment.create({
    booking: booking._id,
    user: req.user._id,
    amount: booking.totalAmount,
    currency: booking.currency || "USD",
    coinbaseChargeId: charge.id,
    coinbaseChargeCode: charge.code,
    paymentProvider: "coinbase_commerce",
    status: "pending",
  });

  res.status(201).json({
    success: true,
    payment,
    checkoutUrl: charge.hosted_url,
  });
});

// @desc    Step 4: Coinbase Commerce webhook - verifies payment and confirms booking
// @route   POST /api/payments/crypto/webhook
// @access  Public (verified via signature header)
// NOTE: This route must use raw body parsing (configured in server.js)
exports.coinbaseWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-cc-webhook-signature"];
  const webhookSecret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;

  const rawBody = req.rawBody || JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid webhook signature" });
  }

  const event = req.body.event;
  const chargeCode = event?.data?.code;
  const eventType = event?.type;

  const payment = await Payment.findOne({ coinbaseChargeCode: chargeCode });
  if (!payment) {
    return res
      .status(404)
      .json({ success: false, message: "Payment record not found" });
  }

  // Step 5: Update booking status based on webhook event type
  if (eventType === "charge:confirmed") {
    payment.status = "completed";
    const timeline = event.data.timeline || [];
    const confirmedEvent = timeline.find(
      (t) => t.status === "COMPLETED" || t.status === "CONFIRMED",
    );
    payment.transactionHash = confirmedEvent?.payment?.transaction_id || "";
    await payment.save();

    const booking = await Booking.findById(payment.booking)
      .populate("property")
      .populate("guest");
    booking.paymentStatus = "paid";
    booking.bookingStatus = "confirmed";
    await booking.save();

    sendEmail({
      to: booking.guest.email,
      subject: "Your FanStay booking is confirmed!",
      html: bookingConfirmationTemplate(booking, booking.property),
    });
  } else if (eventType === "charge:failed") {
    payment.status = "failed";
    await payment.save();

    const booking = await Booking.findById(payment.booking);
    booking.paymentStatus = "failed";
    await booking.save();
  } else if (eventType === "charge:delayed" || eventType === "charge:pending") {
    payment.status = "pending";
    await payment.save();
  } else if (eventType === "charge:resolved") {
    payment.status = "completed";
    await payment.save();
  }

  res.status(200).json({ success: true });
});

// @desc    Check status of a crypto payment (manual poll fallback)
// @route   GET /api/payments/crypto/:paymentId/status
// @access  Private
exports.getCryptoPaymentStatus = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.paymentId);
  if (!payment)
    return res
      .status(404)
      .json({ success: false, message: "Payment not found" });

  if (
    payment.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  res.status(200).json({ success: true, status: payment.status, payment });
});

// ================== GIFT CARD PAYMENT FLOW ==================

// @desc    Step 1-2: Guest submits gift card code + image for a booking
// @route   POST /api/payments/giftcard/submit
// @access  Private (guest)
exports.submitGiftCard = asyncHandler(async (req, res) => {

    console.log("SUBMIT GIFT CARD HIT");

  const { bookingId, provider, giftCardCode } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking)
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });

  if (booking.guest.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }
  if (booking.paymentMethod !== "gift_card") {
    return res.status(400).json({
      success: false,
      message: "Booking is not set up for gift card payment",
    });
  }

  // Step 3: Validate provider is supported/active
  const providerDoc = await GiftCardProvider.findOne({
    name: provider,
    isActive: true,
  });
  if (!providerDoc) {
    return res
      .status(400)
      .json({ success: false, message: "Gift card provider not supported" });
  }

  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "Gift card image is required" });
  }

  const uploadedImage = await uploadBufferToCloudinary(
  req.file.buffer,
  "fanstay/giftcards"
);

console.log("IMAGE:", uploadedImage);

const imageUrl = uploadedImage.secure_url;

console.log("SAVING URL:", imageUrl);

const payment = await Payment.create({
  booking: booking._id,
  user: req.user._id,
  amount: booking.totalAmount,
  currency: booking.currency || "USD",
  giftCardProvider: provider,
  giftCardCode,
  giftCardImage: imageUrl,
  paymentProvider: "gift_card",
  status: "awaiting_admin_review",
});

console.log({
  imageUrl,
  user: req.user._id,
});

await GiftCardSubmission.create({
  user: req.user._id,
  match: booking.match || "",
  category: provider,
  giftCardImage: imageUrl,
  giftCardAmount: booking.totalAmount,
  status: "pending",
});

  res.status(201).json({
    success: true,
    message: "Gift card submitted for admin review",
    payment: { ...payment.toObject(), giftCardCode: undefined },
  });

  console.log("BODY:", req.body);

  console.log("FILE EXISTS:", !!req.file);

  console.log("FILE:", req.file);

  console.log("USER:", req.user?._id);
});

// @desc    Step 4: Admin lists pending gift card submissions
// @route   GET /api/payments/giftcard/pending
// @access  Private (admin)
exports.getPendingGiftCards = asyncHandler(async (req, res) => {
  const payments = await Payment.find({
    paymentProvider: "gift_card",
    status: "awaiting_admin_review",
  })
    .select("+giftCardCode")
    .populate("booking")
    .populate("user", "name email");

  res.status(200).json({ success: true, count: payments.length, payments });
});

// @desc    Step 4-5: Admin approves or rejects gift card -> confirms booking
// @route   PUT /api/payments/giftcard/:paymentId/review
// @access  Private (admin)
exports.reviewGiftCard = asyncHandler(async (req, res) => {
  const { decision, adminNote } = req.body; // 'approved' | 'rejected'

  const payment = await Payment.findById(req.params.paymentId);
  if (!payment)
    return res
      .status(404)
      .json({ success: false, message: "Payment not found" });

  if (payment.status !== "awaiting_admin_review") {
    return res
      .status(400)
      .json({ success: false, message: "Payment already reviewed" });
  }

  payment.adminReviewer = req.user._id;
  payment.adminNote = adminNote || "";

  const booking = await Booking.findById(payment.booking)
    .populate("property")
    .populate("guest");

  if (decision === "approved") {
    payment.status = "completed";
    booking.paymentStatus = "paid";
    booking.bookingStatus = "confirmed"; // Step 5: booking confirmed

    sendEmail({
      to: booking.guest.email,
      subject: "Your FanStay booking is confirmed!",
      html: bookingConfirmationTemplate(booking, booking.property),
    });
  } else if (decision === "rejected") {
    payment.status = "failed";
    booking.paymentStatus = "failed";
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Invalid decision" });
  }

  await payment.save();
  await booking.save();

  res.status(200).json({ success: true, payment, booking });
});

// @desc    Get payment status for a booking (guest)
// @route   GET /api/payments/booking/:bookingId
// @access  Private
exports.getPaymentByBooking = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({ booking: req.params.bookingId }).sort(
    "-createdAt",
  );
  if (!payment)
    return res
      .status(404)
      .json({ success: false, message: "No payment found for this booking" });

  if (
    payment.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  res.status(200).json({ success: true, payment });
});

// ================== GIFT CARD PROVIDERS (Admin managed) ==================

// @desc    Get active gift card providers (for guests to choose from)
// @route   GET /api/payments/giftcard/providers
// @access  Public
exports.getGiftCardProviders = asyncHandler(async (req, res) => {
  const providers = await GiftCardProvider.find({ isActive: true });
  res.status(200).json({ success: true, providers });
});

exports.submitTicketGiftCard = asyncHandler(async (req, res) => {
  const { match, category, giftCardImage, giftCardAmount } = req.body;

  const submission = await GiftCardSubmission.create({
    user: req.user._id,
    match,
    category,
    giftCardImage: giftCardImage,
    giftCardAmount,
    status: "pending",
  });

  res.status(201).json({
    success: true,
    submission,
  });
});

exports.submitHospitality = asyncHandler(async (req, res) => {
  const submission = await HospitalitySubmission.create({
    user: req.user._id,

    packageName: req.body.packageName,

    paymentMethod: req.body.paymentMethod,

    giftCardImage: req.body.giftCardImage,

    giftCardAmount: req.body.giftCardAmount,

    cryptoAmount: req.body.cryptoAmount,

    cryptoAddress: req.body.cryptoAddress,
  });

  res.status(201).json({
    success: true,
    submission,
  });
});
