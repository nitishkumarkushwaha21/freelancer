import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Project from './models/Project.js';
import TeamMember from './models/TeamMember.js';
import Service from './models/Service.js';
import ProcessStep from './models/ProcessStep.js';
import FaqItem from './models/FaqItem.js';
import SiteSettings from './models/SiteSettings.js';

const DEFAULT_ADMIN_EMAIL = 'nikuku02@gmail.com';
const DEFAULT_ADMIN_PASSWORD = 'Nikuku@30';

export async function ensureAdminUser() {
  const email = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;

  if (!email || !password) return;

  const passwordHash = await bcrypt.hash(password, 10);
  const existing = await User.findOne({ email });

  if (!existing) {
    await User.create({
      email,
      passwordHash,
      role: 'admin',
      isActive: true,
    });
    console.log(`Created first admin user: ${email}`);
    return;
  }

  existing.passwordHash = passwordHash;
  existing.role = 'admin';
  existing.isActive = true;
  await existing.save();
  console.log(`Ensured admin user: ${email}`);
}

const services = [
  {
    icon: '▣',
    title: 'Landing Pages',
    description: 'One page, one job. Built to convert visitors into leads or customers, fast.',
    sortOrder: 0,
  },
  {
    icon: '◈',
    title: 'Portfolio Sites',
    description: 'For creators, freelancers, and professionals who need to look sharp online.',
    sortOrder: 1,
  },
  {
    icon: '▤',
    title: 'E-commerce Stores',
    description: 'Product listings, cart, checkout — a store that actually sells.',
    sortOrder: 2,
  },
  {
    icon: '⌁',
    title: 'Web Apps',
    description: "Custom tools and dashboards when a template won't cut it.",
    sortOrder: 3,
  },
];

const projectCategories = [
  { id: 'all', label: 'All' },
  { id: 'landing', label: 'Landing Pages' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'webapp', label: 'Web Apps' },
];

const projects = [
  {
    slug: 'root-and-rise',
    tag: 'Yoga Studio — Live Demo',
    category: 'landing',
    title: 'Root & Rise',
    description: 'Yoga & mobility studio · Indiranagar, Bengaluru',
    featured: true,
    published: true,
    timeline: '6 days',
    stack: ['React', 'Express', 'MongoDB'],
    problem:
      'A neighbourhood yoga studio needed a site that felt calm and premium — not a generic wellness template — with real class booking, not just a contact form.',
    solution:
      "We built a standalone MERN app with the studio's forest-and-gold identity, animated breathing hero, live Tuesday schedule from MongoDB, and a trial class booking flow.",
    results: [
      'Faithful custom design — Fraunces + Sora, zero template feel',
      'Dynamic class schedule with live spot counts',
      'Trial booking form saves to database and decrements spots',
    ],
    liveUrl: process.env.ROOT_RISE_URL || 'http://localhost:5174',
    sortOrder: 0,
  },
  {
    slug: 'project-slot-02',
    tag: 'Case Study — Coming Soon',
    category: 'ecommerce',
    title: 'Project Slot 02',
    description: 'E-commerce · Replace with your second client build',
    featured: false,
    published: true,
    timeline: '7 days',
    stack: ['React', 'Express', 'MongoDB'],
    problem:
      'A small brand wanted to sell online without wrestling a generic template or paying for features they did not need.',
    solution:
      'We built a focused storefront: product listings, cart flow, and checkout path tuned for their catalog size.',
    results: [
      'Store structure ready for real products',
      'Clean admin-friendly product layout',
      'End-to-end purchase flow wired up',
    ],
    liveUrl: null,
    sortOrder: 1,
  },
  {
    slug: 'project-slot-03',
    tag: 'Case Study — Coming Soon',
    category: 'portfolio',
    title: 'Project Slot 03',
    description: 'Portfolio site · Replace with your third client build',
    featured: false,
    published: true,
    timeline: '5 days',
    stack: ['React', 'CSS', 'Vite'],
    problem:
      'A freelancer needed a portfolio that felt premium and loaded instantly — not another cookie-cutter theme.',
    solution:
      'Custom layout, sharp typography, and a work grid designed to showcase projects without clutter.',
    results: [
      'Distinct visual identity on a tight budget',
      'Portfolio grid ready for real case studies',
      'Fast, lightweight frontend build',
    ],
    liveUrl: null,
    sortOrder: 2,
  },
];

const processSteps = [
  {
    num: '01',
    title: 'Call & scope',
    description: '30-minute call. We lock pages, features, and timeline — no 40-slide deck.',
    sortOrder: 0,
  },
  {
    num: '02',
    title: 'Design & build',
    description: 'Both devs go heads-down. You get updates, not radio silence.',
    sortOrder: 1,
  },
  {
    num: '03',
    title: 'Review & revise',
    description: 'One revision round included so the launch matches what you had in mind.',
    sortOrder: 2,
  },
  {
    num: '04',
    title: 'Ship live',
    description: 'Deployed, tested, and handed over — usually within 7 days on standard scope.',
    sortOrder: 3,
  },
];

const team = [
  {
    initial: 'A',
    name: 'Founder One',
    role: 'Frontend & Design',
    bio: 'Handles everything the client sees — interfaces, interactions, the stuff that makes a site feel expensive.',
    color: '#22d3ee',
    isFounder: true,
    sortOrder: 0,
  },
  {
    initial: 'B',
    name: 'Founder Two',
    role: 'Backend & Infra',
    bio: 'Handles everything that keeps it running — servers, databases, deployment, the stuff nobody sees until it breaks.',
    color: '#a78bfa',
    isFounder: true,
    sortOrder: 1,
  },
  {
    initial: '3',
    name: 'Developer 3',
    role: 'Backend Developer',
    bio: 'Placeholder seat — APIs, data, and the systems that keep client sites fast under load.',
    color: '#34d399',
    isFounder: false,
    sortOrder: 2,
  },
  {
    initial: '4',
    name: 'Developer 4',
    role: 'UI/UX Developer',
    bio: 'Placeholder seat — product design, interaction, and the last 10% that makes a build feel finished.',
    color: '#fb923c',
    isFounder: false,
    sortOrder: 3,
  },
];

const faqItems = [
  {
    num: '01',
    question: 'How fast can you actually deliver?',
    answer:
      'Most single-page sites ship in 5–7 days from the day we lock scope and get your content. Bigger builds get a clear timeline upfront — no surprises.',
    sortOrder: 0,
  },
  {
    num: '02',
    question: "What's included in the starting price?",
    answer:
      'A custom-designed, mobile-ready site built for your specific business — not a stock template. Final price depends on pages and features, and we always quote before starting.',
    sortOrder: 1,
  },
  {
    num: '03',
    question: 'Do you offer revisions?',
    answer:
      'Yes. Every project includes a revision round before final delivery, so what you launch actually matches what you had in mind.',
    sortOrder: 2,
  },
  {
    num: '04',
    question: 'Can you handle e-commerce or backend work too?',
    answer:
      "Yes — between the two of us we cover frontend, backend, and deployment, so we're not limited to simple static pages.",
    sortOrder: 3,
  },
];

const settingsData = {
  key: 'main',
  marqueeItems: [
    '7-DAY TURNAROUND',
    'PIXEL-PERFECT BUILDS',
    'NO BLOATED TIMELINES',
    '2 DEVS, FULL FOCUS',
  ],
  projectCategories,
  pricingAmount: '₹5,000',
  pricingFeatures: [
    'Custom design, not a theme',
    'Mobile-ready, fast-loading',
    '7-day delivery on standard scope',
    'Direct access to both devs',
  ],
  contactProjectTypes: ['Landing Page', 'Portfolio Site', 'E-commerce', 'Web App', 'Other'],
  contactBudgetRanges: ['Under ₹10,000', '₹10,000 – ₹25,000', '₹25,000 – ₹50,000', '₹50,000+'],
  hero: {
    eyebrow: 'Web Studio — 2 Devs, 0 Excuses',
    headline: 'SMALL TEAM.\nBIG OBSESSION\nWITH DETAIL.',
    subheadline:
      'We build fast, clean, no-nonsense websites for small businesses and founders who need it done right — and done in a week, not a quarter.',
  },
  contactEmail: 'hello@builtbywho.com',
  whatsappNumber: '919876543210',
};

export async function ensureDefaultContent() {
  if ((await Project.countDocuments()) === 0) {
    await Project.insertMany(projects);
    console.log(`Seeded ${projects.length} projects`);
  }

  if ((await TeamMember.countDocuments()) === 0) {
    await TeamMember.insertMany(team);
    console.log(`Seeded ${team.length} team members`);
  }

  if ((await Service.countDocuments()) === 0) {
    await Service.insertMany(services);
    console.log(`Seeded ${services.length} services`);
  }

  if ((await ProcessStep.countDocuments()) === 0) {
    await ProcessStep.insertMany(processSteps);
    console.log(`Seeded ${processSteps.length} process steps`);
  }

  if ((await FaqItem.countDocuments()) === 0) {
    await FaqItem.insertMany(faqItems);
    console.log(`Seeded ${faqItems.length} FAQ items`);
  }

  const existingSettings = await SiteSettings.findOne({ key: 'main' });
  if (!existingSettings) {
    await SiteSettings.create(settingsData);
    console.log('Seeded site settings');
  }
}
