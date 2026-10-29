import { safeUrl } from './model.js';

export function faviconSources(value, cacheUrl) {
  try {
    const origin = new URL(safeUrl(value)).origin;
    const fallback = `${origin}/favicon.ico`;
    if (!cacheUrl) return [fallback];
    const cached = new URL(cacheUrl);
    cached.searchParams.set('pageUrl', `${origin}/`);
    cached.searchParams.set('size', '32');
    // Cache misses may return a successful generic image, so try the site first.
    return [fallback, cached.href];
  } catch {
    return [];
  }
}
