import { useEffect, useRef, useState } from 'react';
import { Dialog, Button, Field, TextField, Select, Checkbox } from '@pane-ui/react';
import { ACCENTS, PREFIX } from './model.js';
import { store } from './storage.js';
import { BackupControls } from './BackupControls.jsx';
export function Settings({ open, onClose, onSetup, settings, finalFocusRef, run }) {
  const [draft, setDraft] = useState(settings),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  const [backupBusy, setBackupBusy] = useState(false),
    [backupPreview, setBackupPreview] = useState(false);
  const input = useRef(null);
  useEffect(() => {
    if (open) {
      setDraft(settings);
      setError('');
      setBackupBusy(false);
      setBackupPreview(false);
    }
  }, [open]);
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v && !busy && !backupBusy) onClose();
      }}
      title="make it yours"
      description="Keep what is useful to you."
      initialFocusRef={input}
      finalFocusRef={finalFocusRef}
      className="metro-dialog"
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (busy || backupBusy || backupPreview) return;
          setBusy(true);
          const ok = await run(async () => {
            await store.set({ [PREFIX + 'settings']: draft });
            onClose();
          }, 'settings');
          setBusy(false);
          if (!ok) setError('Could not save settings. Try again.');
        }}
      >
        <fieldset className="settings-fields" disabled={busy || backupBusy || backupPreview}>
          <Field label="Your name" description="Optional">
            <TextField
              ref={input}
              maxLength={40}
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </Field>
          <div className="form-pair">
            <Field label="Accent">
              <Select
                value={draft.accent}
                onChange={(e) => setDraft({ ...draft, accent: e.target.value })}
              >
                {ACCENTS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Search engine">
              <Select
                value={draft.search}
                onChange={(e) => setDraft({ ...draft, search: e.target.value })}
              >
                <option value="duckduckgo">DuckDuckGo</option>
                <option value="google">Google</option>
                <option value="bing">Bing</option>
              </Select>
            </Field>
          </div>
          <fieldset className="module-options">
            <legend>On your home screen</legend>
            <Checkbox
              label="Tasks"
              checked={draft.showTasks}
              onChange={(e) => setDraft({ ...draft, showTasks: e.target.checked })}
            />
            <Checkbox
              label="Notes"
              checked={draft.showNotes}
              onChange={(e) => setDraft({ ...draft, showNotes: e.target.checked })}
            />
          </fieldset>
          <p className="settings-note">
            Hidden modules keep their saved content. Everything stays on this device. Notes and
            settings use the latest save when edited in multiple tabs.
          </p>
          <Button variant="subtle" disabled={busy} onClick={onSetup}>
            Revisit setup
          </Button>
        </fieldset>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="dialog-actions">
          <Button disabled={busy || backupBusy} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="accent"
            type="submit"
            loading={busy}
            disabled={backupBusy || backupPreview}
          >
            Save settings
          </Button>
        </div>
      </form>
      {open && <BackupControls onBusy={setBackupBusy} onPreview={setBackupPreview} />}
    </Dialog>
  );
}
