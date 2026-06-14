const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUser,
  deleteUser,
  getPendingHostApplications,
  reviewHostApplication,
  getAllProperties,
  updatePropertyStatus,
  getAllBookings,
  getAnalytics,
  getAllReviews,
  moderateReview,
  createGiftCardProvider,
  getAllGiftCardProviders,
  updateGiftCardProvider,
  deleteGiftCardProvider,
} = require('../controllers/adminController');
const {
  updateTheme,
  updateHero,
  updateHomepageSections,
  updateTestimonials,
  updateInspiration,
  resetSettings,
} = require('../controllers/settingsController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect, authorize('admin'));

// Users
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Host applications
router.get('/hosts/pending', getPendingHostApplications);
router.put('/hosts/:id/review', reviewHostApplication);

// Listings
router.get('/properties', getAllProperties);
router.put('/properties/:id/status', updatePropertyStatus);

// Bookings
router.get('/bookings', getAllBookings);

// Analytics
router.get('/analytics', getAnalytics);

// Reviews
router.get('/reviews', getAllReviews);
router.put('/reviews/:id/moderate', moderateReview);

// Gift card providers
router.post('/giftcard-providers', createGiftCardProvider);
router.get('/giftcard-providers', getAllGiftCardProviders);
router.put('/giftcard-providers/:id', updateGiftCardProvider);
router.delete('/giftcard-providers/:id', deleteGiftCardProvider);

// Site settings - theme, hero, homepage content
router.put('/settings/theme', updateTheme);
router.put('/settings/hero', upload.single('backgroundImage'), updateHero);
router.put('/settings/homepage-sections', updateHomepageSections);
router.put('/settings/testimonials', updateTestimonials);
router.put('/settings/inspiration', updateInspiration);
router.post('/settings/reset', resetSettings);

module.exports = router;