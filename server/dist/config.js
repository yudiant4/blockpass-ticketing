import dotenv from 'dotenv';
dotenv.config();
export const config = {
    PORT: parseInt(process.env.PORT || '3001'),
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/blockpass-ticketing',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    ADMIN_WALLET: process.env.ADMIN_WALLET || '',
};
