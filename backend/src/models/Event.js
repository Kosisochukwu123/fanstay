const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true, trim: true },
    sport: { type: String, default: 'Football' },
    city: { type: String, required: true, index: true },
    country: { type: String, required: true },
    stadium: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    eventDate: { type: Date, required: true, index: true },
    endDate: { type: Date },
    description: { type: String, default: '' },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

eventSchema.index({ eventName: 'text', city: 'text' });

module.exports = mongoose.model('Event', eventSchema);
