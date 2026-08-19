import mongoose from 'mongoose';

const processStepSchema = new mongoose.Schema(
  {
    num: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('ProcessStep', processStepSchema);
