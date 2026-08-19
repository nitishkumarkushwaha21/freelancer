import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema(
  {
    initial: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    bio: { type: String, default: '' },
    color: { type: String, default: '#22d3ee' },
    imageUrl: { type: String, default: '' },
    isFounder: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('TeamMember', teamMemberSchema);
