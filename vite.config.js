import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const page = (path) => fileURLToPath(new URL(path, import.meta.url));

// Aviation Study is a multi-page site: one landing page plus one page per course.
// Each course is its own HTML entry, so its global CSS and state stay isolated.
//
//   /                          landing page           (index.html, src/)
//   /courses/market-lab/       Passenger Market Lab   (courses/market-lab/)
//   /courses/kpi-dashboard/    Aviation KPI Dashboard (courses/kpi-dashboard/)
//   /courses/qms-companion/    CAM.104 QMS Companion  (courses/qms-companion/)
//
// Static files (dataset, slide PDFs) live in public/courses/<course>/ and are
// served at /courses/<course>/..., next to the course page.
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: page('./index.html'),
        'market-lab': page('./courses/market-lab/index.html'),
        'kpi-dashboard': page('./courses/kpi-dashboard/index.html'),
        'qms-companion': page('./courses/qms-companion/index.html'),
      },
    },
  },
  test: {
    environment: 'node',
    include: ['courses/**/tests/**/*.test.js'],
  },
});
