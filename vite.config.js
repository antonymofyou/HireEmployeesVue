import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader({
      defaultImport: 'component',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // server: {
  //   host: 'example.com',
  //   port: 3000,
  //   open: true,
  //   cors: true,
  //   hmr: {
  //     host: 'example.com',
  //     port: 3000
  //   },
  // },
});
