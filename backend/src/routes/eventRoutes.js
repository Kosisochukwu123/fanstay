const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');
const { validate, eventRules } = require('../middleware/validators');
const upload = require('../middleware/upload');

router.get('/', getEvents);
router.get('/:id', getEvent);

router.post('/', protect, authorize('admin'), upload.single('image'), eventRules, validate, createEvent);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateEvent);
router.delete('/:id', protect, authorize('admin'), deleteEvent);

module.exports = router;
