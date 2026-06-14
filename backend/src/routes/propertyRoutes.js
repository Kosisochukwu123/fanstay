const express = require('express');
const router = express.Router();
const {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  deletePropertyImage,
  updateAvailability,
  getMyProperties,
  toggleFavorite,
  getFavorites,
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');
const { validate, propertyRules } = require('../middleware/validators');
const upload = require('../middleware/upload');

// Public
router.get('/', getProperties);

// Authenticated - specific routes before /:id to avoid collisions
router.get('/host/mine', protect, authorize('host', 'admin'), getMyProperties);
router.get('/favorites/mine', protect, getFavorites);

router.get('/:id', getProperty);

router.post(
  '/',
  protect,
  authorize('host', 'admin'),
  upload.array('images', 10),
  propertyRules,
  validate,
  createProperty
);

router.put('/:id', protect, authorize('host', 'admin'), upload.array('images', 10), updateProperty);
router.delete('/:id', protect, authorize('host', 'admin'), deleteProperty);
router.delete('/:id/images/:publicId', protect, authorize('host', 'admin'), deletePropertyImage);
router.put('/:id/availability', protect, authorize('host', 'admin'), updateAvailability);
router.post('/:id/favorite', protect, toggleFavorite);

module.exports = router;
