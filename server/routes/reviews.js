import express from 'express';
import rateLimit from 'express-rate-limit';
import Review from '../models/Review.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const PROJECT_TYPES = ['Landing Page', 'Portfolio Site', 'E-commerce', 'Web App', 'Other'];

const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many review submissions. Please try again in 15 minutes.' },
});

router.post('/', reviewLimiter, async (req, res) => {
  try {
    const { name, role, rating, projectType, experience } = req.body;

    if (!name?.trim() || !role?.trim() || !projectType?.trim() || !experience?.trim()) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const stars = Number(rating);
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      return res.status(400).json({ message: 'Please select a rating from 1 to 5 stars.' });
    }

    if (!PROJECT_TYPES.includes(projectType.trim())) {
      return res.status(400).json({ message: 'Please select a valid project type.' });
    }

    const review = await Review.create({
      name: name.trim(),
      role: role.trim(),
      rating: stars,
      projectType: projectType.trim(),
      experience: experience.trim(),
      published: false,
    });

    res.status(201).json({ message: 'Thank you! Your review will appear after we approve it.', id: review._id });
  } catch (err) {
    console.error('Review submission error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

router.get('/', async (_req, res) => {
  try {
    const reviews = await Review.find({ published: true }).sort({ createdAt: -1 }).lean();
    res.json({ reviews });
  } catch (err) {
    console.error('Review fetch error:', err);
    res.status(500).json({ message: 'Failed to load reviews.' });
  }
});

router.get('/all', requireAuth, requireAdmin, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Review.countDocuments(),
    ]);

    res.json({ reviews, total, page, limit, pages: Math.ceil(total / limit) || 1 });
  } catch (err) {
    console.error('Admin review fetch error:', err);
    res.status(500).json({ message: 'Failed to load reviews.' });
  }
});

router.patch('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { published } = req.body;

    if (typeof published !== 'boolean') {
      return res.status(400).json({ message: 'published must be true or false.' });
    }

    const review = await Review.findByIdAndUpdate(req.params.id, { published }, { new: true }).lean();

    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    res.json({ review });
  } catch (err) {
    console.error('Review update error:', err);
    res.status(500).json({ message: 'Failed to update review.' });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    res.json({ message: 'Review deleted.' });
  } catch (err) {
    console.error('Review delete error:', err);
    res.status(500).json({ message: 'Failed to delete review.' });
  }
});

export default router;
