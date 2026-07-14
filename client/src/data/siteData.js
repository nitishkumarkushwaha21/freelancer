export const services = [
  {
    icon: '▣',
    title: 'Landing Pages',
    description: 'One page, one job. Built to convert visitors into leads or customers, fast.',
  },
  {
    icon: '◈',
    title: 'Portfolio Sites',
    description: 'For creators, freelancers, and professionals who need to look sharp online.',
  },
  {
    icon: '▤',
    title: 'E-commerce Stores',
    description: 'Product listings, cart, checkout — a store that actually sells.',
  },
  {
    icon: '⌁',
    title: 'Web Apps',
    description: "Custom tools and dashboards when a template won't cut it.",
  },
];

export const projectCategories = [
  { id: 'all', label: 'All' },
  { id: 'landing', label: 'Landing Pages' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'webapp', label: 'Web Apps' },
];

export const projects = [
  {
    slug: 'project-slot-01',
    tag: 'Case Study — Coming Soon',
    category: 'landing',
    title: 'Project Slot 01',
    description: 'Landing page · Replace with your first client build',
    featured: true,
    published: true,
    timeline: '6 days',
    stack: ['React', 'Vite', 'Node.js'],
    problem:
      'Client needed a high-converting landing page to launch a new offer — fast, without a bloated agency timeline.',
    solution:
      'We scoped tight, designed mobile-first, and shipped a custom page with clear CTAs and a contact funnel built in.',
    results: [
      'Live in under a week from kickoff',
      'Mobile-ready layout with fast load times',
      'Clear conversion path from hero to contact',
    ],
    liveUrl: null,
  },
  {
    slug: 'project-slot-02',
    tag: 'Case Study — Coming Soon',
    category: 'ecommerce',
    title: 'Project Slot 02',
    description: 'E-commerce · Replace with your second client build',
    featured: true,
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
  },
  {
    slug: 'project-slot-03',
    tag: 'Case Study — Coming Soon',
    category: 'portfolio',
    title: 'Project Slot 03',
    description: 'Portfolio site · Replace with your third client build',
    featured: true,
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
  },
];

export const processSteps = [
  {
    num: '01',
    title: 'Call & scope',
    description: '30-minute call. We lock pages, features, and timeline — no 40-slide deck.',
  },
  {
    num: '02',
    title: 'Design & build',
    description: 'Both devs go heads-down. You get updates, not radio silence.',
  },
  {
    num: '03',
    title: 'Review & revise',
    description: 'One revision round included so the launch matches what you had in mind.',
  },
  {
    num: '04',
    title: 'Ship live',
    description: 'Deployed, tested, and handed over — usually within 7 days on standard scope.',
  },
];

export const founders = [
  {
    initial: 'A',
    name: 'Founder One',
    role: 'Frontend & Design',
    bio: 'Handles everything the client sees — interfaces, interactions, the stuff that makes a site feel expensive.',
  },
  {
    initial: 'B',
    name: 'Founder Two',
    role: 'Backend & Infra',
    bio: 'Handles everything that keeps it running — servers, databases, deployment, the stuff nobody sees until it breaks.',
  },
];

export const pricingFeatures = [
  'Custom design, not a theme',
  'Mobile-ready, fast-loading',
  '7-day delivery on standard scope',
  'Direct access to both devs',
];

/** Only published testimonials render on the site. */
export const testimonials = [];

export const faqItems = [
  {
    num: '01',
    question: 'How fast can you actually deliver?',
    answer:
      'Most single-page sites ship in 5–7 days from the day we lock scope and get your content. Bigger builds get a clear timeline upfront — no surprises.',
  },
  {
    num: '02',
    question: "What's included in the starting price?",
    answer:
      'A custom-designed, mobile-ready site built for your specific business — not a stock template. Final price depends on pages and features, and we always quote before starting.',
  },
  {
    num: '03',
    question: 'Do you offer revisions?',
    answer:
      'Yes. Every project includes a revision round before final delivery, so what you launch actually matches what you had in mind.',
  },
  {
    num: '04',
    question: 'Can you handle e-commerce or backend work too?',
    answer:
      "Yes — between the two of us we cover frontend, backend, and deployment, so we're not limited to simple static pages.",
  },
];

export const marqueeItems = [
  '7-DAY TURNAROUND',
  'PIXEL-PERFECT BUILDS',
  'NO BLOATED TIMELINES',
  '2 DEVS, FULL FOCUS',
];

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug && p.published);
}

export function getFeaturedProjects(limit = 3) {
  return projects.filter((p) => p.published && p.featured).slice(0, limit);
}

export function getPublishedTestimonials() {
  return testimonials.filter((t) => t.published);
}
