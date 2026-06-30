import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './server/config/db';
import { seedMongoDB } from './server/services/dbService';
import apiRoutes from './server/routes/apiRoutes';
import { requestLogger } from './server/middleware/loggerMiddleware';
import { errorHandler } from './server/middleware/errorMiddleware';

const PORT = 3000;
const HOST = '0.0.0.0';

async function startServer() {
  const app = express();

  // Basic Middlewares
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging
  app.use(requestLogger);

  // Serve static uploads directory
  const uploadsPath = path.join(process.cwd(), 'public', 'uploads');
  app.use('/uploads', express.static(uploadsPath));

  // Connect to Database and Seed on startup in the background (non-blocking)
  connectDB().then((isMongoConnected) => {
    if (isMongoConnected) {
      seedMongoDB().catch((err) => {
        console.log('ℹ️ Error seeding MongoDB Atlas:', err.message || err);
      });
    } else {
      console.log('ℹ️ Running in Local JSON fallback mode. Seed records are pre-loaded in /data/local_db.json.');
    }
  }).catch((err) => {
    console.log('ℹ️ Unhandled error during database connection:', err.message || err);
  });

  // API Routes First
  app.use('/api', apiRoutes);

  // Vite development server / production asset serving integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('🚀 Vite middleware mounted in development mode.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('📦 Serving production static bundle from /dist.');
  }

  // Centralized Error Handling Middleware (Must be after routing and Vite)
  app.use(errorHandler);

  app.listen(PORT, HOST, () => {
    console.log(`===================================================`);
    console.log(`💎 DR. DECORS server running on http://${HOST}:${PORT}`);
    console.log(`===================================================`);
  });
}

startServer().catch((err) => {
  console.error('💥 Failed to start Dr. Decors full-stack server:', err);
});
