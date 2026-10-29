import test from 'node:test';
import assert from 'node:assert/strict';
import * as actions from '../src/task-actions.js';

function memoryStore(initial) {
  let records = structuredClone(initial);
  return {
    get: async () => structuredClone(records),
    set: async (values) => {
      records = { ...records, ...values };
    },
  };
}

test('editing changes only text and preserves the latest completion and creation time', async () => {
  const store = memoryStore({
    'metro.v1.task.one': { id: 'one', text: 'Old', done: true, createdAt: 123 },
    other: 'untouched',
  });
  await actions.editTask(store, 'one', '  Revised task  ');
  assert.deepEqual(await store.get(), {
    'metro.v1.task.one': { id: 'one', text: 'Revised task', done: true, createdAt: 123 },
    other: 'untouched',
  });
});

test('editing cannot recreate a deleted task or save blank/oversized text', async () => {
  const store = memoryStore({});
  await assert.rejects(actions.editTask(store, 'gone', 'New text'));
  for (const text of ['', '  ', 'a'.repeat(301)])
    await assert.rejects(actions.editTask(store, 'one', text));
  assert.deepEqual(await store.get(), {});
});

test('failed edit propagates failure and a retry can save the same draft', async () => {
  const store = memoryStore({
    'metro.v1.task.one': { id: 'one', text: 'Original', done: false, createdAt: 123 },
  });
  const save = store.set;
  store.set = async () => {
    throw new Error('Quota');
  };
  await assert.rejects(actions.editTask(store, 'one', 'Revised'), /Quota/);
  assert.equal((await store.get())['metro.v1.task.one'].text, 'Original');
  store.set = save;
  await actions.editTask(store, 'one', 'Revised');
  assert.equal((await store.get())['metro.v1.task.one'].text, 'Revised');
});
