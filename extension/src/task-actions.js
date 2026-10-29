import { PREFIX, normalizeRecord } from './model.js';

export async function editTask(store, id, value) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text || text.length > 300) throw new Error('Enter a task of 1–300 characters.');
  const key = `${PREFIX}task.${id}`;
  // Read at save time: a completion change in another tab should survive editing.
  const raw = await store.get();
  const current = normalizeRecord('task', raw[key]);
  if (!current || current.id !== id) throw new Error('This task no longer exists.');
  await store.set({ [key]: { ...current, text } });
}
