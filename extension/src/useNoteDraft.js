import { useEffect, useRef, useState } from 'react';
import { store } from './storage.js';
import { PREFIX } from './model.js';

// Owns debounce, write ordering, retries and visibility flushing for the scratchpad.
export function useNoteDraft(value, run) {
  const [draft, setDraft] = useState(value),
    [status, setStatus] = useState('Saved on this device');
  const current = useRef(value),
    dirty = useRef(false),
    timer = useRef(),
    chain = useRef(Promise.resolve()),
    runRef = useRef(run);
  runRef.current = run;
  useEffect(() => {
    if (!dirty.current) {
      current.current = value;
      setDraft(value);
    }
  }, [value]);
  const flush = () => {
    clearTimeout(timer.current);
    if (!dirty.current) return;
    const text = current.current;
    setStatus('Saving…');
    chain.current = chain.current
      .then(() =>
        runRef.current(async () => {
          // A retry of an older draft must never overwrite a newer local edit.
          if (current.current !== text) return;
          await store.set({ [PREFIX + 'notes']: text });
          if (current.current === text) {
            dirty.current = false;
            setStatus('Saved on this device');
          }
        }, 'notes'),
      )
      .then((ok) => {
        if (!ok) setStatus('Not saved. Try again.');
      });
  };
  useEffect(() => {
    const onHidden = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onHidden);
    return () => {
      clearTimeout(timer.current);
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onHidden);
    };
  }, []);
  const updateDraft = (text) => {
    setDraft(text);
    current.current = text;
    dirty.current = true;
    setStatus('Unsaved');
    clearTimeout(timer.current);
    timer.current = setTimeout(flush, 200);
  };
  return { draft, status, updateDraft, flush };
}
