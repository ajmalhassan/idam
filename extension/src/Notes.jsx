import { useRef } from 'react';
import { Button, Dialog, TextArea } from '@pane-ui/react';
import { useNoteDraft } from './useNoteDraft.js';
import { Icon } from './Icon.jsx';
export function Notes({ value, run, hidden, open, setOpen }) {
  const { draft, status, updateDraft, flush } = useNoteDraft(value, run);
  const editor = useRef(null),
    opener = useRef(null);
  const close = () => {
    flush();
    setOpen(false);
  };
  return (
    <>
      <section className="notes-panel" hidden={hidden} aria-labelledby="notes-heading">
        <div className="section-line">
          <h2 id="notes-heading">notes</h2>
          <Icon name="note" />
        </div>
        <Button
          ref={opener}
          className="note-preview"
          variant="subtle"
          onClick={() => setOpen(true)}
          aria-label="Open notes"
        >
          <strong>{draft ? 'A thought for later' : 'Room for a thought'}</strong>
          <span>
            {draft
              ? draft.slice(0, 180)
              : 'An idea, a reminder, something you do not want to lose.'}
          </span>
          <span className="note-open">Open notes ↗</span>
        </Button>
        <div className="note-status" role="status">
          {status}
        </div>
      </section>
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v) close();
        }}
        title="notes"
        description="A little room to think. Changes save automatically."
        initialFocusRef={editor}
        finalFocusRef={opener}
        className="notes-dialog"
      >
        <TextArea
          ref={editor}
          aria-label="Scratchpad"
          className="scratchpad"
          value={draft}
          maxLength={40000}
          placeholder="An idea. A reminder. A little room to think."
          onChange={(e) => updateDraft(e.target.value)}
          onBlur={flush}
        />
        <div className="notes-dialog-footer">
          <span role="status">{status}</span>
          {status.startsWith('Not saved') && <Button onClick={flush}>Try again</Button>}
          <Button onClick={close}>Back to home</Button>
        </div>
      </Dialog>
    </>
  );
}
