import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../../models/User.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/', async (_req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 }).lean();
    res.json({ users });
  } catch (err) {
    console.error('Users fetch error:', err);
    res.status(500).json({ message: 'Failed to load users.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { email, password, role = 'user' } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Role must be admin or user.' });
    }

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.trim().toLowerCase(),
      passwordHash,
      role,
    });

    res.status(201).json({
      user: { _id: user._id, email: user.email, role: user.role, isActive: user.isActive },
    });
  } catch (err) {
    console.error('User create error:', err);
    res.status(500).json({ message: 'Failed to create user.' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { role, isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (role !== undefined) {
      if (!['admin', 'user'].includes(role)) {
        return res.status(400).json({ message: 'Role must be admin or user.' });
      }

      if (user.role === 'admin' && role !== 'admin') {
        const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
        if (adminCount <= 1) {
          return res.status(400).json({ message: 'Cannot demote the last active admin.' });
        }
      }

      user.role = role;
    }

    if (isActive !== undefined) {
      if (user.role === 'admin' && !isActive) {
        const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
        if (adminCount <= 1) {
          return res.status(400).json({ message: 'Cannot deactivate the last active admin.' });
        }
      }

      user.isActive = isActive;
    }

    await user.save();

    res.json({
      user: { _id: user._id, email: user.email, role: user.role, isActive: user.isActive },
    });
  } catch (err) {
    console.error('User update error:', err);
    res.status(500).json({ message: 'Failed to update user.' });
  }
});

export default router;
