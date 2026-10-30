import test from 'node:test';
import assert from 'node:assert/strict';
import { createBackup, parseBackup, backupRecords, MAX_BACKUP_BYTES } from '../src/backup.js';
const raw = {
  'metro.v1.settings': {
    name: 'Ajmal',
    accent: 'violet',
    search: 'google',
    showTasks: true,
    showNotes: false,
  },
  'metro.v1.notes': 'A note\nwith another line',
  'metro.v1.shortcut.a': {
    id: 'a',
    title: 'Mail',
    url: 'https://mail.google.com/',
    tone: 'blue',
    size: 'wide',
    order: 0,
    icon: '',
  },
  'metro.v1.task.b': { id: 'b', text: 'Ship it', done: true, createdAt: 123 },
  'metro.v1.priority.2026-10-30': { date: '2026-10-30', text: 'Launch', done: false },
};
test('backup round trip retains all workspace data without unrelated or recovery keys', () => {
  const backup = createBackup({
    ...raw,
    secret: 'exclude',
    'idam.recovery.v1': { secret: 'exclude' },
  });
  assert.equal(backup.format, 'idam-backup');
  assert.equal(backup.version, 1);
  const restored = backupRecords(parseBackup(JSON.stringify(backup)));
  for (const [k, v] of Object.entries(raw)) assert.deepEqual(restored[k], v);
  assert.equal(restored['metro.v1.onboarded'], true);
  assert.ok(!JSON.stringify(backup).includes('exclude'));
});
test('rejects malformed, unsupported and oversized files', () => {
  for (const value of [
    'not json',
    'null',
    '[]',
    JSON.stringify({ format: 'other', version: 1 }),
    JSON.stringify({ ...createBackup(raw), version: 99 }),
    ' '.repeat(MAX_BACKUP_BYTES + 1),
  ])
    assert.throws(() => parseBackup(value));
});
test('rejects unsafe URLs, duplicate IDs, invalid dates, wrong types and unknown fields without partial import', () => {
  for (const mutate of [
    (b) => (b.workspace.shortcuts[0].url = 'javascript:alert(1)'),
    (b) => (b.workspace.shortcuts[0].url = 'https://user:secret@example.com/'),
    (b) => b.workspace.shortcuts.push(b.workspace.shortcuts[0]),
    (b) => (b.workspace.tasks[0].done = 'false'),
    (b) => (b.workspace.tasks[0].text = ' '),
    (b) => (b.workspace.tasks[0].text = 'x'.repeat(301)),
    (b) => (b.workspace.priorities[0].date = '2026-02-30'),
    (b) => (b.workspace.settings.showNotes = 1),
    (b) => (b.workspace.settings.accent = 'unknown'),
    (b) => (b.workspace.notes = 'x'.repeat(40001)),
    (b) => (b.workspace.extra = 'not supported'),
  ]) {
    const backup = createBackup(raw);
    mutate(backup);
    assert.throws(() => parseBackup(JSON.stringify(backup)));
  }
});

test('existing valid workspaces are limited by total size, not new URL or record-count caps', () => {
  const data = structuredClone(raw);
  data['metro.v1.shortcut.a'].url = 'https://example.com/?q=' + 'a'.repeat(8200);
  for (let i = 0; i < 2001; i++)
    data[`metro.v1.task.extra${i}`] = { id: `extra${i}`, text: 'Task', done: false, createdAt: i };
  const backup = createBackup(data);
  assert.equal(backup.workspace.tasks.length, 2002);
  assert.equal(backup.workspace.shortcuts[0].url, data['metro.v1.shortcut.a'].url);
});
