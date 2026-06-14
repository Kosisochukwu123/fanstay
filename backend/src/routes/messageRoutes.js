const express = require('express');
const router = express.Router();
const { getConversation, getInbox, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getInbox);
router.get('/:userId', protect, getConversation);
router.post('/', protect, sendMessage);

module.exports = router;
