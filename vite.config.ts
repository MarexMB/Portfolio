import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Portfolio/',

  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        about: 'about.html',
        projects: 'projects.html',
        notes: 'notes.html'
      },
      output: {
        manualChunks: {
          three: ['three']
        }
      }
    }
  }
});
