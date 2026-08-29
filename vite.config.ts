import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import express from 'express';
import dotenv from 'dotenv';
import apiRouter from './src/server/api';

dotenv.config();

function expressApiPlugin() {
  return {
    name: 'express-api-plugin',
    configureServer(server: any) {
      const app = express();
      app.use(express.json({ limit: '10mb' }));
      app.use(express.urlencoded({ extended: true, limit: '10mb' }));
      app.use('/api/ai', apiRouter);

      server.middlewares.use(app);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [expressApiPlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
