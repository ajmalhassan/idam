import test from 'node:test';
import assert from 'node:assert/strict';
import { decodeRecords, PREFIX } from '../src/model.js';
import * as actions from '../src/shortcut-actions.js';

function workspace() {
  let raw = { unrelated: 'keep', [PREFIX + 'notes']: 'keep notes' };
  for (const [order, id] of ['a', 'b', 'c', 'd'].entries())
    raw[PREFIX + 'shortcut.' + id] = {
      id,
      title: id,
      url: `https://${id}.example/`,
      size: id === 'b' ? 'wide' : 'small',
      tone: 'teal',
      icon: '',
      order,
    };
  return {
    get: async () => structuredClone(raw),
    set: async (updates) => {
      raw = { ...raw, ...updates };
    },
    ids: () => decodeRecords(raw).shortcuts.map((s) => s.id),
  };
}

test('moves tiles before and after targets in the full order, preserving sizes and other data', async () => {
  const store = workspace();
  const before = await store.get();
  assert.deepEqual(await actions.reorderShortcut(store, 'a', { targetId: 'c', side: 'after' }), [
    'b',
    'c',
    'a',
    'd',
  ]);
  assert.deepEqual(store.ids(), ['b', 'c', 'a', 'd']);
  await actions.reorderShortcut(store, 'd', { targetId: 'b', side: 'before' });
  assert.deepEqual(store.ids(), ['d', 'b', 'c', 'a']);
  const after = await store.get();
  for (const [key, value] of Object.entries(before)) {
    if (key.includes('shortcut.')) assert.deepEqual({ ...after[key], order: value.order }, value);
    else assert.deepEqual(after[key], value);
  }
  assert.deepEqual(
    decodeRecords(after).shortcuts.map((s) => s.order),
    [0, 1, 2, 3],
  );
});

test('arrow moves use latest order and fields; boundaries and same-position drops do not write', async () => {
  const store = workspace();
  const key = PREFIX + 'shortcut.b';
  await store.set({ [key]: { ...(await store.get())[key], title: 'New title', tone: 'orange' } });
  await actions.reorderShortcut(store, 'b', { delta: 1 });
  assert.deepEqual(store.ids(), ['a', 'c', 'b', 'd']);
  assert.equal((await store.get())[key].title, 'New title');
  assert.equal((await store.get())[key].tone, 'orange');
  store.set = async () => {
    throw Error('Unexpected write');
  };
  await actions.reorderShortcut(store, 'a', { delta: -1 });
  await actions.reorderShortcut(store, 'd', { delta: 1 });
  await actions.reorderShortcut(store, 'a', { targetId: 'a', side: 'after' });
  await actions.reorderShortcut(store, 'c', { targetId: 'b', side: 'before' });
});

test('missing source or target cannot recreate deleted tiles; invalid commands cannot mutate storage', async () => {
  const store = workspace();
  await store.set({ [PREFIX + 'shortcut.b']: null });
  const before = await store.get();
  for (const [id, destination] of [
    ['b', { targetId: 'a', side: 'before' }],
    ['a', { targetId: 'b', side: 'after' }],
    ['a', { delta: 0 }],
    ['a', { targetId: 'd', side: 'invalid' }],
  ])
    await assert.rejects(actions.reorderShortcut(store, id, destination));
  assert.deepEqual(await store.get(), before);
});

test('failed reorder leaves saved order intact and can be retried against fresh data', async () => {
  const store = workspace(),
    save = store.set;
  store.set = async () => {
    throw Error('Quota');
  };
  await assert.rejects(
    actions.reorderShortcut(store, 'a', { targetId: 'd', side: 'after' }),
    /Quota/,
  );
  assert.deepEqual(store.ids(), ['a', 'b', 'c', 'd']);
  store.set = save;
  await actions.reorderShortcut(store, 'a', { targetId: 'd', side: 'after' });
  assert.deepEqual(store.ids(), ['b', 'c', 'd', 'a']);
});
