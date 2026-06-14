const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Email send failed:', error.message);
  }
};

exports.bookingConfirmationTemplate = (booking, property) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #FF385C;">Booking Confirmed!</h2>
    <p>Your booking for <strong>${property.title}</strong> in ${property.location.city} has been confirmed.</p>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px; border: 1px solid #eee;">Check-in</td><td style="padding: 8px; border: 1px solid #eee;">${new Date(booking.checkIn).toDateString()}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #eee;">Check-out</td><td style="padding: 8px; border: 1px solid #eee;">${new Date(booking.checkOut).toDateString()}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #eee;">Total Amount</td><td style="padding: 8px; border: 1px solid #eee;">${booking.totalAmount} ${booking.currency}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #eee;">Payment Method</td><td style="padding: 8px; border: 1px solid #eee;">${booking.paymentMethod}</td></tr>
    </table>
    <p style="margin-top: 20px;">Thank you for booking with FanStay. We hope you enjoy the event!</p>
  </div>
`;

exports.welcomeTemplate = (name) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #FF385C;">Welcome to FanStay, ${name}!</h2>
    <p>Discover accommodations near the world's biggest sporting events. Get started by exploring listings near upcoming matches.</p>
  </div>
`;
