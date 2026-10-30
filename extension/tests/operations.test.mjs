import test from 'node:test';
import assert from 'node:assert/strict';
import { createOperations } from '../src/operations.js';

test('repeated load failures keep a retry available', async () => {
  let error,
    attempts = 0;
  const ops = createOperations((value) => (error = value));
  const load = async () => {
    if (++attempts < 3) throw Error('Unavailable');
  };
  await ops.run(load, 'load', 'Could not load');
  await ops.retry();
  assert.equal(error, 'Could not load');
  await ops.retry();
  assert.equal(error, null);
  assert.equal(attempts, 3);
});
test('unrelated success retains failed notes; newer notes supersede old retry', async () => {
  let error,
    writes = [];
  const ops = createOperations((value) => (error = value));
  await ops.run(async () => {
    throw Error('Quota');
  }, 'notes');
  await ops.run(async () => writes.push('task'), 'task.1');
  assert.ok(error);
  await ops.run(async () => writes.push('new note'), 'notes');
  assert.equal(error, null);
  await ops.retry();
  assert.deepEqual(writes, ['task', 'new note']);
});
test('a late failure cannot replace a newer successful save', async () => {
  let error, reject;
  const ops = createOperations((value) => (error = value));
  const pending = ops.run(() => new Promise((_, r) => (reject = r)), 'notes');
  await ops.run(async () => {}, 'notes');
  reject(Error('Late failure'));
  await pending;
  assert.equal(error, null);
});

test('discarded workspace operations cannot retry or start stale writes', async () => {
  const ops = createOperations(() => {});
  let writes = 0;
  await ops.run(async () => {
    throw Error('Failed old write');
  }, 'notes');
  assert.equal(typeof ops.cancel, 'function');
  ops.cancel();
  await ops.retry();
  assert.equal(
    await ops.run(async () => {
      writes++;
    }),
    false,
  );
  assert.equal(writes, 0);
});
