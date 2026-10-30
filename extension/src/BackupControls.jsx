import { useEffect, useRef, useState } from 'react';
import { Button, Checkbox } from '@pane-ui/react';
import { store } from './storage.js';
import {
  createBackup,
  parseBackup,
  backupSummary,
  workspaceSnapshot,
  MAX_BACKUP_BYTES,
  RECOVERY_KEY,
} from './backup.js';

function download(backup, label = 'backup') {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `idam-${label}-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function BackupControls({ onBusy, onPreview }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [status, setStatus] = useState('');
  const [preview, setPreview] = useState(null),
    [confirmed, setConfirmed] = useState(false),
    [recovery, setRecovery] = useState(null);
  const fileInput = useRef(null),
    active = useRef(true),
    lock = useRef(false),
    previewHeading = useRef(null),
    chooseButton = useRef(null);
  useEffect(() => {
    active.current = true;
    store
      .get()
      .then((raw) => {
        if (active.current && raw[RECOVERY_KEY])
          setRecovery(parseBackup(JSON.stringify(raw[RECOVERY_KEY])));
      })
      .catch(() => {});
    return () => {
      active.current = false;
    };
  }, []);
  useEffect(() => {
    if (preview) previewHeading.current?.focus();
  }, [preview]);
  const operation = async (fn) => {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    onBusy(true);
    setError('');
    setStatus('');
    try {
      await fn();
    } catch (e) {
      if (active.current) setError(e.message || 'Could not complete this action. Try again.');
    } finally {
      lock.current = false;
      if (active.current) {
        setBusy(false);
        onBusy(false);
      }
    }
  };
  const cancel = () => {
    setPreview(null);
    setConfirmed(false);
    setError('');
    onPreview(false);
    chooseButton.current?.focus();
  };
  return (
    <section className="backup-controls" aria-labelledby="backup-heading">
      <h3 id="backup-heading">backup & restore</h3>
      <p>
        Take your places, tasks, notes, daily priorities and saved settings with you. Backups are
        readable JSON files, not encrypted. Keep them somewhere private.
      </p>
      <div className="backup-actions">
        <Button
          disabled={busy}
          onClick={() =>
            operation(async () => {
              download(createBackup(await store.get()));
              setStatus('Backup download requested. Keep the file somewhere safe.');
            })
          }
        >
          Export backup
        </Button>
        <Button ref={chooseButton} disabled={busy} onClick={() => fileInput.current?.click()}>
          Choose backup
        </Button>
      </div>
      <input
        ref={fileInput}
        className="backup-file"
        type="file"
        accept=".json,application/json"
        aria-label="Choose an Idam backup file"
        disabled={busy}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (!file) return;
          operation(async () => {
            setPreview(null);
            setConfirmed(false);
            onPreview(false);
            if (file.size > MAX_BACKUP_BYTES) throw new Error('Choose a backup smaller than 2 MB.');
            const imported = parseBackup(await file.text());
            const raw = await store.get();
            if (!active.current) return;
            setPreview({
              imported,
              filename: file.name,
              current: createBackup(raw),
              snapshot: workspaceSnapshot(raw),
            });
            onPreview(true);
          });
        }}
      />
      {preview && (
        <div className="backup-preview">
          <h4 ref={previewHeading} tabIndex={-1}>
            Review your restore
          </h4>
          <p className="backup-filename">{preview.filename}</p>
          <dl>
            <dt>In this backup</dt>
            <dd>{backupSummary(preview.imported)}</dd>
            <dt>Saved on</dt>
            <dd>{new Date(preview.imported.exportedAt).toLocaleString()}</dd>
            <dt>Currently on this device</dt>
            <dd>{backupSummary(preview.current)}</dd>
          </dl>
          <p>
            Restore replaces your entire saved workspace, including your name and appearance
            settings. It does not merge. Unsaved edits will be discarded. Idam keeps one recovery
            copy of the saved workspace before replacing it.
          </p>
          <Checkbox
            label="I understand this replaces my current workspace"
            checked={confirmed}
            disabled={busy}
            onChange={(e) => setConfirmed(e.target.checked)}
          />
          <div className="backup-actions">
            <Button disabled={busy} onClick={cancel}>
              Cancel restore
            </Button>
            <Button
              variant="accent"
              disabled={busy || !confirmed}
              onClick={() =>
                operation(async () => {
                  await store.restore(preview.imported, preview.snapshot);
                })
              }
            >
              Replace workspace
            </Button>
          </div>
        </div>
      )}
      {recovery && (
        <div className="backup-recovery">
          <p>
            Recovery copy from {new Date(recovery.exportedAt).toLocaleString()}. This local copy is
            replaced by the next restore and is lost if Idam is uninstalled.
          </p>
          <Button
            disabled={busy}
            onClick={() =>
              operation(async () => {
                download(recovery, 'recovery');
                setStatus(
                  'Recovery download requested. Choose that file to preview and restore it.',
                );
              })
            }
          >
            Export recovery copy
          </Button>
        </div>
      )}
      {busy && <p role="status">Working…</p>}
      {status && <p role="status">{status}</p>}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
