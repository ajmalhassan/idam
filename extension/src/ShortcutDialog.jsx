import { useState, useRef, useEffect } from 'react';
import { Dialog, Field, TextField, Select, Button } from '@pane-ui/react';
import { PREFIX, TONES, safeUrl } from './model.js';
import { store } from './storage.js';
export function ShortcutDialog({ record, onClose, finalFocusRef, run }) {
  const [form, setForm] = useState({}),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const input = useRef(null);
  useEffect(() => {
    if (record) {
      setForm({ ...record });
      setError('');
    }
  }, [record]);
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const submit = async (e) => {
    e.preventDefault();
    let url;
    try {
      url = safeUrl(form.url);
    } catch (e) {
      setError(e.message);
      return;
    }
    if (!form.title?.trim()) {
      setError('Give this shortcut a name.');
      input.current?.focus();
      return;
    }
    setBusy(true);
    const item = { ...form, title: form.title.trim(), url };
    const ok = await run(
      () => store.set({ [`${PREFIX}shortcut.${item.id}`]: item }),
      `shortcut.${item.id}`,
    );
    setBusy(false);
    if (ok) onClose();
    else setError('Could not save. Keep this dialog open and try again.');
  };
  return (
    <Dialog
      open={Boolean(record)}
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
      title={record?.title ? 'edit shortcut' : 'new shortcut'}
      description="A familiar place, just one click away."
      initialFocusRef={input}
      finalFocusRef={finalFocusRef}
      className="metro-dialog"
    >
      <form onSubmit={submit}>
        <Field label="Name" required>
          <TextField
            ref={input}
            value={form.title || ''}
            maxLength={48}
            onChange={(e) => update('title', e.target.value)}
          />
        </Field>
        <Field label="Website" required description="For example, github.com">
          <TextField value={form.url || ''} onChange={(e) => update('url', e.target.value)} />
        </Field>
        <div className="form-pair">
          <Field label="Tile color">
            <Select value={form.tone || 'blue'} onChange={(e) => update('tone', e.target.value)}>
              {TONES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Tile size">
            <Select value={form.size || 'small'} onChange={(e) => update('size', e.target.value)}>
              <option value="small">Square</option>
              <option value="wide">Wide</option>
            </Select>
          </Field>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="dialog-actions">
          {record?.title && (
            <Button
              className="remove-link"
              variant="subtle"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                const ok = await run(
                  () => store.remove(`${PREFIX}shortcut.${record.id}`),
                  `shortcut.${record.id}`,
                );
                setBusy(false);
                if (ok) {
                  finalFocusRef.current = document.querySelector('.add-shortcut');
                  onClose();
                } else setError('Could not remove this shortcut. Try again.');
              }}
            >
              Remove
            </Button>
          )}
          <Button disabled={busy} onClick={onClose}>
            Cancel
          </Button>
          <Button variant="accent" type="submit" loading={busy}>
            Save shortcut
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
