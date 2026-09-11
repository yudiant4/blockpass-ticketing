import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config, mongoOptions } from './config.js';
import eventsRouter from './routes/events.js';

const app = express();

// Middleware
app.use(cors({ origin: config.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '1mb' })); // protect from huge payloads

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'success', message: 'OK', uptime: process.uptime() });
});

// Routes
app.use('/api/events', eventsRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ status: 'error', message: 'Endpoint tidak ditemukan' });
});

// Global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  res.status(500).json({ status: 'error', message: 'Internal server error', error: err.message });
});

// Graceful shutdown
const connection = mongoose.connection;

function gracefulShutdown(signal: string) {
  console.log(`\n[Shutdown] ${signal} received`);
  connection.close(false)
    .then(() => {
      console.log('[Shutdown] MongoDB connection closed');
      process.exit(0);
    })
    .catch(() => process.exit(1));
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Bootstrap
async function bootstrap() {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      dbName: 'blockpass-ticketing',
      ...mongoOptions,
    });
    console.log('[DB] MongoDB connected');

    app.listen(config.PORT, () => {
      console.log(`[Server] http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.error('[Bootstrap error]', error);
    process.exit(1);
  }
}

bootstrap();