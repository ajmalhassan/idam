import { useLayoutEffect, useRef } from 'react';
import { Button } from '@pane-ui/react';
import { Brand } from './Brand.jsx';

export function BrandReveal({ targetRef, onComplete }) {
  const lockup = useRef(null);
  const complete = useRef(onComplete);
  complete.current = onComplete;
  useLayoutEffect(() => {
    const node = lockup.current;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let done = false;
    const animations = [];
    const finish = () => {
      if (done) return;
      done = true;
      complete.current();
    };
    const settlePreference = () => {
      if (media.matches) finish();
    };
    const settleHidden = () => {
      if (document.hidden) finish();
    };
    media.addEventListener('change', settlePreference);
    document.addEventListener('visibilitychange', settleHidden);
    window.addEventListener('resize', finish);
    if (media.matches || document.hidden || !node.animate) finish();
    else {
      try {
        node.querySelectorAll('.mark i').forEach((tile, index) => {
          animations.push(
            tile.animate(
              [
                { opacity: 0, transform: 'perspective(500px) rotateY(-78deg) translateY(12px)' },
                { opacity: 1, transform: 'none' },
              ],
              {
                duration: 380,
                delay: index * 55,
                easing: 'cubic-bezier(.16,1,.3,1)',
                fill: 'both',
              },
            ),
          );
        });
        animations.push(
          node.querySelector('.brand-name').animate(
            [
              { opacity: 0, transform: 'translateX(12px)' },
              { opacity: 1, transform: 'none' },
            ],
            { duration: 320, delay: 220, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' },
          ),
        );
        const from = node.getBoundingClientRect();
        const to = targetRef.current.getBoundingClientRect();
        const docking = node.animate(
          [
            { transform: 'translate(0,0) scale(1)' },
            {
              transform: `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${to.height / from.height})`,
            },
          ],
          { duration: 360, delay: 620, easing: 'cubic-bezier(.65,0,.2,1)', fill: 'both' },
        );
        animations.push(docking);
        void docking.finished.then(finish, finish);
      } catch {
        finish();
      }
    }
    return () => {
      done = true;
      animations.forEach((animation) => animation.cancel());
      media.removeEventListener('change', settlePreference);
      document.removeEventListener('visibilitychange', settleHidden);
      window.removeEventListener('resize', finish);
    };
  }, [targetRef]);
  return (
    <div className="brand-reveal" aria-label="Welcome to Idam">
      <div className="reveal-lockup" ref={lockup}>
        <Brand />
      </div>
      <Button className="skip-intro quiet-button" variant="subtle" onClick={onComplete}>
        Skip intro
      </Button>
    </div>
  );
}
