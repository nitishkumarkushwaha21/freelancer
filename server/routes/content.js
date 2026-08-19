import express from 'express';
import Project from '../models/Project.js';
import TeamMember from '../models/TeamMember.js';
import Service from '../models/Service.js';
import ProcessStep from '../models/ProcessStep.js';
import FaqItem from '../models/FaqItem.js';
import SiteSettings from '../models/SiteSettings.js';

const router = express.Router();

async function getSettings() {
  let settings = await SiteSettings.findOne({ key: 'main' }).lean();
  if (!settings) {
    settings = await SiteSettings.create({ key: 'main' });
    settings = settings.toObject();
  }
  return settings;
}

router.get('/all', async (_req, res) => {
  try {
    const [projects, team, services, process, faq, settings] = await Promise.all([
      Project.find({ published: true }).sort({ sortOrder: 1, createdAt: -1 }).lean(),
      TeamMember.find({ published: true }).sort({ sortOrder: 1, createdAt: -1 }).lean(),
      Service.find({ published: true }).sort({ sortOrder: 1, createdAt: -1 }).lean(),
      ProcessStep.find().sort({ sortOrder: 1, createdAt: -1 }).lean(),
      FaqItem.find({ published: true }).sort({ sortOrder: 1, createdAt: -1 }).lean(),
      getSettings(),
    ]);

    res.json({ projects, team, services, process, faq, settings });
  } catch (err) {
    console.error('Content all fetch error:', err);
    res.status(500).json({ message: 'Failed to load site content.' });
  }
});

router.get('/projects', async (_req, res) => {
  try {
    const projects = await Project.find({ published: true }).sort({ sortOrder: 1, createdAt: -1 }).lean();
    res.json({ projects });
  } catch (err) {
    console.error('Projects fetch error:', err);
    res.status(500).json({ message: 'Failed to load projects.' });
  }
});

router.get('/projects/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, published: true }).lean();
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    res.json({ project });
  } catch (err) {
    console.error('Project fetch error:', err);
    res.status(500).json({ message: 'Failed to load project.' });
  }
});

router.get('/team', async (_req, res) => {
  try {
    const team = await TeamMember.find({ published: true }).sort({ sortOrder: 1, createdAt: -1 }).lean();
    res.json({ team });
  } catch (err) {
    console.error('Team fetch error:', err);
    res.status(500).json({ message: 'Failed to load team.' });
  }
});

router.get('/services', async (_req, res) => {
  try {
    const services = await Service.find({ published: true }).sort({ sortOrder: 1, createdAt: -1 }).lean();
    res.json({ services });
  } catch (err) {
    console.error('Services fetch error:', err);
    res.status(500).json({ message: 'Failed to load services.' });
  }
});

router.get('/process', async (_req, res) => {
  try {
    const process = await ProcessStep.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    res.json({ process });
  } catch (err) {
    console.error('Process fetch error:', err);
    res.status(500).json({ message: 'Failed to load process steps.' });
  }
});

router.get('/faq', async (_req, res) => {
  try {
    const faq = await FaqItem.find({ published: true }).sort({ sortOrder: 1, createdAt: -1 }).lean();
    res.json({ faq });
  } catch (err) {
    console.error('FAQ fetch error:', err);
    res.status(500).json({ message: 'Failed to load FAQ.' });
  }
});

router.get('/settings', async (_req, res) => {
  try {
    const settings = await getSettings();
    res.json({ settings });
  } catch (err) {
    console.error('Settings fetch error:', err);
    res.status(500).json({ message: 'Failed to load settings.' });
  }
});

export default router;
