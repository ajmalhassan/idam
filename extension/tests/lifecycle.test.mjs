import test from 'node:test';
import assert from 'node:assert/strict';
import {
  migrationUpdates,
  setupUpdates,
  localDay,
  normalizePriority,
  priorityForDay,
} from '../src/lifecycle.js';
import { PREFIX, decodeRecords } from '../src/model.js';
const key = (name) => PREFIX + name;
test('explicit setup revisit adds missing choices without replacing existing work', () => {
  const shortcut = { id: 'mail', title: 'My mail', url: 'https://example.com', order: 8 };
  const raw = {
    [key('onboarded')]: true,
    [key('settings')]: { name: 'Before', showNotes: false, search: 'bing' },
    [key('shortcut.mail')]: shortcut,
    [key('notes')]: 'Keep this',
  };
  const updates = setupUpdates(
    raw,
    { name: 'After', accent: 'teal', selected: ['mail', 'github'] },
    { revisit: true },
  );
  assert.equal(updates[key('settings')].name, 'After');
  assert.equal(updates[key('settings')].showNotes, false);
  assert.equal(updates[key('settings')].search, 'bing');
  assert.equal(updates[key('shortcut.mail')], undefined);
  assert.equal(updates[key('notes')], undefined);
  assert.equal(updates[key('shortcut.github')].id, 'github');
  assert.deepEqual({ ...raw, ...updates }[key('shortcut.mail')], shortcut);
});
test('fresh installation starts setup without injecting tasks, notes or shortcuts', () => {
  const updates = migrationUpdates({});
  assert.equal(updates[key('onboarded')], false);
  assert.equal(updates[key('schema')], 2);
  assert.equal(
    Object.keys(updates).some((k) => /shortcut|task|notes/.test(k)),
    false,
  );
});
test('upgrade preserves existing workspace and does not force setup', () => {
  const original = {
    [key('initialized')]: true,
    [key('notes')]: 'keep me',
    [key('settings')]: { accent: 'violet' },
    [key('task.t')]: { id: 't', text: 'Keep this task' },
  };
  const updates = migrationUpdates(original);
  assert.equal(updates[key('onboarded')], true);
  assert.equal({ ...original, ...updates }[key('notes')], 'keep me');
  assert.equal(updates[key('settings')], undefined);
  assert.deepEqual(migrationUpdates({ ...original, ...updates }), {});
});
test('setup accepts zero shortcuts and cannot replace an already completed workspace', () => {
  const fresh = { [key('schema')]: 2, [key('onboarded')]: false };
  const updates = setupUpdates(fresh, { name: ' Ajmal ', accent: 'teal', selected: [] });
  assert.equal(updates[key('onboarded')], true);
  assert.equal(updates[key('settings')].name, 'Ajmal');
  assert.equal(
    Object.keys(updates).some((k) => k.includes('shortcut.')),
    false,
  );
  assert.deepEqual(
    setupUpdates({ ...fresh, ...updates }, { name: 'Other', selected: ['mail'] }),
    {},
  );
});
test('setup preserves an existing shortcut with a seeded id', () => {
  const mail = { id: 'mail', title: 'my mail', url: 'https://example.com' };
  const updates = setupUpdates(
    { [key('shortcut.mail')]: mail },
    { name: '', accent: 'blue', selected: ['mail', 'github', 'unknown'] },
  );
  assert.equal(updates[key('shortcut.mail')], undefined);
  assert.equal(updates[key('shortcut.github')].title, 'github');
  assert.equal(updates[key('shortcut.unknown')], undefined);
});
test('day keys use local calendar components, including local midnight', () => {
  assert.equal(localDay(new Date(2026, 9, 29, 0, 1)), '2026-10-29');
  assert.equal(localDay(new Date(2026, 11, 31, 23, 59)), '2026-12-31');
});
test('priority rollover asks about only the latest unfinished priority', () => {
  const old = { date: '2026-10-28', text: 'Ship', done: false };
  assert.deepEqual(priorityForDay([old], '2026-10-29'), { current: null, carry: old });
  assert.equal(
    priorityForDay([old, { date: '2026-10-29', text: '', done: false }], '2026-10-29').carry,
    null,
  );
  assert.equal(
    priorityForDay([old, { date: '2026-10-29', text: 'Done', done: true }], '2026-10-30').carry,
    null,
  );
  assert.equal(priorityForDay([old], '2026-10-28').current, old);
  assert.equal(priorityForDay([old], '2026-10-27').carry, null);
});
test('invalid priorities and key mismatches cannot affect the current day', () => {
  assert.equal(normalizePriority({ date: '2026-02-30', text: 'bad' }), null);
  assert.equal(normalizePriority({ date: 'yesterday', text: 'bad' }), null);
  assert.equal(normalizePriority(null), null);
  const decoded = decodeRecords({
    [key('priority.2026-10-29')]: { date: '2026-10-28', text: 'mismatch' },
    [key('priority.2026-10-30')]: { date: '2026-10-30', text: 'valid', done: true },
    [key('settings')]: null,
  });
  assert.equal(decoded.priorities.length, 1);
  assert.equal(decoded.priorities[0].text, 'valid');
  assert.equal(decoded.settings.showNotes, true);
});

test('newly selected places carry the chosen accent into home without recoloring existing places', () => {
  const existing = { id: 'github', title: 'my github', tone: 'orange' };
  const updates = setupUpdates(
    { [PREFIX + 'shortcut.github']: existing },
    { name: 'Ajmal', accent: 'teal', selected: ['mail', 'github'] },
  );
  assert.equal(updates[PREFIX + 'shortcut.mail'].tone, 'teal');
  assert.equal(updates[PREFIX + 'shortcut.github'], undefined);
});

test('every setup accent survives record decoding as a shortcut tone', () => {
  for (const accent of ['blue', 'violet', 'magenta', 'teal', 'orange', 'green']) {
    const updates = setupUpdates({}, { name: '', accent, selected: ['mail'] });
    assert.equal(decodeRecords(updates).shortcuts[0].tone, accent);
  }
});
