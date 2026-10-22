import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The site is served from https://roei2p.github.io/rais/
export default defineConfig({
  base: '/rais/',
  plugins: [react(), tailwindcss()],
});
