import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
        afterDark: resolve(__dirname, 'after-dark.html'),
        aperitivo: resolve(__dirname, 'aperitivo.html'),
        events: resolve(__dirname, 'events.html'),
        explore: resolve(__dirname, 'explore.html'),
        guides: resolve(__dirname, 'guides.html'),
        hiddenGems: resolve(__dirname, 'hidden-gems.html'),
        plan: resolve(__dirname, 'plan.html'),
        scan: resolve(__dirname, 'scan.html')
      }
    }
  }
});
