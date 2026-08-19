import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    projectType: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
