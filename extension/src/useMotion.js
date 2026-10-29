import { useEffect, useLayoutEffect, useState } from 'react';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

// Pane presence skips entrance on an initially visible mount. Begin hidden, then
// change show before paint. Reduced-motion users receive the settled content.
export function useEntrance() {
  const reduced = useReducedMotion();
  const [show, setShow] = useState(reduced);
  useLayoutEffect(() => setShow(true), []);
  return show;
}
