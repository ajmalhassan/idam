import { useState } from 'react';
import { faviconSources } from './favicon.js';

export function SiteIcon({ url, title }) {
  const [attempt, setAttempt] = useState(0);
  const cache = globalThis.chrome?.runtime?.id ? chrome.runtime.getURL('/_favicon/') : undefined;
  const sources = faviconSources(url, cache);
  return sources[attempt] ? (
    <img
      className="site-icon"
      src={sources[attempt]}
      alt=""
      width="32"
      height="32"
      referrerPolicy="no-referrer"
      draggable={false}
      onError={() => setAttempt((index) => index + 1)}
    />
  ) : (
    <span className="site-initial" aria-hidden="true">
      {title.slice(0, 2).toUpperCase()}
    </span>
  );
}
