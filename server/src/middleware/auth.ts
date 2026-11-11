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

  if (!/^0x[a-f0-9]{40}$/.test(normalized)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid wallet address',
    });
  }

  // Require configured ADMIN_WALLET in production-like setups
  if (!config.ADMIN_WALLET) {
    if (process.env.NODE_ENV === 'production') {
      return res.status(503).json({
        status: 'error',
        message: 'ADMIN_WALLET not configured',
      });
    }
    // Dev fallback: accept any valid wallet but log loudly
    console.warn('[auth] ADMIN_WALLET unset — accepting any wallet (dev only)');
  } else if (normalized !== config.ADMIN_WALLET.toLowerCase()) {
    return res.status(403).json({
      status: 'error',
      message: 'Forbidden: wallet not authorized as admin',
    });
  }

  // Attach wallet to request for later use
  (req as any).adminWallet = wallet;
  next();
}