const SiteSettings = require('../models/SiteSettings');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { uploadBufferToCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Get site settings (theme, hero, homepage content) - public
// @route   GET /api/settings
// @access  Public
exports.getSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.getSingleton();
  res.status(200).json({ success: true, settings });
});

// @desc    Update theme settings (colors, branding, fonts)
// @route   PUT /api/admin/settings/theme
// @access  Private (admin)
exports.updateTheme = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.getSingleton();
  settings.theme = { ...settings.theme.toObject(), ...req.body };
  await settings.save();
  res.status(200).json({ success: true, theme: settings.theme });
});

// @desc    Update hero content (headline, subheadline, optional background image)
// @route   PUT /api/admin/settings/hero
// @access  Private (admin)
exports.updateHero = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.getSingleton();

  if (req.body.headline !== undefined) settings.hero.headline = req.body.headline;
  if (req.body.subheadline !== undefined) settings.hero.subheadline = req.body.subheadline;

  if (req.file) {
    const result = await uploadBufferToCloudinary(req.file.buffer, 'fanstay/site');
    settings.hero.backgroundImage = result.url;
  } else if (req.body.backgroundImage !== undefined) {
    settings.hero.backgroundImage = req.body.backgroundImage;
  }

  await settings.save();
  res.status(200).json({ success: true, hero: settings.hero });
});

// @desc    Update homepage section visibility/order/featured cities
// @route   PUT /api/admin/settings/homepage-sections
// @access  Private (admin)
exports.updateHomepageSections = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.getSingleton();
  settings.homepageSections = { ...settings.homepageSections.toObject(), ...req.body };
  await settings.save();
  res.status(200).json({ success: true, homepageSections: settings.homepageSections });
});

// @desc    Replace testimonials list
// @route   PUT /api/admin/settings/testimonials
// @access  Private (admin)
exports.updateTestimonials = asyncHandler(async (req, res) => {
  const { testimonials } = req.body; // array of { name, text, avatar }
  if (!Array.isArray(testimonials)) {
    return res.status(400).json({ success: false, message: 'testimonials must be an array' });
  }

  const settings = await SiteSettings.getSingleton();
  settings.testimonials = testimonials;
  await settings.save();
  res.status(200).json({ success: true, testimonials: settings.testimonials });
});

// @desc    Replace inspiration categories
// @route   PUT /api/admin/settings/inspiration
// @access  Private (admin)
exports.updateInspiration = asyncHandler(async (req, res) => {
  const { inspirationCategories } = req.body; // array of { label, destinations: [{ name, tag }] }
  if (!Array.isArray(inspirationCategories)) {
    return res.status(400).json({ success: false, message: 'inspirationCategories must be an array' });
  }

  const settings = await SiteSettings.getSingleton();
  settings.inspirationCategories = inspirationCategories;
  await settings.save();
  res.status(200).json({ success: true, inspirationCategories: settings.inspirationCategories });
});

// @desc    Reset all settings to defaults
// @route   POST /api/admin/settings/reset
// @access  Private (admin)
exports.resetSettings = asyncHandler(async (req, res) => {
  await SiteSettings.deleteMany({});
  const settings = await SiteSettings.getSingleton();
  res.status(200).json({ success: true, settings });
});