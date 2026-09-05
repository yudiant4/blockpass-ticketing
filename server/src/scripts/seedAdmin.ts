import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { config } from '../config.js';

dotenv.config();

async function seedAdmin() {
  try {
    await mongoose.connect(config.MONGODB_URI, { dbName: 'blockpass-ticketing' });

    // Clean slate
    await mongoose.connection.dropDatabase();
    console.log('[Seed] Database cleared');

    // Print admin wallet to use in header
    if (!config.ADMIN_WALLET) {
      console.log('[Seed] No ADMIN_WALLET set. Set it in .env to authorize admin operations.');
      console.log('[Seed] Example request header: x-admin-wallet: 0xYOUR_WALLET');
    } else {
      console.log('[Seed] Authorized admin wallet:', config.ADMIN_WALLET);
    }

    console.log('[Seed] Done. Database is clean.');
  } catch (error) {
    console.error('[Seed] Failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();