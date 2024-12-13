import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/lookup-table-generator-dynamic/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
