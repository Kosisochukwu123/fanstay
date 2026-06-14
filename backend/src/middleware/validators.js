const { validationResult, body } = require('express-validator');

// Generic handler to throw errors collected by express-validator chains
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

exports.registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 60 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/\d/)
    .withMessage('Password must contain a number'),
];

exports.loginRules = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.propertyRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 120 }),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('location.city').trim().notEmpty().withMessage('City is required'),
  body('location.country').trim().notEmpty().withMessage('Country is required'),
  body('location.address').trim().notEmpty().withMessage('Address is required'),
  body('pricePerNight').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('coordinates.lat').isFloat().withMessage('Latitude required'),
  body('coordinates.lng').isFloat().withMessage('Longitude required'),
];

exports.bookingRules = [
  body('property').notEmpty().withMessage('Property ID is required'),
  body('checkIn').isISO8601().withMessage('Valid check-in date required'),
  body('checkOut').isISO8601().withMessage('Valid check-out date required'),
  body('paymentMethod').isIn(['crypto', 'gift_card']).withMessage('Invalid payment method'),
];

exports.reviewRules = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Comment is required').isLength({ max: 1000 }),
];

exports.eventRules = [
  body('eventName').trim().notEmpty().withMessage('Event name is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('stadium').trim().notEmpty().withMessage('Stadium is required'),
  body('eventDate').isISO8601().withMessage('Valid event date required'),
];
