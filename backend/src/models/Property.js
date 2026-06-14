const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false }
);

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 5000 },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true, index: true },
      country: { type: String, required: true },
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    nearbyEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null },
    amenities: [{ type: String }],
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    pricePerNight: { type: Number, required: true, min: 0 },
    maxGuests: { type: Number, default: 1, min: 1 },
    bedrooms: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    availabilityCalendar: [availabilitySchema],
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending_review'],
      default: 'active',
    },
  },
  { timestamps: true }
);

propertySchema.index({ title: 'text', 'location.city': 'text', description: 'text' });
propertySchema.index({ pricePerNight: 1 });
propertySchema.index({ 'rating.average': -1 });

module.exports = mongoose.model('Property', propertySchema);
