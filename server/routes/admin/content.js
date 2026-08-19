import express from 'express';
import Project from '../../models/Project.js';
import TeamMember from '../../models/TeamMember.js';
import Service from '../../models/Service.js';
import ProcessStep from '../../models/ProcessStep.js';
import FaqItem from '../../models/FaqItem.js';
import SiteSettings from '../../models/SiteSettings.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Projects
router.get('/projects', async (_req, res) => {
  try {
    const projects = await Project.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    res.json({ projects });
  } catch (err) {
    console.error('Admin projects fetch error:', err);
    res.status(500).json({ message: 'Failed to load projects.' });
  }
});

router.post('/projects', async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.slug && data.title) {
      data.slug = slugify(data.title);
    }
    const project = await Project.create(data);
    res.status(201).json({ project });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'A project with this slug already exists.' });
    }
    console.error('Project create error:', err);
    res.status(500).json({ message: 'Failed to create project.' });
  }
});

router.put('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean();
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json({ project });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'A project with this slug already exists.' });
    }
    console.error('Project update error:', err);
    res.status(500).json({ message: 'Failed to update project.' });
  }
});

router.delete('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json({ message: 'Project deleted.' });
  } catch (err) {
    console.error('Project delete error:', err);
    res.status(500).json({ message: 'Failed to delete project.' });
  }
});

// Team
router.get('/team', async (_req, res) => {
  try {
    const team = await TeamMember.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    res.json({ team });
  } catch (err) {
    console.error('Admin team fetch error:', err);
    res.status(500).json({ message: 'Failed to load team.' });
  }
});

router.post('/team', async (req, res) => {
  try {
    const member = await TeamMember.create(req.body);
    res.status(201).json({ member });
  } catch (err) {
    console.error('Team create error:', err);
    res.status(500).json({ message: 'Failed to create team member.' });
  }
});

router.put('/team/:id', async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean();
    if (!member) return res.status(404).json({ message: 'Team member not found.' });
    res.json({ member });
  } catch (err) {
    console.error('Team update error:', err);
    res.status(500).json({ message: 'Failed to update team member.' });
  }
});

router.delete('/team/:id', async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Team member not found.' });
    res.json({ message: 'Team member deleted.' });
  } catch (err) {
    console.error('Team delete error:', err);
    res.status(500).json({ message: 'Failed to delete team member.' });
  }
});

// Services
router.get('/services', async (_req, res) => {
  try {
    const services = await Service.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    res.json({ services });
  } catch (err) {
    console.error('Admin services fetch error:', err);
    res.status(500).json({ message: 'Failed to load services.' });
  }
});

router.post('/services', async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ service });
  } catch (err) {
    console.error('Service create error:', err);
    res.status(500).json({ message: 'Failed to create service.' });
  }
});

router.put('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean();
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    res.json({ service });
  } catch (err) {
    console.error('Service update error:', err);
    res.status(500).json({ message: 'Failed to update service.' });
  }
});

router.delete('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    res.json({ message: 'Service deleted.' });
  } catch (err) {
    console.error('Service delete error:', err);
    res.status(500).json({ message: 'Failed to delete service.' });
  }
});

// Process
router.get('/process', async (_req, res) => {
  try {
    const process = await ProcessStep.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    res.json({ process });
  } catch (err) {
    console.error('Admin process fetch error:', err);
    res.status(500).json({ message: 'Failed to load process steps.' });
  }
});

router.post('/process', async (req, res) => {
  try {
    const step = await ProcessStep.create(req.body);
    res.status(201).json({ step });
  } catch (err) {
    console.error('Process create error:', err);
    res.status(500).json({ message: 'Failed to create process step.' });
  }
});

router.put('/process/:id', async (req, res) => {
  try {
    const step = await ProcessStep.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean();
    if (!step) return res.status(404).json({ message: 'Process step not found.' });
    res.json({ step });
  } catch (err) {
    console.error('Process update error:', err);
    res.status(500).json({ message: 'Failed to update process step.' });
  }
});

router.delete('/process/:id', async (req, res) => {
  try {
    const step = await ProcessStep.findByIdAndDelete(req.params.id);
    if (!step) return res.status(404).json({ message: 'Process step not found.' });
    res.json({ message: 'Process step deleted.' });
  } catch (err) {
    console.error('Process delete error:', err);
    res.status(500).json({ message: 'Failed to delete process step.' });
  }
});

// FAQ
router.get('/faq', async (_req, res) => {
  try {
    const faq = await FaqItem.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    res.json({ faq });
  } catch (err) {
    console.error('Admin FAQ fetch error:', err);
    res.status(500).json({ message: 'Failed to load FAQ.' });
  }
});

router.post('/faq', async (req, res) => {
  try {
    const item = await FaqItem.create(req.body);
    res.status(201).json({ item });
  } catch (err) {
    console.error('FAQ create error:', err);
    res.status(500).json({ message: 'Failed to create FAQ item.' });
  }
});

router.put('/faq/:id', async (req, res) => {
  try {
    const item = await FaqItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean();
    if (!item) return res.status(404).json({ message: 'FAQ item not found.' });
    res.json({ item });
  } catch (err) {
    console.error('FAQ update error:', err);
    res.status(500).json({ message: 'Failed to update FAQ item.' });
  }
});

router.delete('/faq/:id', async (req, res) => {
  try {
    const item = await FaqItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'FAQ item not found.' });
    res.json({ message: 'FAQ item deleted.' });
  } catch (err) {
    console.error('FAQ delete error:', err);
    res.status(500).json({ message: 'Failed to delete FAQ item.' });
  }
});

// Settings
router.get('/settings', async (_req, res) => {
  try {
    let settings = await SiteSettings.findOne({ key: 'main' }).lean();
    if (!settings) {
      const doc = await SiteSettings.create({ key: 'main' });
      settings = doc.toObject();
    }
    res.json({ settings });
  } catch (err) {
    console.error('Admin settings fetch error:', err);
    res.status(500).json({ message: 'Failed to load settings.' });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate(
      { key: 'main' },
      req.body,
      { new: true, upsert: true, runValidators: true }
    ).lean();
    res.json({ settings });
  } catch (err) {
    console.error('Settings update error:', err);
    res.status(500).json({ message: 'Failed to update settings.' });
  }
});

export default router;
