import mongoose from 'mongoose';

const faqItemSchema = new mongoose.Schema(
  {
    num: { type: String, required: true, trim: true },
    question: { type: String, required: true, trim: true },
    answer: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('FaqItem', faqItemSchema);
