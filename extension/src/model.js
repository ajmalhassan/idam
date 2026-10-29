import { normalizePriority } from './priority.js';
export const TONES = ['blue', 'teal', 'violet', 'orange', 'gray'];
export function safeUrl(value) {
  if (typeof value !== 'string') throw new Error('Enter a website address.');
  const raw = value.trim();
  if (!raw || /[\u0000-\u001f\u007f]/.test(raw) || raw.startsWith('//'))
    throw new Error('Enter a valid HTTP or HTTPS address.');
  const scheme = /^[a-z][a-z\d+.-]*:/i.test(raw);
  let url;
  try {
    url = new URL(scheme ? raw : `https://${raw}`);
  } catch {
    throw new Error('Enter a valid website address.');
  }
  if (!['https:', 'http:'].includes(url.protocol) || !url.hostname || url.username || url.password)
    throw new Error('Use an HTTP or HTTPS address without a username or password.');
  return url.href;
}
export function normalizeRecord(kind, value) {
  if (
    !value ||
    typeof value !== 'object' ||
    typeof value.id !== 'string' ||
    !/^[\w-]{1,100}$/.test(value.id)
  )
    return null;
  if (kind === 'task') {
    if (typeof value.text !== 'string' || !value.text.trim()) return null;
    return {
      id: value.id,
      text: value.text.slice(0, 300),
      done: value.done === true,
      createdAt: Number.isFinite(value.createdAt) ? value.createdAt : 0,
    };
  }
  if (kind === 'shortcut') {
    if (typeof value.title !== 'string' || !value.title.trim()) return null;
    try {
      return {
        id: value.id,
        title: value.title.trim().slice(0, 48),
        url: safeUrl(value.url),
        tone: TONES.includes(value.tone) ? value.tone : 'blue',
        size: value.size === 'wide' ? 'wide' : 'small',
        order: Number.isFinite(value.order) ? value.order : 0,
        icon: typeof value.icon === 'string' ? value.icon.slice(0, 20) : '',
      };
    } catch {
      return null;
    }
  }
  return null;
}
export function ordered(records) {
  return [...records].sort(
    (a, b) =>
      (a.order ?? a.createdAt ?? 0) - (b.order ?? b.createdAt ?? 0) || a.id.localeCompare(b.id),
  );
}
export const DEFAULT_SHORTCUTS = [
  {
    id: 'mail',
    title: 'mail',
    url: 'https://mail.google.com/',
    tone: 'blue',
    size: 'wide',
    icon: 'mail',
    order: 0,
  },
  {
    id: 'github',
    title: 'github',
    url: 'https://github.com/',
    tone: 'gray',
    size: 'small',
    icon: 'code',
    order: 1,
  },
  {
    id: 'calendar',
    title: 'calendar',
    url: 'https://calendar.google.com/',
    tone: 'teal',
    size: 'small',
    icon: 'calendar',
    order: 2,
  },
  {
    id: 'drive',
    title: 'drive',
    url: 'https://drive.google.com/',
    tone: 'teal',
    size: 'small',
    icon: 'folder',
    order: 3,
  },
  {
    id: 'figma',
    title: 'figma',
    url: 'https://www.figma.com/',
    tone: 'violet',
    size: 'small',
    icon: 'design',
    order: 4,
  },
  {
    id: 'music',
    title: 'music',
    url: 'https://open.spotify.com/',
    tone: 'violet',
    size: 'wide',
    icon: 'music',
    order: 5,
  },
];
export const PREFIX = 'metro.v1.';
export const ACCENTS = ['blue', 'violet', 'magenta', 'teal', 'orange', 'green'];
export function normalizeSettings(value) {
  const settings = value && typeof value === 'object' ? value : {};
  return {
    name: typeof settings.name === 'string' ? settings.name.trim().slice(0, 40) : '',
    accent: ACCENTS.includes(settings.accent) ? settings.accent : 'blue',
    search: ['duckduckgo', 'google', 'bing'].includes(settings.search)
      ? settings.search
      : 'duckduckgo',
    showTasks: settings.showTasks !== false,
    showNotes: settings.showNotes !== false,
  };
}
export function decodeRecords(raw) {
  raw = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const shortcuts = [],
    tasks = [],
    priorities = [];
  for (const [key, value] of Object.entries(raw)) {
    for (const kind of ['shortcut', 'task'])
      if (key.startsWith(PREFIX + kind + '.')) {
        const record = normalizeRecord(kind, value);
        if (record && key === PREFIX + kind + '.' + record.id)
          (kind === 'shortcut' ? shortcuts : tasks).push(record);
      }
    if (key.startsWith(PREFIX + 'priority.')) {
      const record = normalizePriority(value);
      if (record && key === PREFIX + 'priority.' + record.date) priorities.push(record);
    }
  }
  return {
    shortcuts: ordered(shortcuts),
    tasks: ordered(tasks),
    priorities,
    onboarded: raw[PREFIX + 'onboarded'] === true,
    notes: typeof raw[PREFIX + 'notes'] === 'string' ? raw[PREFIX + 'notes'].slice(0, 40000) : '',
    settings: normalizeSettings(raw[PREFIX + 'settings']),
  };
}
