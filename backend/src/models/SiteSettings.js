const mongoose = require('mongoose');

// Singleton document - there should only ever be one SiteSettings record.
const siteSettingsSchema = new mongoose.Schema(
  {
    // Branding / theme
    theme: {
      primaryColor: { type: String, default: '#FF385C' },
      primaryColorDark: { type: String, default: '#E31C5F' },
      secondaryColor: { type: String, default: '#00A699' },
      accentColor: { type: String, default: '#FFB400' },
      logoText: { type: String, default: 'FanStay' },
      fontFamily: { type: String, default: "'Helvetica Neue', Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
      borderRadiusBase: { type: String, default: '12px' },
    },

    // Homepage hero content
    hero: {
      headline: { type: String, default: 'Find your stay near the action' },
      subheadline: { type: String, default: 'Discover accommodations near major sporting events around the world' },
      backgroundImage: { type: String, default: '' },
    },

    // Homepage section visibility & ordering
    homepageSections: {
      showUpcomingEvents: { type: Boolean, default: true },
      showPopularDestinations: { type: Boolean, default: true },
      showFeatured: { type: Boolean, default: true },
      showInspiration: { type: Boolean, default: true },
      showTestimonials: { type: Boolean, default: true },
      featuredCities: [{ type: String }], // ordered list of cities to feature; empty = auto
    },

    // Testimonials (admin editable)
    testimonials: [
      {
        name: { type: String, required: true },
        text: { type: String, required: true },
        avatar: { type: String, default: '' },
      },
    ],

    // Inspiration for future getaways - admin editable category tabs + destinations
    inspirationCategories: [
      {
        label: { type: String, required: true },
        destinations: [
          {
            name: { type: String, required: true },
            tag: { type: String, default: '' },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Ensure only one settings document exists; fetch-or-create helper
siteSettingsSchema.statics.getSingleton = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);