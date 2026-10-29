import test from 'node:test';
import assert from 'node:assert/strict';
import { safeUrl, normalizeRecord, ordered, DEFAULT_SHORTCUTS } from '../src/model.js';

test('shortcut destinations normalize HTTPS and preserve explicit HTTP', () => {
  assert.equal(safeUrl('github.com/ajmalhassan'), 'https://github.com/ajmalhassan');
  assert.equal(safeUrl(' http://localhost:3000/path '), 'http://localhost:3000/path');
  assert.equal(safeUrl('https://example.com/a?q=hi there'), 'https://example.com/a?q=hi%20there');
});
test('unsafe schemes, credential-bearing and malformed destinations are rejected', () => {
  for (const value of [
    'javascript:alert(1)',
    'data:text/html,hello',
    'file:///etc/passwd',
    'chrome://settings',
    '//evil.example',
    'https://user:password@example.com',
    '',
    'not a url',
    'https://',
    'java\nscript:alert(1)',
  ]) {
    assert.throws(() => safeUrl(value), { name: 'Error' }, value);
  }
});
test('invalid records cannot inject destinations or break rendering', () => {
  assert.equal(
    normalizeRecord('shortcut', { id: 'x', title: 'x', url: 'javascript:alert(1)' }),
    null,
  );
  assert.equal(normalizeRecord('task', { id: 'x', text: { a: 1 } }), null);
  assert.equal(normalizeRecord('task', null), null);
  const task = normalizeRecord('task', { id: 'x', text: 'Plan the day', done: true, createdAt: 5 });
  assert.deepEqual(task, { id: 'x', text: 'Plan the day', done: true, createdAt: 5 });
});
test('shortcuts have bounded, known visual choices and deterministic ordering', () => {
  const link = normalizeRecord('shortcut', {
    id: 'x',
    title: 'Docs',
    url: 'example.com',
    tone: 'evil',
    size: 'giant',
    order: Infinity,
  });
  assert.equal(link.tone, 'blue');
  assert.equal(link.size, 'small');
  assert.equal(link.order, 0);
  assert.deepEqual(
    ordered([
      { id: 'b', order: 2 },
      { id: 'a', order: 1 },
    ]).map((x) => x.id),
    ['a', 'b'],
  );
  assert.ok(DEFAULT_SHORTCUTS.length >= 4);
  for (const s of DEFAULT_SHORTCUTS) assert.ok(normalizeRecord('shortcut', s));
});
