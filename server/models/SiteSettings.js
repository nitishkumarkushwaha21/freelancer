import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'main' },
    marqueeItems: [{ type: String, trim: true }],
    projectCategories: [
      {
        id: { type: String, trim: true },
        label: { type: String, trim: true },
      },
    ],
    pricingAmount: { type: String, default: '₹5,000' },
    pricingFeatures: [{ type: String, trim: true }],
    contactProjectTypes: [{ type: String, trim: true }],
    contactBudgetRanges: [{ type: String, trim: true }],
    hero: {
      eyebrow: { type: String, default: '' },
      headline: { type: String, default: '' },
      subheadline: { type: String, default: '' },
    },
    contactEmail: { type: String, default: 'hello@builtbywho.com' },
    whatsappNumber: { type: String, default: '919876543210' },
  },
  { timestamps: true }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);
