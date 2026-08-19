import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    icon: { type: String, default: '▣', trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Service', serviceSchema);
