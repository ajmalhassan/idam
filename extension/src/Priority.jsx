import { useState, useEffect, useRef } from 'react';
import { Button, IconButton, TextField } from '@pane-ui/react';
import { PREFIX } from './model.js';
import { localDay, priorityForDay } from './priority.js';
import { store } from './storage.js';
import { Icon } from './Icon.jsx';
export function Priority({ records, day, run }) {
  const { current, carry } = priorityForDay(records, day);
  const [editing, setEditing] = useState(false),
    [draft, setDraft] = useState(''),
    [busy, setBusy] = useState(false);
  const previousDay = useRef(day),
    [rolledOver, setRolledOver] = useState(false);
  useEffect(() => {
    if (previousDay.current !== day) {
      previousDay.current = day;
      setEditing(Boolean(draft.trim()));
      setRolledOver(Boolean(draft.trim()));
    }
  }, [day]);
  const save = async (text, done = false) => {
    setBusy(true);
    const date = localDay();
    const record = { date, text: text.trim().slice(0, 200), done };
    await run(async () => {
      await store.set({ [PREFIX + 'priority.' + date]: record });
      setEditing(false);
      setDraft('');
      setRolledOver(false);
    }, 'priority.' + date);
    setBusy(false);
  };
  const hasGoal = Boolean(current?.text);
  return (
    <section className="priority" aria-labelledby="priority-heading">
      <div className="priority-top">
        <span className="eyebrow">{current?.done ? 'ONE THING, DONE' : 'ONE THING TODAY'}</span>
        {hasGoal && !editing && (
          <IconButton
            className="priority-edit"
            label="Edit daily priority"
            icon={<Icon name="edit" />}
            disabled={busy}
            onClick={() => {
              setDraft(current.text);
              setEditing(true);
            }}
          />
        )}
      </div>
      {carry && !editing ? (
        <>
          <p className="carry-caption">Still on your mind from {carry.date}?</p>
          <h2 id="priority-heading">{carry.text}</h2>
          <div className="priority-actions">
            <Button disabled={busy} onClick={() => save(carry.text)}>
              Carry into today
            </Button>
            <Button variant="subtle" disabled={busy} onClick={() => save('')}>
              Choose something new
            </Button>
          </div>
        </>
      ) : hasGoal && !editing ? (
        <>
          <h2 id="priority-heading">{current.text}</h2>
          <div className="priority-bottom">
            <span>
              {current.done ? 'That is a good day’s work.' : 'A little progress goes a long way.'}
            </span>
            <IconButton
              label={current.done ? 'Mark daily priority incomplete' : 'Complete daily priority'}
              aria-pressed={current.done}
              disabled={busy}
              icon={<Icon name="check" />}
              onClick={() => save(current.text, !current.done)}
            />
          </div>
        </>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.trim()) save(draft);
          }}
        >
          <h2 id="priority-heading">
            {editing ? 'Make room for what matters.' : 'What matters most today?'}
          </h2>
          {rolledOver && <p role="status">A new day. Save this draft as today's priority.</p>}
          <TextField
            aria-label="Daily priority"
            placeholder="One thing is enough"
            value={draft}
            maxLength={200}
            onChange={(e) => setDraft(e.target.value)}
            disabled={busy}
            autoFocus={editing}
          />
          <div className="priority-actions">
            <Button type="submit" disabled={!draft.trim()} loading={busy}>
              {editing ? 'Save priority' : 'Set my priority'} <Icon name="arrow" />
            </Button>
            {editing && (
              <Button disabled={busy} variant="subtle" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
