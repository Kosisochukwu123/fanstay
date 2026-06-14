const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { generalLimiter } = require('./middleware/rateLimiter');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// ===== Security middleware =====
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ===== Coinbase webhook needs raw body BEFORE json parsing for signature verification =====
app.post(
  '/api/payments/crypto/webhook',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    req.rawBody = req.body; // Buffer
    req.body = JSON.parse(req.body.toString('utf8'));
    next();
  },
  paymentRoutes.coinbaseWebhook
);

// ===== Body parsing =====
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ===== Sanitization (XSS / NoSQL injection protection) =====
app.use(mongoSanitize());
app.use(xss());

// ===== Rate limiting =====
app.use('/api', generalLimiter);

// ===== Routes =====
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/host', require('./routes/hostRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/assistant', require('./routes/assistantRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'FanStay API is running' });
});

// ===== Error handling =====
app.use(notFound);
app.use(errorHandler);

module.exports = app;