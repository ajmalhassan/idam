import { useEffect, useState } from 'react';
import { resolveFavicon } from './favicon.js';

export function SiteIcon({ url, title }) {
  const [resolved, setResolved] = useState(null);
  useEffect(() => {
    let active = true;
    const cache = globalThis.chrome?.runtime?.id ? chrome.runtime.getURL('/_favicon/') : undefined;
    resolveFavicon(url, cache).then((source) => {
      if (active) setResolved({ url, source });
    });
    return () => {
      active = false;
    };
  }, [url]);
  const source = resolved?.url === url ? resolved.source : null;
  return source ? (
    <img
      className="site-icon"
      src={source}
      alt=""
      width="32"
      height="32"
      referrerPolicy="no-referrer"
      draggable={false}
      onError={() => setResolved(null)}
    />
  ) : (
    <span className="site-initial" aria-hidden="true">
      {title.slice(0, 2).toUpperCase()}
    </span>
  );
}
