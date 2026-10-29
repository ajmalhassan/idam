import { TileLink, Button, IconButton } from '@pane-ui/react';
import { Icon } from './Icon.jsx';
export function Shortcuts({ ws, query, editing, setEditing, openShortcut, addRef, move }) {
  const visibleShortcuts = ws.shortcuts.filter((s) =>
    (s.title + ' ' + s.url).toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <section className="shortcuts-panel" aria-labelledby="shortcuts-heading">
      <div className="section-line">
        <h2 id="shortcuts-heading">your places</h2>
        <Button
          className="quiet-button"
          variant="subtle"
          aria-pressed={editing}
          onClick={() => setEditing(!editing)}
        >
          {editing ? 'done' : 'edit tiles'}
        </Button>
      </div>
      <div className="shortcut-grid">
        {visibleShortcuts.map((s) => (
          <div className={`shortcut-slot ${s.size === 'wide' ? 'wide' : ''}`} key={s.id}>
            <TileLink
              href={s.url}
              label={s.title}
              className={`shortcut tone-${s.tone}`}
              onClick={(e) => {
                if (editing) {
                  e.preventDefault();
                  openShortcut(s, e);
                }
              }}
            >
              <span className="tile-content">
                {s.icon ? (
                  <Icon name={s.icon} />
                ) : (
                  <span className="initial">{s.title.slice(0, 2).toUpperCase()}</span>
                )}
              </span>
            </TileLink>
            {editing && (
              <div className="tile-tools">
                <IconButton
                  label={`Move ${s.title} earlier`}
                  icon={<Icon name="left" />}
                  disabled={ws.shortcuts[0].id === s.id}
                  onClick={() => move(s, -1)}
                />
                <IconButton
                  label={`Edit ${s.title}`}
                  icon={<Icon name="edit" />}
                  onClick={(e) => openShortcut(s, e)}
                />
                <IconButton
                  label={`Move ${s.title} later`}
                  icon={<Icon name="right" />}
                  disabled={ws.shortcuts.at(-1).id === s.id}
                  onClick={() => move(s, 1)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <Button
        ref={addRef}
        className="add-shortcut"
        variant="subtle"
        onClick={(e) => openShortcut(null, e)}
      >
        <Icon name="plus" /> add a shortcut
      </Button>
      <p className="empty-shortcuts" hidden={visibleShortcuts.length > 0}>
        {query.trim()
          ? 'No matching places. Search the web or try another name.'
          : 'Add a few places you visit often.'}
      </p>
    </section>
  );
}
