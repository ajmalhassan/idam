import { useEffect, useId, useRef, useState } from 'react';
import { Checkbox, TextField, IconButton } from '@pane-ui/react';
import { Icon } from './Icon.jsx';
import { editTask } from './task-actions.js';
import { store } from './storage.js';
import { PREFIX } from './model.js';

export function TaskRow({ task, run, remove }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const input = useRef(null);
  const editButton = useRef(null);
  const restoreFocus = useRef(false);
  const saving = useRef(false);
  const hintId = useId();
  useEffect(() => {
    if (editing) {
      input.current?.focus();
      input.current?.select();
    } else if (restoreFocus.current) {
      editButton.current?.focus();
      restoreFocus.current = false;
    }
  }, [editing]);
  const close = () => {
    restoreFocus.current = true;
    setEditing(false);
    setError('');
  };
  const save = async (event) => {
    event.preventDefault();
    if (saving.current || !draft.trim()) return;
    saving.current = true;
    setBusy(true);
    setError('');
    try {
      await editTask(store, task.id, draft);
      close();
    } catch {
      // Keep this retry local: cancel must not leave a queued global write.
      setError('Could not save. Your text is still here—try saving again.');
    } finally {
      saving.current = false;
      setBusy(false);
    }
  };
  return (
    <li className={`task${task.done ? ' done' : ''}${editing ? ' is-editing' : ''}`}>
      {editing ? (
        <form
          className="task-editor"
          onSubmit={save}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && !event.nativeEvent.isComposing && !saving.current) {
              event.preventDefault();
              close();
            }
            if (event.key === 'Enter' && event.nativeEvent.isComposing) event.preventDefault();
          }}
        >
          <TextField
            ref={input}
            aria-label="Edit task"
            aria-describedby={hintId}
            maxLength={300}
            value={draft}
            disabled={busy}
            onChange={(event) => {
              setDraft(event.target.value);
              setError('');
            }}
          />
          <div className="task-actions">
            <IconButton
              type="submit"
              label="Save task"
              icon={<Icon name="check" />}
              disabled={busy || !draft.trim()}
            />
            <IconButton
              type="button"
              label="Cancel editing"
              icon={<Icon name="close" />}
              disabled={busy}
              onClick={close}
            />
          </div>
          <p className="task-edit-hint" id={hintId}>
            {busy ? 'Saving…' : 'Enter to save · Esc to cancel'}
          </p>
          {error && (
            <p className="task-edit-error" role="alert">
              {error}
            </p>
          )}
        </form>
      ) : (
        <>
          <Checkbox
            label={task.text}
            checked={task.done}
            onChange={(event) => {
              const done = event.target.checked;
              run(
                () => store.set({ [`${PREFIX}task.${task.id}`]: { ...task, done } }),
                `task.${task.id}`,
              );
            }}
          />
          <div className="task-actions">
            <IconButton
              ref={editButton}
              type="button"
              label={`Edit ${task.text}`}
              icon={<Icon name="edit" />}
              onClick={() => {
                setDraft(task.text);
                setError('');
                setEditing(true);
              }}
            />
            <IconButton
              type="button"
              className="delete-task"
              label={`Delete ${task.text}`}
              icon={<Icon name="close" />}
              onClick={() => remove(task)}
            />
          </div>
        </>
      )}
    </li>
  );
}
