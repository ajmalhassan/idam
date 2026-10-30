import { useState, useRef, useEffect } from 'react';
import { decodeRecords } from './model.js';
import { store, initialize } from './storage.js';
import { createOperations } from './operations.js';
import { REVISION_KEY } from './backup.js';
export function useWorkspace() {
  const [raw, setRaw] = useState({});
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const operations = useRef(null);
  if (!operations.current) operations.current = createOperations(setError);
  const { run, retry } = operations.current;
  useEffect(() => {
    let loadedRevision;
    let alive = true,
      serial = 0;
    const refresh = async () => {
      const n = ++serial;
      const values = await store.get();
      if (alive && n === serial) {
        const revision = values[REVISION_KEY] ?? null;
        if (loadedRevision !== undefined && loadedRevision !== revision) {
          operations.current.cancel();
          operations.current = createOperations(setError);
          setError(null);
        }
        loadedRevision = revision;
        setRaw(values);
      }
    };
    const load = async () => {
      await initialize();
      await refresh();
      if (alive) setReady(true);
    };
    const loadSafely = () =>
      operations.current.run(
        load,
        'load',
        'Your workspace could not be loaded. Try again before making changes.',
      );
    const unsubscribe = store.subscribe(() =>
      refresh().catch(() => {
        if (alive) loadSafely();
      }),
    );
    loadSafely();
    return () => {
      alive = false;
      unsubscribe();
    };
  }, []);
  return {
    ...decodeRecords(raw),
    revision: raw[REVISION_KEY] || 'initial',
    stale: store.stale,
    ready,
    error,
    run,
    retry,
  };
}
