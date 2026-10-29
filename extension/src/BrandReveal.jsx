import { useLayoutEffect, useRef } from 'react';
import { Button } from '@pane-ui/react';
import { Brand } from './Brand.jsx';
import { Icon } from './Icon.jsx';

export function BrandReveal({ phase, targetRef, onRevealed, onBegin, onComplete }) {
  const lockup = useRef(null);
  const callbacks = useRef({ onRevealed, onComplete });
  callbacks.current = { onRevealed, onComplete };
  useLayoutEffect(() => {
    if (phase === 'begin') return;
    const node = lockup.current;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let done = false;
    const animations = [];
    const finish = () => {
      if (done) return;
      done = true;
      callbacks.current[phase === 'intro' ? 'onRevealed' : 'onComplete']();
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
        if (phase === 'intro') {
          node.querySelectorAll('.mark i').forEach((tile, index) => {
            animations.push(
              tile.animate(
                [
                  { opacity: 0, transform: 'perspective(500px) rotateY(-78deg) translateY(16px)' },
                  { opacity: 1, transform: 'none' },
                ],
                {
                  duration: 720,
                  delay: index * 110,
                  easing: 'cubic-bezier(.16,1,.3,1)',
                  fill: 'both',
                },
              ),
            );
          });
          animations.push(
            node.querySelector('.brand-name').animate(
              [
                { opacity: 0, transform: 'translateX(16px)' },
                { opacity: 1, transform: 'none' },
              ],
              { duration: 760, delay: 600, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' },
            ),
          );
        } else {
          const from = node.getBoundingClientRect();
          const to = targetRef.current.getBoundingClientRect();
          animations.push(
            node.animate(
              [
                { transform: 'translate(0,0) scale(1)' },
                {
                  transform: `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${to.height / from.height})`,
                },
              ],
              { duration: 760, easing: 'cubic-bezier(.65,0,.2,1)', fill: 'both' },
            ),
          );
        }
        void Promise.all(
          animations.map((animation) => animation.finished.catch(() => undefined)),
        ).then(finish);
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
  }, [phase, targetRef]);
  return (
    <div className="brand-reveal" data-reveal-phase={phase} aria-label="Welcome to Idam">
      <div className="reveal-center">
        <div className="reveal-lockup" ref={lockup}>
          <Brand />
        </div>
        <div
          className="reveal-invitation"
          inert={phase !== 'begin'}
          aria-hidden={phase !== 'begin'}
        >
          <p>A little space for your day.</p>
          <Button
            variant="accent"
            className="begin-button"
            disabled={phase !== 'begin'}
            onClick={onBegin}
          >
            Begin
            <Icon
              name="forward"
              viewBox="0 0 28 28"
              strokeWidth="2.4"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </Button>
        </div>
      </div>
      {phase === 'intro' && (
        <Button className="skip-intro quiet-button" variant="subtle" onClick={onRevealed}>
          Skip animation
        </Button>
      )}
    </div>
  );
}
