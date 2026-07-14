import express from 'express';
import rateLimit from 'express-rate-limit';
import Lead from '../models/Lead.js';

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

export default router;
