import { migrationUpdates } from '../src/lifecycle.js';
let raw = {};
const listeners = new Set();
export const store = {
  async get() {
    return structuredClone(raw);
  },
  async set(values) {
    raw = { ...raw, ...structuredClone(values) };
    for (const fn of listeners) fn();
  },
  async remove(key) {
    delete raw[key];
    for (const fn of listeners) fn();
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  reset() {
    raw = {};
  },
};
export async function initialize() {
  const updates = migrationUpdates(raw);
  if (Object.keys(updates).length) await store.set(updates);
  return store.get();
}
