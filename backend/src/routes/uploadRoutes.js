const express = require('express');
const router = express.Router();
const { uploadAvatar } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;
