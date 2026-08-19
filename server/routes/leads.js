import express from 'express';
import rateLimit from 'express-rate-limit';
import Lead from '../models/Lead.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many submissions. Please try again in 15 minutes.' },
});

router.post('/', leadLimiter, async (req, res) => {
  try {
    const { name, email, phone, projectType, budget, message } = req.body;

    if (!name?.trim() || !email?.trim() || !projectType?.trim() || !budget?.trim() || !message?.trim()) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    const lead = await Lead.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || '',
      projectType: projectType.trim(),
      budget: budget.trim(),
      message: message.trim(),
    });

    res.status(201).json({ message: 'Inquiry received.', id: lead._id });
  } catch (err) {
    console.error('Lead submission error:', err);
    res.status(500).json({ message: 'Server error. Please try WhatsApp instead.' });
  }
});

router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      Lead.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Lead.countDocuments(),
    ]);

    res.json({ leads, total, page, limit, pages: Math.ceil(total / limit) || 1 });
  } catch (err) {
    console.error('Lead fetch error:', err);
    res.status(500).json({ message: 'Failed to load inquiries.' });
  }
});

export default router;
