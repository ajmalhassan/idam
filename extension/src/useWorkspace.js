import { useState, useRef, useEffect } from 'react';
import { decodeRecords } from './model.js';
import { store, initialize } from './storage.js';
import { createOperations } from './operations.js';
export function useWorkspace() {
  const [raw, setRaw] = useState({});
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const operations = useRef(null);
  if (!operations.current) operations.current = createOperations(setError);
  const { run, retry } = operations.current;
  useEffect(() => {
    let alive = true,
      serial = 0;
    const refresh = async () => {
      const n = ++serial;
      const values = await store.get();
      if (alive && n === serial) setRaw(values);
    };
    const load = async () => {
      await initialize();
      await refresh();
      if (alive) setReady(true);
    };
    const loadSafely = () =>
      run(load, 'load', 'Your workspace could not be loaded. Try again before making changes.');
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
  return { ...decodeRecords(raw), ready, error, run, retry };
}
