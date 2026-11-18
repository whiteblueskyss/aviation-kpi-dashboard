# Aviation Study

One website, three interactive aviation courses. A landing page introduces the courses and links to each one, and every course links back to it.

| # | Course | URL | Folder |
|---|--------|-----|--------|
| 1 | **Passenger Market Lab** (July 2025, IATA case study): RPK, ASK, PLF, market comparison, load-factor lab, workshop | `/courses/market-lab/` | [`courses/market-lab`](courses/market-lab) |
| 2 | **Aviation KPI Dashboard** (CAM.145 synthetic dataset): 35 KPIs across 5 airlines and 5,000 flights | `/courses/kpi-dashboard/` | [`courses/kpi-dashboard`](courses/kpi-dashboard) |
| 3 | **CAM.104 QMS Study Companion**: 4 modules on quality management, audits and Just Culture, with a readiness assessment | `/courses/qms-companion/` | [`courses/qms-companion`](courses/qms-companion) |

Everything runs in the browser: there is no backend and no database.

## Credits

**All credit belongs to [Dr. Bahtiyar Eren](https://www.linkedin.com/in/bahtiyar-eren-6562b616/), Eesti Lennuakadeemia · Estonian Aviation Academy.** He created every course on this site: the lessons, datasets, exercises, question bank and slides.

> This repository is an unofficial copy of the courses Dr. Eren shared publicly on LinkedIn, collected here for personal study purposes only. It is not an official Eesti Lennuakadeemia (Estonian Aviation Academy) website and is not endorsed by Dr. Eren or the Academy. For the original material, follow his work on [LinkedIn](https://www.linkedin.com/in/bahtiyar-eren-6562b616/).

## Quick start

Requires Node.js 18 or newer.

```bash
npm install
npm run dev        # http://localhost:5173  (landing page; courses at /courses/<name>/)
npm test           # KPI engine tests
npm run build      # production build of the landing page and all courses into dist/
npm run preview    # serve the production build locally
```

## Project structure

```
index.html                 landing page (tab title "Aviation Study")
src/                       landing page source
  courses.js               course catalogue: titles, links, descriptions (single source of truth)
  App.jsx                  landing page layout
  components/              DepartureBoard, BoardingPass, LoadFactorLab
  shared/AllCoursesLink.jsx  the "← Aviation Study" link shown inside every course
  styles/landing.css
courses/
  market-lab/              Course 1: index.html, src/, README.md
  kpi-dashboard/           Course 2: index.html, src/, tests/, README.md
  qms-companion/           Course 3: index.html, src/, README.md
public/
  favicon.svg              shared icon
  courses/kpi-dashboard/data/   CAM145 dataset (served at /courses/kpi-dashboard/data/...)
  courses/qms-companion/slides/ four module slide PDFs (served at /courses/qms-companion/slides/...)
vite.config.js             multi-page build: one entry per page
vercel.json / netlify.toml deploy settings
```

### How the pages fit together

This is a Vite **multi-page** build. Each course is its own HTML page with its own React app and stylesheet, so the courses cannot break each other's styles or state. They share only `package.json`, the build, the favicon and the small "All courses" link.

### Adding a course

1. Create `courses/<slug>/index.html` and `courses/<slug>/src/`. In the HTML, load the script with a relative path: `<script type="module" src="./src/main.jsx">`.
2. Add the page to `build.rollupOptions.input` in `vite.config.js`.
3. Add an entry to `COURSES` in `src/courses.js`. The landing page cards, departure board and footer update automatically.
4. Put static files in `public/courses/<slug>/` and reference them as `` `${import.meta.env.BASE_URL}courses/<slug>/...` ``.
5. Render `<AllCoursesLink current="<slug>" />` in the course's sidebar or header.

## Deploying

- **Vercel** (current host): the Vite preset works as is. `vercel.json` sets the build command and `dist` output, and adds a trailing slash so `/courses/market-lab` resolves to `/courses/market-lab/`.
- **Netlify**: `netlify.toml` sets the build. The QMS feedback form uses Netlify Forms, so it only sends submissions when the site is hosted on Netlify. On other hosts it shows a "could not be sent" message.

The site is built for the root of a domain (`base: '/'`).

## Content and data notices

- KPI Dashboard: real airline and airport identities, **synthetic** performance and financial figures.
- Passenger Market Lab: **historical** IATA data (published 29 August 2025), not current market reporting.
- CAM.104: © 2026 Dr. Bahtiyar Eren, Eesti Lennuakadeemia · Estonian Aviation Academy.

## History

This repository started as `aviation-kpi-dashboard`. In version 2.0.0 it became **Aviation Study**: the KPI dashboard moved to `courses/kpi-dashboard` (git history kept), and the CAM.104 companion and the Market Lab, previously separate projects, were added as `courses/qms-companion` and `courses/market-lab`. Their individual `package.json`, `vite.config.js`, `netlify.toml` and `.gitignore` files were merged into the root files, which use the same dependencies.
