import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps asset and data paths relative, so the build works at the
// root of Netlify/Vercel and also under a sub-path such as GitHub Pages.
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
  },
});
