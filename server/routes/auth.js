import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again in 15 minutes.' },
});

router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('JWT_SECRET is not set.');
    return res.status(500).json({ message: 'Server configuration error.' });
  }

  if (!email?.trim() || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase(), isActive: true });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have admin access.' });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      expiresIn: 86400,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

router.get('/me', async (req, res) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const token = header.slice(7);
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({ message: 'Server configuration error.' });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findById(payload.userId).select('email role isActive').lean();

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid or expired session.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required.' });
    }

    res.json({ id: payload.userId, email: user.email, role: user.role });
  } catch {
    return res.status(401).json({ message: 'Invalid or expired session.' });
  }
});

export default router;
