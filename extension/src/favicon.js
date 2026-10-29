import { safeUrl } from './model.js';

// Only send DNS hostnames to public services. IP literals and local/reserved
// names stay between the user's browser and the site they explicitly saved.
function publicHostname(hostname) {
  const host = hostname.toLowerCase().replace(/\.$/, '');
  return (
    host.includes('.') &&
    !host.includes(':') &&
    !/^\d+(\.\d+){3}$/.test(host) &&
    !/(^|\.)(localhost|local|lan|internal|intranet|home|arpa|test|invalid|example|onion)$/.test(
      host,
    )
  );
}

export function faviconSources(value, cacheUrl) {
  try {
    const page = new URL(safeUrl(value));
    const sources = [`${page.origin}/favicon.ico`];
    if (publicHostname(page.hostname)) {
      const hostname = encodeURIComponent(page.hostname.replace(/\.$/, ''));
      sources.push(
        `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(`${page.origin}/`)}&sz=64`,
        `https://a.favicon.im/${hostname}?larger=true&throw-error-on-404=true`,
      );
    }
    if (cacheUrl) {
      const cached = new URL(cacheUrl);
      cached.searchParams.set('pageUrl', `${page.origin}/`);
      cached.searchParams.set('size', '32');
      // Chromium can return a successful generic icon on a miss. Keep this
      // last so it cannot mask a discoverable website icon.
      sources.push(cached.href);
    }
    return sources;
  } catch {
    return [];
  }
}

function loadImage(source, signal) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const finish = (error) => {
      image.onload = image.onerror = null;
      signal.removeEventListener('abort', abort);
      if (error) {
        image.removeAttribute('src');
        reject(error);
      } else resolve();
    };
    const abort = () => finish(new Error('Favicon lookup timed out'));
    image.referrerPolicy = 'no-referrer';
    image.onload = () => finish(image.naturalWidth ? null : new Error('Empty icon'));
    image.onerror = () => finish(new Error('Icon unavailable'));
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) abort();
    else image.src = source;
  });
}

export function createFaviconResolver({ load = loadImage, now = Date.now, timeout = 3000 } = {}) {
  const cache = new Map();
  return function resolve(value, cacheUrl) {
    const sources = faviconSources(value, cacheUrl);
    if (!sources.length) return Promise.resolve(null);
    const key = sources.join('\n');
    const previous = cache.get(key);
    if (previous && previous.expires > now()) return previous.promise;
    const entry = { expires: Infinity };
    entry.promise = (async () => {
      for (const source of sources) {
        const controller = new AbortController();
        let timer;
        try {
          await Promise.race([
            Promise.resolve().then(() => load(source, controller.signal)),
            new Promise((_, reject) => {
              timer = setTimeout(() => {
                reject(new Error('Favicon lookup timed out'));
                controller.abort();
              }, timeout);
            }),
          ]);
          entry.expires = now() + 60 * 60 * 1000;
          return source;
        } catch {
          // A failed, corrupt or slow source must not block the next provider.
        } finally {
          clearTimeout(timer);
        }
      }
      entry.expires = now() + 60 * 1000;
      return null;
    })();
    // Bound memory in long-lived tabs with many edited shortcuts.
    if (cache.size >= 128) cache.delete(cache.keys().next().value);
    cache.set(key, entry);
    return entry.promise;
  };
}

export const resolveFavicon = createFaviconResolver();
