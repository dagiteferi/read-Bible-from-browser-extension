import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: resolve(__dirname, 'public/manifest.json'),
          dest: ''
        },
        {
          src: resolve(__dirname, 'public/icon-16.png'),
          dest: ''
        },
        {
          src: resolve(__dirname, 'public/icon-48.png'),
          dest: ''
        },
        {
          src: resolve(__dirname, 'public/icon-128.png'),
          dest: ''
        }
      ]
    })
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        fullverse: resolve(__dirname, 'fullverse.html'),
        background: resolve(__dirname, 'src/background.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') {
            return 'background.js';
          }
          return `assets/[name].js`;
        },
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
});
