import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    tag: { type: String, default: '', trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    timeline: { type: String, default: '', trim: true },
    stack: [{ type: String, trim: true }],
    problem: { type: String, default: '' },
    solution: { type: String, default: '' },
    results: [{ type: String, trim: true }],
    liveUrl: { type: String, default: null },
    imageUrl: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
