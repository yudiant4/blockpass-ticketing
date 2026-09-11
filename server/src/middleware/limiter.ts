const limiters = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 100;   // requests
const WINDOW_MS = 60_000; // 1 minute per IP

export function rateLimiter(_req: any, res: any, next: any) {
  const ip = _req.headers['x-forwarded-for'] || _req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = limiters.get(ip as string);

  if (record && record.reset < now) {
    record.count = 0;
    record.reset = now + WINDOW_MS;
  }

  if (!record) {
    limiters.set(ip as string, { count: 1, reset: now + WINDOW_MS });
    return next();
  }

  record.count += 1;

  if (record.count > RATE_LIMIT) {
    res.setHeader('Retry-After', String(Math.ceil((record.reset - now) / 1000)));
    return res.status(429).json({ status: 'error', message: 'Rate limit exceeded' });
  }

  next();
}