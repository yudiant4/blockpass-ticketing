import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: parseInt(process.env.PORT || '3002'),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/blockpass-ticketing',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  ADMIN_WALLET: process.env.ADMIN_WALLET || '',
};

// MongoDB connection options with pool limits
export const mongoOptions = {
  maxPoolSize: 5,
  minPoolSize: 1,
  maxIdleTimeMS: 30000,
  waitQueueTimeoutMS: 2000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};