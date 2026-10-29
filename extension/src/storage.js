import { migrationUpdates } from './lifecycle.js';

// A file preview uses localStorage; the installed extension uses storage.local.
const native = Boolean(globalThis.chrome?.storage?.local);
const previewKey = 'metro-start-preview-v1';
const previewRead = () => {
  const raw = JSON.parse(localStorage.getItem(previewKey) || '{}');
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw Error('Invalid workspace data');
  return raw;
};
const listeners = new Set();
export const store = {
  async get() {
    return native ? chrome.storage.local.get(null) : previewRead();
  },
  async set(values) {
    if (native) return chrome.storage.local.set(values);
    const old = previewRead();
    const next = { ...old, ...values };
    localStorage.setItem(previewKey, JSON.stringify(next));
    for (const fn of listeners)
      fn(Object.fromEntries(Object.keys(values).map((k) => [k, { newValue: next[k] }])));
  },
  async remove(key) {
    if (native) return chrome.storage.local.remove(key);
    const next = previewRead();
    delete next[key];
    localStorage.setItem(previewKey, JSON.stringify(next));
    for (const fn of listeners) fn({ [key]: {} });
  },
  subscribe(fn) {
    if (native) {
      const listener = (changes, area) => {
        if (area === 'local') fn(changes);
      };
      chrome.storage.onChanged.addListener(listener);
      return () => chrome.storage.onChanged.removeListener(listener);
    }
    listeners.add(fn);
    const listener = (e) => {
      if (e.key === previewKey) fn(null);
    };
    window.addEventListener('storage', listener);
    return () => {
      listeners.delete(fn);
      window.removeEventListener('storage', listener);
    };
  },
};
export async function initialize() {
  const raw = await store.get();
  const updates = migrationUpdates(raw);
  if (Object.keys(updates).length) await store.set(updates);
  return { ...raw, ...updates };
}
