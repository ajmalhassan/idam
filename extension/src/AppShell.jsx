import { useEffect, useRef, useState } from 'react';
import { Button, TextField, MessageBanner } from '@pane-ui/react';
import { Brand } from './Brand.jsx';
import { MetroTheme } from './MetroTheme.jsx';
import { useNow } from './useNow.js';
import { greetingFor } from './greeting.js';
import { useWorkspace } from './useWorkspace.js';
import { Icon } from './Icon.jsx';
import { Onboarding } from './Onboarding.jsx';
import { Priority } from './Priority.jsx';
import { Tasks } from './Tasks.jsx';
import { Notes } from './Notes.jsx';
import { Shortcuts } from './Shortcuts.jsx';
import { ShortcutDialog } from './ShortcutDialog.jsx';
import { Settings } from './Settings.jsx';
import { localDay } from './priority.js';
import { store } from './storage.js';
import { reorderShortcut } from './shortcut-actions.js';

export function App() {
  const ws = useWorkspace();
  if (ws.stale)
    return (
      <main className="restore-notice">
        <h1>Your workspace was restored</h1>
        <p>
          Reload this tab to use the restored data. Older edits in this tab cannot overwrite it.
        </p>
        <Button onClick={() => window.location.reload()}>Reload Idam</Button>
      </main>
    );
  return <Workspace key={ws.revision} ws={ws} />;
}
function Workspace({ ws }) {
  const now = useNow(),
    day = localDay(now);
  const [editing, setEditing] = useState(false),
    [shortcut, setShortcut] = useState(null),
    [settingsOpen, setSettingsOpen] = useState(false),
    [noteOpen, setNoteOpen] = useState(false),
    [query, setQuery] = useState('');
  const [setupOpen, setSetupOpen] = useState(false);
  const [screen, setScreen] = useState(null);
  const [firstArrival, setFirstArrival] = useState(false);
  useEffect(() => {
    if (ws.ready && screen === null) setScreen(ws.onboarded ? 'home' : 'setup');
  }, [ws.ready, ws.onboarded, screen]);
  const addRef = useRef(null),
    settingsRef = useRef(null),
    shortcutFocus = useRef(null),
    searchRef = useRef(null);
  const openShortcut = (record, event) => {
    shortcutFocus.current = event?.currentTarget || addRef.current;
    setShortcut(
      record || {
        id: crypto.randomUUID(),
        title: '',
        url: '',
        tone: 'blue',
        size: 'small',
        order: Math.max(-1, ...ws.shortcuts.map((s) => s.order)) + 1,
        icon: '',
      },
    );
  };
  const reorder = async (id, destination) => {
    let order;
    const saved = await ws.run(async () => {
      order = await reorderShortcut(store, id, destination);
    }, 'shortcut-order');
    return { saved, order };
  };
  const search = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const urls = {
      duckduckgo: 'https://duckduckgo.com/?q=',
      google: 'https://www.google.com/search?q=',
      bing: 'https://www.bing.com/search?q=',
    };
    location.assign(urls[ws.settings.search] + encodeURIComponent(query.trim()));
  };
  useEffect(() => {
    const key = (e) => {
      if (
        !ws.ready ||
        !ws.onboarded ||
        screen !== 'home' ||
        setupOpen ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        e.defaultPrevented ||
        document.querySelector('dialog[open]')
      )
        return;
      const el = e.target;
      if (el.closest('input,textarea,select,button,a,[contenteditable=true]')) return;
      if (e.key === '/') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key.toLowerCase() === 'n' && ws.settings.showNotes) {
        e.preventDefault();
        setNoteOpen(true);
      }
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [ws.ready, ws.onboarded, ws.settings.showNotes, screen, setupOpen]);
  if (ws.ready && (screen === 'setup' || setupOpen))
    return (
      <Onboarding
        run={ws.run}
        error={ws.error}
        retry={ws.retry}
        revisit={setupOpen}
        settings={ws.settings}
        shortcuts={ws.shortcuts}
        onComplete={() => {
          setFirstArrival(!setupOpen);
          setSetupOpen(false);
          setScreen('home');
        }}
        onCancel={() => setSetupOpen(false)}
      />
    );
  const greeting = greetingFor(now);
  return (
    <MetroTheme accent={ws.settings.accent}>
      <div
        className={`workspace home-workspace ${firstArrival ? 'first-arrival' : 'daily-arrival'}`}
      >
        <div className="topline">
          <Brand />
          <Button
            ref={settingsRef}
            className="quiet-button"
            variant="subtle"
            onClick={() => setSettingsOpen(true)}
            disabled={!ws.ready}
          >
            Personalize
          </Button>
        </div>
        {ws.error && (
          <MessageBanner
            className="save-error"
            tone="error"
            announcement="assertive"
            actions={<Button onClick={ws.retry}>Try again</Button>}
          >
            {ws.error}
          </MessageBanner>
        )}
        {!ws.ready || screen === null ? (
          <p className="loading">Opening your workspace…</p>
        ) : (
          <>
            <header className="hero home-enter">
              <div>
                <p className="eyebrow">
                  {new Intl.DateTimeFormat(undefined, {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })
                    .format(now)
                    .toUpperCase()}
                </p>
                <h1>
                  {greeting}
                  {ws.settings.name && `, ${ws.settings.name}`}
                  <span>.</span>
                </h1>
              </div>
              <div className="clock">
                <div className="time">
                  {new Intl.DateTimeFormat(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  }).format(now)}
                </div>
                <div className="date">make today yours</div>
              </div>
            </header>
            <form className="search home-enter" onSubmit={search} role="search">
              <Icon name="search" />
              <TextField
                ref={searchRef}
                aria-label="Find a place or search the web"
                placeholder="Find a place, or search the web"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button type="submit" variant="subtle" disabled={!query.trim()}>
                Search web <Icon name="arrow" />
              </Button>
            </form>
            <main className="dashboard">
              <div className="places-column">
                <div className="priority-enter home-enter">
                  <Priority records={ws.priorities} day={day} run={ws.run} />
                </div>
                <Shortcuts
                  firstArrival={firstArrival}
                  ws={ws}
                  query={query}
                  editing={editing}
                  setEditing={setEditing}
                  openShortcut={openShortcut}
                  addRef={addRef}
                  reorder={reorder}
                />
              </div>
              <aside
                className="daily-panel home-enter"
                hidden={!ws.settings.showTasks && !ws.settings.showNotes}
              >
                <Tasks ws={ws} hidden={!ws.settings.showTasks} />
                <Notes
                  value={ws.notes}
                  run={ws.run}
                  hidden={!ws.settings.showNotes}
                  open={noteOpen}
                  setOpen={setNoteOpen}
                />
              </aside>
            </main>
            <footer className="page-footer home-enter">
              <span>Yours, on this device.</span>
              <span>
                Built with{' '}
                <a href="https://pane.ajmalhassan.com" target="_blank" rel="noreferrer">
                  Pane UI
                </a>
              </span>
            </footer>
          </>
        )}
      </div>
      <ShortcutDialog
        record={shortcut}
        onClose={() => setShortcut(null)}
        finalFocusRef={shortcutFocus}
        run={ws.run}
      />
      <Settings
        onSetup={() => {
          setSettingsOpen(false);
          setSetupOpen(true);
        }}
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={ws.settings}
        finalFocusRef={settingsRef}
        run={ws.run}
      />
    </MetroTheme>
  );
}
