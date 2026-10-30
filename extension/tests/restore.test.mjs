import test from 'node:test';
import assert from 'node:assert/strict';
import { createGuardedStore } from '../src/guarded-store.js';
import { createBackup, workspaceSnapshot, RECOVERY_KEY } from '../src/backup.js';
const initial = {
  'metro.v1.notes': 'before',
  'metro.v1.task.old': { id: 'old', text: 'Keep safe', done: false, createdAt: 1 },
  unrelated: 'keep',
};
function fixture() {
  let raw = structuredClone(initial),
    calls = 0,
    failAt = 0,
    chain = Promise.resolve();
  const backend = {
    get: async () => structuredClone(raw),
    set: async (values) => {
      if (++calls === failAt) throw Error('Quota');
      raw = { ...raw, ...structuredClone(values) };
    },
    remove: async (key) => {
      delete raw[key];
    },
    subscribe: () => () => {},
  };
  const lock = (fn) => {
    const pending = chain.then(fn);
    chain = pending.catch(() => {});
    return pending;
  };
  return {
    backend,
    store: createGuardedStore(backend, { lock }),
    lock,
    fail: (n) => {
      failAt = n;
    },
  };
}
test('restore replaces workspace, preserves unrelated keys, and saves a recoverable before-copy', async () => {
  const { store } = fixture();
  const before = await store.get();
  assert.equal(typeof store.restore, 'function');
  await store.restore(createBackup({ 'metro.v1.notes': 'after' }), workspaceSnapshot(before));
  const result = await store.get();
  assert.equal(result['metro.v1.notes'], 'after');
  assert.equal(result['metro.v1.task.old'], null);
  assert.equal(result.unrelated, 'keep');
  assert.equal(result[RECOVERY_KEY].workspace.notes, 'before');
  assert.equal(result[RECOVERY_KEY].workspace.tasks[0].text, 'Keep safe');
});
test('changed preview and stale tabs cannot overwrite new workspace', async () => {
  const { store, backend, lock } = fixture();
  const other = createGuardedStore(backend, { lock });
  const preview = workspaceSnapshot(await store.get());
  await other.get();
  await other.set({ 'metro.v1.notes': 'newer' });
  assert.equal(typeof store.restore, 'function');
  await assert.rejects(store.restore(createBackup({}), preview), /changed/);
  await store.restore(
    createBackup({ 'metro.v1.notes': 'restored' }),
    workspaceSnapshot(await store.get()),
  );
  await assert.rejects(other.set({ 'metro.v1.notes': 'stale draft' }), /another tab|reload/i);
  await assert.rejects(other.remove('metro.v1.notes'), /another tab|reload/i);
  assert.equal((await store.get())['metro.v1.notes'], 'restored');
});
test('failed recovery or replacement writes leave original workspace intact', async () => {
  for (const step of [1, 2]) {
    const { store, fail } = fixture();
    const before = await store.get();
    fail(step);
    assert.equal(typeof store.restore, 'function');
    await assert.rejects(
      store.restore(createBackup({ 'metro.v1.notes': 'after' }), workspaceSnapshot(before)),
      /Quota/,
    );
    const current = await store.get();
    assert.equal(current['metro.v1.notes'], 'before');
    assert.deepEqual(current['metro.v1.task.old'], initial['metro.v1.task.old']);
    if (step === 2) assert.equal(current[RECOVERY_KEY].workspace.notes, 'before');
  }
});

test('a queued old write is rejected without disabling the freshly restored tab', async () => {
  const { store } = fixture();
  const before = await store.get();
  const restoring = store.restore(
    createBackup({ 'metro.v1.notes': 'restored' }),
    workspaceSnapshot(before),
  );
  const oldWrite = store.set({ 'metro.v1.notes': 'old queued edit' });
  await restoring;
  await assert.rejects(oldWrite);
  assert.equal(store.stale, false);
  await store.set({ 'metro.v1.notes': 'new intentional edit' });
  assert.equal((await store.get())['metro.v1.notes'], 'new intentional edit');
});
