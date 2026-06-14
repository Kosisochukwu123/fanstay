const express = require('express');
const router = express.Router();
const { getEarnings } = require('../controllers/hostController');
const { protect, authorize } = require('../middleware/auth');

router.get('/earnings', protect, authorize('host', 'admin'), getEarnings);

module.exports = router;
