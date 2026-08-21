import express from 'express';
import rateLimit from 'express-rate-limit';
import Review from '../models/Review.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const PROJECT_TYPES = ['Landing Page', 'Portfolio Site', 'E-commerce', 'Web App', 'Other'];

function validateReviewFields(body) {
  const name = body.name?.trim();
  const role = body.role?.trim();
  const projectType = body.projectType?.trim();
  const experience = body.experience?.trim();
  const stars = Number(body.rating);

  if (!name || !role || !projectType || !experience) {
    return { error: 'Please fill in all required fields.' };
  }

  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    return { error: 'Please select a rating from 1 to 5 stars.' };
  }

  if (!PROJECT_TYPES.includes(projectType)) {
    return { error: 'Please select a valid project type.' };
  }

  return { name, role, rating: stars, projectType, experience };
}

const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many review submissions. Please try again in 15 minutes.' },
});

router.post('/', reviewLimiter, async (req, res) => {
  try {
    const validated = validateReviewFields(req.body);
    if (validated.error) {
      return res.status(400).json({ message: validated.error });
    }

    const review = await Review.create({
      ...validated,
      published: true,
    });

    res.status(201).json({ message: 'Thank you! Your review is now live.', id: review._id });
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

router.post('/admin', requireAuth, requireAdmin, async (req, res) => {
  try {
    const validated = validateReviewFields(req.body);
    if (validated.error) {
      return res.status(400).json({ message: validated.error });
    }

    const published = typeof req.body.published === 'boolean' ? req.body.published : true;

    const review = await Review.create({
      ...validated,
      published,
    });

    res.status(201).json({ review });
  } catch (err) {
    console.error('Admin review create error:', err);
    res.status(500).json({ message: 'Failed to create review.' });
  }
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const validated = validateReviewFields(req.body);
    if (validated.error) {
      return res.status(400).json({ message: validated.error });
    }

    const update = { ...validated };
    if (typeof req.body.published === 'boolean') {
      update.published = req.body.published;
    }

    const review = await Review.findByIdAndUpdate(req.params.id, update, { new: true }).lean();

    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    res.json({ review });
  } catch (err) {
    console.error('Review update error:', err);
    res.status(500).json({ message: 'Failed to update review.' });
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
