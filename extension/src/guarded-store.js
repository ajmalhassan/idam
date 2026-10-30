import { PREFIX } from './model.js';
import {
  backupRecords,
  createBackup,
  parseBackup,
  workspaceSnapshot,
  RECOVERY_KEY,
  REVISION_KEY,
} from './backup.js';

export function createGuardedStore(backend, { lock } = {}) {
  let revision,
    stale = false,
    restoring = false;
  const coordinated = Boolean(lock);
  let queue = Promise.resolve();
  const exclusive =
    lock ||
    ((fn) => {
      const next = queue.then(fn);
      queue = next.catch(() => {});
      return next;
    });
  const read = async () => {
    const raw = await backend.get();
    const current = raw[REVISION_KEY] ?? null;
    if (revision === undefined) revision = current;
    else if (current !== revision && !restoring) stale = true;
    return raw;
  };
  const ensure = (raw, expected) => {
    if (stale || (raw[REVISION_KEY] ?? null) !== expected) {
      if ((raw[REVISION_KEY] ?? null) !== revision) stale = true;
      throw new Error('Idam was restored in another tab. Reload this tab before making changes.');
    }
  };
  const mutate = (operation) => {
    const expected = revision;
    return exclusive(async () => {
      const raw = await read();
      ensure(raw, expected === undefined ? revision : expected);
      return operation();
    });
  };
  return {
    get: read,
    set: (values) => mutate(() => backend.set(values)),
    remove: (key) => mutate(() => backend.remove(key)),
    subscribe: (fn) => backend.subscribe(fn),
    get stale() {
      return stale;
    },
    reset: () => {
      backend.reset();
      revision = undefined;
      stale = false;
    },
    async restore(backup, expectedSnapshot) {
      if (!coordinated)
        throw new Error(
          'Restore requires a secure browser context. Open Idam in your installed extension or localhost.',
        );
      const validated = parseBackup(JSON.stringify(backup));
      return exclusive(async () => {
        const raw = await read();
        ensure(raw, revision);
        if (workspaceSnapshot(raw) !== expectedSnapshot)
          throw new Error(
            'Your workspace changed after the preview. Choose the file again to review the latest data.',
          );
        const recovery = createBackup(raw);
        const nextRevision = crypto.randomUUID();
        const replacements = Object.fromEntries(
          Object.keys(raw)
            .filter((k) => k.startsWith(PREFIX))
            .map((k) => [k, null]),
        );
        const patch = {
          ...replacements,
          ...backupRecords(validated),
          [REVISION_KEY]: nextRevision,
        };
        // Never clear first. Persist recovery before attempting the single bulk
        // replacement write, including nulls for obsolete records.
        await backend.set({ [RECOVERY_KEY]: recovery });
        restoring = true;
        try {
          await backend.set(patch);
          revision = nextRevision;
        } finally {
          restoring = false;
        }
      });
    },
  };
}
