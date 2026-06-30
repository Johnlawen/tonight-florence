import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        admin: './admin.html',
        afterDark: './after-dark.html',
        aperitivo: './aperitivo.html',
        events: './events.html',
        explore: './explore.html',
        guides: './guides.html',
        hiddenGems: './hidden-gems.html',
        plan: './plan.html',
        scan: './scan.html'
      }
    }
  }
});
