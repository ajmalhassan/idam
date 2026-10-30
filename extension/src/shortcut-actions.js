import { decodeRecords, PREFIX } from './model.js';

// Resolve intent against fresh records, never a captured render of the grid.
export async function reorderShortcut(store, sourceId, destination) {
  const raw = await store.get();
  const list = decodeRecords(raw).shortcuts;
  const from = list.findIndex((s) => s.id === sourceId);
  if (from < 0) throw new Error('This tile no longer exists.');
  const original = list.map((s) => s.id);
  if ('delta' in destination) {
    if (![1, -1].includes(destination.delta)) throw new Error('Invalid move.');
    const to = from + destination.delta;
    if (to < 0 || to >= list.length) return original;
    [list[from], list[to]] = [list[to], list[from]];
  } else {
    if (!['before', 'after'].includes(destination.side)) throw new Error('Invalid drop.');
    if (!list.some((s) => s.id === destination.targetId))
      throw new Error('The destination tile no longer exists.');
    if (sourceId === destination.targetId) return original;
    const [source] = list.splice(from, 1);
    const target = list.findIndex((s) => s.id === destination.targetId);
    list.splice(target + (destination.side === 'after' ? 1 : 0), 0, source);
  }
  if (list.every((s, index) => s.id === original[index])) return original;
  await store.set(
    Object.fromEntries(
      list.map((s, order) => {
        const key = PREFIX + 'shortcut.' + s.id;
        return [key, { ...raw[key], order }];
      }),
    ),
  );
  return list.map((s) => s.id);
}
