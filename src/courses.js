// Single source of truth for the course catalogue.
// Used by the landing page (cards, departure board, learning path) and by the
// "All courses" link shown inside every course. Add a course here, give it a
// folder in courses/<slug>/ and an entry in vite.config.js.

export const SITE_NAME = 'Aviation Study';

export const COURSES = [
  {
    slug: 'market-lab',
    href: '/courses/market-lab/',
    flight: 'AS101',
    gate: 'A1',
    leg: 1,
    title: 'Passenger Market Lab',
    subtitle: 'July 2025 · IATA case study',
    from: { code: 'RPK', label: 'Demand' },
    to: { code: 'PLF', label: 'Load factor' },
    level: 'Beginner',
    duration: '43–65 min',
    accent: '#0072ce',
    pitch:
      'Read a real airline market like an analyst. Compare demand, capacity and load factor across regions, then test a capacity scenario in the lab.',
    learn: [
      'Explain RPK, ASK and PLF in plain words',
      'Tell growth, size and contribution apart',
      'Predict how a capacity change moves load factor',
      'Defend a recommendation with evidence',
    ],
    facts: ['57 IATA records', '10 guided sections', '5 workshop tasks'],
    saves: 'Answers stay in the open page only.',
  },
  {
    slug: 'kpi-dashboard',
    href: '/courses/kpi-dashboard/',
    flight: 'AS102',
    gate: 'B2',
    leg: 2,
    title: 'Aviation KPI Dashboard',
    subtitle: 'CAM.145 dataset · 5 airlines · 2025',
    from: { code: 'ASK', label: 'Capacity' },
    to: { code: 'EUR', label: 'Profit' },
    level: 'Intermediate',
    duration: 'Self-paced',
    accent: '#0f766e',
    pitch:
      'Turn 5,000 flights into the numbers airline managers watch every day. Filter by airline, route and month, and see exactly how each KPI is calculated.',
    learn: [
      'Calculate PLF, OTP, CASK, RASK and yield',
      'Add totals first, divide last (never average %)',
      'Separate flows (profit) from stocks (debt)',
      'Compare airlines and read trends month by month',
    ],
    facts: ['35 KPIs in 5 groups', 'Worked example for every KPI', 'CSV export'],
    saves: 'Synthetic figures with real airline names.',
  },
  {
    slug: 'qms-companion',
    href: '/courses/qms-companion/',
    flight: 'AS103',
    gate: 'C3',
    leg: 3,
    title: 'QMS Study Companion',
    subtitle: 'CAM.104 · Compliance & quality management',
    from: { code: 'PLN', label: 'Plan' },
    to: { code: 'ACT', label: 'Act' },
    level: 'Intermediate',
    duration: '4 × 45 min',
    accent: '#c6613f',
    pitch:
      'Learn how airlines stay safe and compliant: quality principles, audits, findings and Just Culture, in four short modules with slides and self-checks.',
    learn: [
      'Distinguish QC, QA and quality management',
      'Use the PDCA cycle and the process approach',
      'Separate audit evidence, findings and conclusions',
      'Explain how Just Culture drives learning',
    ],
    facts: ['4 modules · 6 stages each', '72-question bank', 'Slide PDFs to download'],
    saves: 'Your progress is saved in this browser.',
  },
];

export const courseBySlug = (slug) => COURSES.find((c) => c.slug === slug);
