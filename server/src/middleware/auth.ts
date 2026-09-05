import { NextFunction, Request, Response } from 'express';
import { config } from '../config.js';

// Wallet address header sent by admin
const ADMIN_HEADER = 'x-admin-wallet';

// Simple admin validation via wallet identifier in header
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const wallet = req.headers[ADMIN_HEADER] as string | undefined;

  if (!wallet) {
    return res.status(403).json({
      status: 'error',
      message: 'Forbidden: admin wallet required',
    });
  }

  // Normalize wallet address (lowercase, trim)
  const normalized = wallet.trim().toLowerCase();

  // If an admin wallet is configured, require match
  if (config.ADMIN_WALLET && normalized !== config.ADMIN_WALLET.toLowerCase()) {
    return res.status(403).json({
      status: 'error',
      message: 'Forbidden: wallet not authorized as admin',
    });
  }

  // Attach wallet to request for later use
  (req as any).adminWallet = wallet;
  next();
}