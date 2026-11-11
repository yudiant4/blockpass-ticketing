/** Base URL for Blockpass API. Prefer same-origin Next routes. */
export function apiBase(): string {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || '';
  }
  return process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || '';
}

export function apiUrl(path: string): string {
  const base = apiBase().replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}
