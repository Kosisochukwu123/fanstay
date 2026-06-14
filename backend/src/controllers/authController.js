const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { generateToken, sendTokenCookie } = require('../utils/token');
const { sendEmail, welcomeTemplate } = require('../utils/email');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, referralCode } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  let referredBy = null;
  if (referralCode) {
    const referrer = await User.findOne({ referralCode });
    if (referrer) referredBy = referrer._id;
  }

  const myReferralCode = crypto.randomBytes(4).toString('hex');

  const user = await User.create({
    name,
    email,
    password,
    referralCode: myReferralCode,
    referredBy,
  });

  const token = generateToken(user._id);
  sendTokenCookie(res, token);

  sendEmail({
    to: user.email,
    subject: 'Welcome to FanStay',
    html: welcomeTemplate(user.name),
  });

  res.status(201).json({
    success: true,
    token,
    user: user.toSafeObject(),
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  if (!user.isActive) {
    return res.status(403).json({ success: false, message: 'Account has been deactivated' });
  }

  const token = generateToken(user._id);
  sendTokenCookie(res, token);

  res.status(200).json({
    success: true,
    token,
    user: user.toSafeObject(),
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user.toSafeObject() });
});

// @desc    Google OAuth login/register
// @route   POST /api/auth/google
// @access  Public
// Expects { idToken } from frontend Google Sign-In
exports.googleAuth = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ success: false, message: 'idToken is required' });
  }

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  let user = await User.findOne({ email: payload.email });

  if (!user) {
    user = await User.create({
      name: payload.name,
      email: payload.email,
      googleId: payload.sub,
      avatar: { url: payload.picture || '', publicId: '' },
      referralCode: crypto.randomBytes(4).toString('hex'),
    });
    sendEmail({
      to: user.email,
      subject: 'Welcome to FanStay',
      html: welcomeTemplate(user.name),
    });
  } else if (!user.googleId) {
    user.googleId = payload.sub;
    await user.save();
  }

  const token = generateToken(user._id);
  sendTokenCookie(res, token);

  res.status(200).json({
    success: true,
    token,
    user: user.toSafeObject(),
  });
});

// @desc    Update profile (name, avatar, walletAddress, phone, language)
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'walletAddress', 'phone', 'preferredLanguage'];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, user: user.toSafeObject() });
});

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!user.password) {
    return res.status(400).json({ success: false, message: 'No password set for this account (Google sign-in)' });
  }
  if (!(await user.comparePassword(currentPassword))) {
    return res.status(401).json({ success: false, message: 'Current password is incorrect' });
  }
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true, message: 'Password updated successfully' });
});

// @desc    Apply to become a host
// @route   POST /api/auth/become-host
// @access  Private
exports.applyForHost = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user.role === 'host' || user.role === 'admin') {
    return res.status(400).json({ success: false, message: 'Already a host or admin' });
  }
  user.hostApprovalStatus = 'pending';
  await user.save();

  res.status(200).json({ success: true, message: 'Host application submitted', user: user.toSafeObject() });
});
