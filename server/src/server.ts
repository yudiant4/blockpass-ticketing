import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './config.js';
import eventsRouter from './routes/events.js';

const app = express();

// Middleware
app.use(cors({ origin: config.FRONTEND_URL, credentials: true }));
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'success', message: 'OK', data: { time: new Date() } });
});

// Routes
app.use('/api/events', eventsRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ status: 'error', message: 'Endpoint tidak ditemukan' });
});

// Error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  res.status(500).json({ status: 'error', message: 'Internal server error', error: err.message });
});

// Reset database (dev only)
export async function resetDatabase() {
  if (process.env.NODE_ENV === 'production') return;
  await mongoose.connection.dropDatabase();
  console.log('[DB] Database reset complete');
}

// Connect & start
async function bootstrap() {
  try {
    await mongoose.connect(config.MONGODB_URI, { dbName: 'blockpass-ticketing' });
    console.log('[DB] MongoDB connected:', config.MONGODB_URI);

    // Clean slate on dev start
    if (process.env.NODE_ENV !== 'production') {
      await resetDatabase();
      console.log('[DB] Clean slate (no mock data)');
    }

    app.listen(config.PORT, () => {
      console.log(`[Server] Running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  }
}

bootstrap();