// metr-backend/src/server.ts
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import projectRoutes from './routes/project.routes';
import libraryRoutes from './routes/library.routes';
import notificationRoutes from './routes/notification.routes';

dotenv.config();

const app: Express = express();

// ⚠️ IMPORTANT : On force 5000 car ton frontend appelle ce port
const PORT = Number(process.env.PORT || 5000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// CORS FULLY FIXED FOR DEV
// Autorise 3000, 3005, 5173 (Vite), etc.
// ============================================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3005",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

// ======================
// ROUTES BACKEND
// ======================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/notifications', notificationRoutes);

// ======================
// HEALTH CHECK
// ======================
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ======================
// START SERVER
// ======================
const startServer = async () => {
  try {
    const ok = await testConnection();
    if (!ok) throw new Error('Database connection failed');

    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📍 API disponible sur: http://localhost:${PORT}/api`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer();
