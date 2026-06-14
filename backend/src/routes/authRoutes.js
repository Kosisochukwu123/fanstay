const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  googleAuth,
  updateProfile,
  changePassword,
  applyForHost,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate, registerRules, loginRules } = require('../middleware/validators');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, registerRules, validate, register);
router.post('/login', authLimiter, loginRules, validate, login);
router.post('/google', authLimiter, googleAuth);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.post('/become-host', protect, applyForHost);

module.exports = router;
