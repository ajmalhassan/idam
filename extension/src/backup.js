import { ACCENTS, TONES, PREFIX, normalizeSettings, safeUrl } from './model.js';
import { normalizePriority } from './priority.js';
export const MAX_BACKUP_BYTES = 2 * 1024 * 1024;
export const RECOVERY_KEY = 'idam.recovery.v1';
export const REVISION_KEY = 'idam.workspace-revision';
const invalid = () => {
  throw new Error('This backup has invalid or unsupported data. Nothing was restored.');
};
const object = (v) => v && typeof v === 'object' && !Array.isArray(v);
const keys = (v, allowed) => {
  if (
    !object(v) ||
    Object.keys(v).length !== allowed.length ||
    allowed.some((k) => !Object.hasOwn(v, k))
  )
    invalid();
};
const string = (v, max, required = false) =>
  typeof v === 'string' && v.length <= max && (!required || v.trim().length > 0);
const bool = (v) => typeof v === 'boolean';
const id = (v) => typeof v === 'string' && /^[\w-]{1,100}$/.test(v);
function validate(backup) {
  if (backup?.format !== 'idam-backup' || backup?.version !== 1)
    throw new Error('Choose an Idam backup in format version 1.');
  keys(backup, ['format', 'version', 'exportedAt', 'workspace']);
  if (typeof backup.exportedAt !== 'string' || !Number.isFinite(Date.parse(backup.exportedAt)))
    invalid();
  const w = backup.workspace;
  keys(w, ['settings', 'notes', 'shortcuts', 'tasks', 'priorities']);
  keys(w.settings, ['name', 'accent', 'search', 'showTasks', 'showNotes']);
  const s = w.settings;
  if (
    !string(s.name, 40) ||
    !ACCENTS.includes(s.accent) ||
    !['google', 'bing', 'duckduckgo'].includes(s.search) ||
    !bool(s.showTasks) ||
    !bool(s.showNotes) ||
    !string(w.notes, 40000)
  )
    invalid();
  for (const kind of ['shortcuts', 'tasks', 'priorities']) {
    const list = w[kind];
    if (!Array.isArray(list)) invalid();
    const seen = new Set();
    for (const r of list) {
      if (!object(r)) invalid();
      const identity = kind === 'priorities' ? r.date : r.id;
      if (seen.has(identity)) invalid();
      seen.add(identity);
      if (kind === 'shortcuts') {
        keys(r, ['id', 'title', 'url', 'tone', 'size', 'order', 'icon']);
        if (
          !id(r.id) ||
          !string(r.title, 48, true) ||
          !string(r.url, MAX_BACKUP_BYTES, true) ||
          !TONES.includes(r.tone) ||
          !['small', 'wide'].includes(r.size) ||
          !Number.isFinite(r.order) ||
          !string(r.icon, 20)
        )
          invalid();
        try {
          if (!/^https?:\/\//i.test(r.url) || safeUrl(r.url) !== r.url) invalid();
        } catch {
          invalid();
        }
      } else if (kind === 'tasks') {
        keys(r, ['id', 'text', 'done', 'createdAt']);
        if (
          !id(r.id) ||
          !string(r.text, 300, true) ||
          !bool(r.done) ||
          !Number.isFinite(r.createdAt) ||
          r.createdAt < 0
        )
          invalid();
      } else {
        keys(r, ['date', 'text', 'done']);
        if (!normalizePriority(r) || !string(r.text, 200) || !bool(r.done)) invalid();
      }
    }
  }
  return backup;
}
export function parseBackup(text) {
  if (typeof text !== 'string' || new TextEncoder().encode(text).length > MAX_BACKUP_BYTES)
    throw new Error('Choose a backup smaller than 2 MB.');
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('This file is not valid JSON. Nothing was restored.');
  }
  return validate(data);
}
export function createBackup(raw) {
  const records = (kind) =>
    Object.entries(raw)
      .filter(([key, v]) => key.startsWith(PREFIX + kind + '.') && v !== null)
      .map(([key, v]) => {
        if (key !== PREFIX + kind + '.' + (kind === 'priority' ? v?.date : v?.id)) invalid();
        return v;
      });
  const backup = {
    format: 'idam-backup',
    version: 1,
    exportedAt: new Date().toISOString(),
    workspace: {
      settings: raw[PREFIX + 'settings'] ?? normalizeSettings(),
      notes: raw[PREFIX + 'notes'] ?? '',
      shortcuts: records('shortcut'),
      tasks: records('task'),
      priorities: records('priority'),
    },
  };
  return parseBackup(JSON.stringify(backup, null, 2));
}
export function backupRecords(backup) {
  const w = validate(backup).workspace;
  return Object.fromEntries([
    [PREFIX + 'schema', 2],
    [PREFIX + 'initialized', true],
    [PREFIX + 'onboarded', true],
    [PREFIX + 'settings', w.settings],
    [PREFIX + 'notes', w.notes],
    ...w.shortcuts.map((r) => [PREFIX + 'shortcut.' + r.id, r]),
    ...w.tasks.map((r) => [PREFIX + 'task.' + r.id, r]),
    ...w.priorities.map((r) => [PREFIX + 'priority.' + r.date, r]),
  ]);
}
export function workspaceSnapshot(raw) {
  return JSON.stringify(
    Object.entries(raw)
      .filter(([k, v]) => (k.startsWith(PREFIX) || k === REVISION_KEY) && v !== null)
      .sort(([a], [b]) => a.localeCompare(b)),
  );
}
export function backupSummary(backup) {
  const w = backup.workspace;
  const count = (n, singular, plural = singular + 's') => `${n} ${n === 1 ? singular : plural}`;
  return `${count(w.shortcuts.length, 'place')} · ${count(w.tasks.length, 'task')} · ${count(w.priorities.length, 'daily priority', 'daily priorities')} · ${w.notes.length.toLocaleString()} characters of notes`;
}
