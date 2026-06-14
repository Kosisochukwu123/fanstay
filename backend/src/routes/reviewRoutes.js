const express = require('express');
const router = express.Router();
const {
  createReview,
  getPropertyReviews,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { validate, reviewRules } = require('../middleware/validators');

router.get('/property/:propertyId', getPropertyReviews);
router.post('/', protect, reviewRules, validate, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
