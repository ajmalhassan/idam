import { TileLink, Button, IconButton, TileSequence } from '@pane-ui/react';
import { useEntrance } from './useMotion.js';
import { Icon } from './Icon.jsx';
import { SiteIcon } from './SiteIcon.jsx';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const TILE_DRAG_TYPE = 'application/x-idam-tile';

export function Shortcuts({
  firstArrival,
  ws,
  query,
  editing,
  setEditing,
  openShortcut,
  addRef,
  reorder,
}) {
  const show = useEntrance();
  const source = useRef(null);
  const saving = useRef(false);
  const returnFocus = useRef(null);
  const [dragged, setDragged] = useState(null);
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const filtered = Boolean(query.trim());
  const canReorder = editing && !filtered && !busy;
  const orderKey = JSON.stringify(ws.shortcuts.map((s) => s.id));
  const resetDrag = () => {
    source.current = null;
    setDragged(null);
    setTarget(null);
  };
  useEffect(() => {
    source.current = null;
    setDragged(null);
    setTarget(null);
    setStatus('');
  }, [editing, query]);
  useLayoutEffect(() => {
    const pending = returnFocus.current;
    if (busy || !pending) return;
    const { button, before, after } = pending;
    // chrome.storage can finish saving before its subscription refresh renders.
    // Keep the focus intent until that order arrives (or another order replaces it).
    if (after && orderKey === before && orderKey !== after) return;
    returnFocus.current = null;
    if (button.isConnected && [document.body, button].includes(document.activeElement)) {
      // Moving a keyed DOM node or disabling a focused button can drop focus.
      const next = button.disabled ? button.closest('.tile-tools')?.children[1] : button;
      next?.focus({ preventScroll: true });
    }
  }, [busy, orderKey]);
  const saveOrder = async (id, destination, button) => {
    if (saving.current) return;
    const focus = button ? { button, before: orderKey, after: null } : null;
    returnFocus.current = focus;
    saving.current = true;
    setBusy(true);
    setStatus('Saving tile order…');
    const { saved, order } = await reorder(id, destination);
    if (focus && saved) focus.after = JSON.stringify(order);
    setStatus(saved ? 'Tile order saved.' : '');
    saving.current = false;
    setBusy(false);
  };
  const acceptsDrag = (e) =>
    canReorder && source.current && e.dataTransfer.types.includes(TILE_DRAG_TYPE);
  const dropSide = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return e.clientX < rect.left + rect.width / 2 ? 'before' : 'after';
  };
  const visibleShortcuts = ws.shortcuts.filter((s) =>
    (s.title + ' ' + s.url).toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <section
      className={`shortcuts-panel ${editing ? 'is-editing' : ''}`}
      aria-labelledby="shortcuts-heading"
    >
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
      {editing && (
        <p className="reorder-hint" id="tile-reorder-hint">
          {filtered
            ? 'Clear search to reorder your places.'
            : 'Drag tiles to reorder, or use the arrow buttons.'}
        </p>
      )}
      <p className="reorder-status" role="status" aria-atomic="true">
        {status}
      </p>
      <TileSequence
        className="shortcut-grid"
        aria-busy={busy}
        onDragOver={(e) => {
          if (!acceptsDrag(e) || !e.target.closest('.shortcut-slot')) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'none';
            setTarget(null);
          }
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setTarget(null);
        }}
        onDrop={(e) => {
          // Ignore external links/files, including their default navigation action.
          e.preventDefault();
          resetDrag();
        }}
        show={show}
        mode="layered"
        duration={firstArrival ? 620 : 300}
        interval={firstArrival ? 65 : 26}
        items={visibleShortcuts.map((s) => ({
          id: s.id,
          size: s.size === 'wide' ? 'wide' : 'small',
          content: (
            <div
              className={`shortcut-slot ${s.size === 'wide' ? 'wide' : ''} ${dragged === s.id ? 'is-dragging' : ''}`}
              key={s.id}
              data-shortcut-id={s.id}
              data-drop-side={target?.id === s.id ? target.side : undefined}
              onDragOver={(e) => {
                if (!acceptsDrag(e)) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                setTarget(source.current === s.id ? null : { id: s.id, side: dropSide(e) });
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = source.current;
                if (acceptsDrag(e) && e.dataTransfer.getData(TILE_DRAG_TYPE) === id && id !== s.id)
                  void saveOrder(id, { targetId: s.id, side: dropSide(e) });
                resetDrag();
              }}
            >
              <TileLink
                href={s.url}
                label={s.title}
                title={s.title}
                aria-label={s.title}
                aria-describedby={editing ? 'tile-reorder-hint' : undefined}
                draggable={canReorder}
                className={`shortcut tone-${s.tone}`}
                onDragStart={(e) => {
                  if (!canReorder || saving.current) {
                    e.preventDefault();
                    return;
                  }
                  source.current = s.id;
                  e.dataTransfer.clearData();
                  e.dataTransfer.setData(TILE_DRAG_TYPE, s.id);
                  e.dataTransfer.effectAllowed = 'move';
                  setDragged(s.id);
                  setStatus('');
                }}
                onDragEnd={resetDrag}
                onClick={(e) => {
                  if (editing) {
                    e.preventDefault();
                    if (!source.current && !saving.current) openShortcut(s, e);
                  }
                }}
              >
                <span className="tile-content">
                  <SiteIcon key={s.url} url={s.url} title={s.title} />
                </span>
              </TileLink>
              {editing && (
                <div className="tile-tools">
                  <IconButton
                    label={`Move ${s.title} earlier`}
                    icon={<Icon name="left" />}
                    disabled={!canReorder || ws.shortcuts[0].id === s.id}
                    onClick={(e) => saveOrder(s.id, { delta: -1 }, e.currentTarget)}
                  />
                  <IconButton
                    label={`Edit ${s.title}`}
                    icon={<Icon name="edit" />}
                    disabled={busy}
                    onClick={(e) => openShortcut(s, e)}
                  />
                  <IconButton
                    label={`Move ${s.title} later`}
                    icon={<Icon name="right" />}
                    disabled={!canReorder || ws.shortcuts.at(-1).id === s.id}
                    onClick={(e) => saveOrder(s.id, { delta: 1 }, e.currentTarget)}
                  />
                </div>
              )}
            </div>
          ),
        }))}
      />
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
