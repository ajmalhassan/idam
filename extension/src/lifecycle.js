import { PREFIX, DEFAULT_SHORTCUTS, normalizeSettings } from './model.js';
export function migrationUpdates(raw) {
  if (raw[PREFIX + 'schema'] >= 2) return {};
  const existing =
    Boolean(raw[PREFIX + 'initialized']) ||
    Object.keys(raw).some(
      (k) =>
        k.startsWith(PREFIX + 'task.') ||
        k.startsWith(PREFIX + 'shortcut.') ||
        k === PREFIX + 'notes' ||
        k === PREFIX + 'settings',
    );
  return {
    [PREFIX + 'schema']: 2,
    [PREFIX + 'initialized']: true,
    [PREFIX + 'onboarded']: existing,
  };
}
export function setupUpdates(raw, draft, { revisit = false } = {}) {
  if (raw[PREFIX + 'onboarded'] === true && !revisit) return {};
  const settings = normalizeSettings({
    ...raw[PREFIX + 'settings'],
    name: draft.name,
    accent: draft.accent,
  });
  const values = { [PREFIX + 'onboarded']: true, [PREFIX + 'settings']: settings };
  for (const shortcut of DEFAULT_SHORTCUTS) {
    const key = PREFIX + 'shortcut.' + shortcut.id;
    if (draft.selected?.includes(shortcut.id) && !raw[key])
      values[key] = { ...shortcut, tone: settings.accent, size: 'small' };
  }
  return values;
}
export { localDay, normalizePriority, priorityForDay } from './priority.js';
