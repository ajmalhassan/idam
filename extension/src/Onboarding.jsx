import { useState, useReducer, useRef, useLayoutEffect, useEffect } from 'react';
import { Button, Field, TextField, Transition, Stagger } from '@pane-ui/react';
import { DEFAULT_SHORTCUTS } from './model.js';
import { setupUpdates } from './lifecycle.js';
import { store } from './storage.js';
import { Brand } from './Brand.jsx';
import { MetroTheme } from './MetroTheme.jsx';
import { Icon } from './Icon.jsx';
import { BrandReveal } from './BrandReveal.jsx';
import { createJourney, journeyReducer } from './journey.js';
import { useReducedMotion } from './useMotion.js';
export function Onboarding({
  run,
  error,
  revisit = false,
  settings = {},
  shortcuts = [],
  onComplete,
  onCancel,
}) {
  const [journey, dispatch] = useReducer(journeyReducer, revisit, createJourney);
  const { step, phase, direction } = journey;
  const reduced = useReducedMotion();
  const brandTarget = useRef(null);
  const heading = useRef(null);
  const saving = useRef(false);
  const [name, setName] = useState(settings.name || ''),
    [accent, setAccent] = useState(settings.accent || 'blue');
  const existing = shortcuts.map((s) => s.id);
  const [selected, setSelected] = useState(
    revisit ? existing : ['mail', 'github', 'calendar', 'figma'],
  );
  const busy = phase !== 'ready';
  useLayoutEffect(() => {
    if (phase === 'preparing') dispatch({ type: 'PREPARED' });
  }, [phase]);
  useEffect(() => {
    if (phase === 'complete') onComplete?.();
  }, [phase, onComplete]);
  const entered = () => {
    dispatch({ type: 'ENTERED' });
    if (document.activeElement === document.body || !document.activeElement?.closest('input')) {
      heading.current?.focus({ preventScroll: true });
    }
  };
  const finish = async () => {
    if (busy || saving.current) return;
    saving.current = true;
    dispatch({ type: 'SAVE' });
    const succeeded = await run(async () => {
      const raw = await store.get();
      const updates = setupUpdates(raw, { name, accent, selected }, { revisit });
      if (Object.keys(updates).length) await store.set(updates);
    }, 'setup');
    saving.current = false;
    dispatch({ type: succeeded ? 'SAVED' : 'FAILED' });
  };
  return (
    <MetroTheme accent={accent}>
      <main className="workspace onboarding" data-journey-phase={phase}>
        <div className="topline">
          <div ref={brandTarget} className={phase === 'intro' ? 'brand-destination' : undefined}>
            <Brand />
          </div>
          <Button
            variant="subtle"
            className="quiet-button"
            disabled={busy}
            onClick={revisit ? onCancel : finish}
          >
            {revisit ? 'Back to home' : 'Skip setup'}
          </Button>
        </div>
        {error && (
          <div className="save-error" role="alert">
            {error}{' '}
            <Button onClick={finish} disabled={busy}>
              Try again
            </Button>
          </div>
        )}
        {phase === 'intro' && (
          <BrandReveal
            targetRef={brandTarget}
            onComplete={() => dispatch({ type: 'INTRO_DONE' })}
          />
        )}
        <Transition
          show={['entering', 'ready', 'saving'].includes(phase)}
          preset="turnstile"
          direction={direction}
          duration={reduced ? 0 : phase === 'exiting' ? 180 : 260}
          onEntered={entered}
          onExited={() => dispatch({ type: 'EXITED' })}
        >
          <Stagger show className="setup-content" key={step} interval={35}>
            <p className="eyebrow">
              {step === 0 ? 'A LITTLE SPACE FOR YOUR DAY' : 'YOUR EVERYDAY ESSENTIALS'}
            </p>
            <h1 ref={heading} tabIndex={-1}>
              {step === 0 ? (
                <>
                  make yourself
                  <br />
                  at home
                </>
              ) : (
                <>
                  familiar
                  <br />
                  places
                </>
              )}
              <span>.</span>
            </h1>
            <p className="setup-intro">
              {step === 0 ? (
                <>
                  Your places, a clear priority, and room to think.
                  <br />
                  Start with a few things that feel like you.
                </>
              ) : (
                <>
                  Choose a few shortcuts to start with.
                  <br />
                  Add your own websites whenever you like.
                </>
              )}
            </p>
            {step === 0 ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  dispatch({ type: 'GO', step: 1 });
                }}
              >
                <Field label="What should we call you?" description="Optional">
                  <TextField
                    className="setup-name"
                    placeholder="Your name"
                    value={name}
                    maxLength={40}
                    disabled={phase === 'saving'}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="off"
                  />
                </Field>
                <fieldset className="accent-options">
                  <legend>Pick your accent</legend>
                  <div className="swatches">
                    {(revisit
                      ? ['blue', 'violet', 'magenta', 'teal', 'orange', 'green']
                      : ['blue', 'violet', 'magenta', 'teal']
                    ).map((color) => (
                      <Button
                        key={color}
                        type="button"
                        className={'swatch swatch-' + color}
                        disabled={phase === 'saving'}
                        aria-label={color}
                        aria-pressed={accent === color}
                        onClick={() => setAccent(color)}
                      >
                        {accent === color ? (
                          <Icon name="check" />
                        ) : (
                          <span aria-hidden="true">&nbsp;</span>
                        )}
                      </Button>
                    ))}
                  </div>
                </fieldset>
                <div className="setup-actions">
                  <Button type="submit" variant="accent" disabled={busy}>
                    Make it mine <Icon name="arrow" />
                  </Button>
                  <span>You can change this anytime.</span>
                </div>
              </form>
            ) : (
              <>
                {revisit && (
                  <p className="setup-caption">
                    Existing shortcuts stay as they are. Add more here; edit or remove them from
                    home.
                  </p>
                )}
                <div className="setup-shortcuts">
                  {DEFAULT_SHORTCUTS.map((s) => (
                    <Button
                      className="setup-choice"
                      key={s.id}
                      aria-pressed={selected.includes(s.id)}
                      disabled={busy || (revisit && existing.includes(s.id))}
                      onClick={() =>
                        setSelected((list) =>
                          list.includes(s.id) ? list.filter((id) => id !== s.id) : [...list, s.id],
                        )
                      }
                    >
                      <Icon name={s.icon} />
                      <span>{s.title}</span>
                      {selected.includes(s.id) && (
                        <span className="choice-check" aria-hidden="true">
                          ✓
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
                <div className="setup-actions">
                  <Button
                    variant="accent"
                    onClick={finish}
                    loading={phase === 'saving'}
                    disabled={busy}
                  >
                    Open my start page <Icon name="arrow" />
                  </Button>
                  <Button
                    variant="subtle"
                    disabled={busy}
                    onClick={() => dispatch({ type: 'GO', step: 0 })}
                  >
                    Back
                  </Button>
                </div>
                <p className="setup-caption">
                  {DEFAULT_SHORTCUTS.filter((s) => selected.includes(s.id)).length} shortcuts
                  selected
                </p>
              </>
            )}
            <p className="setup-caption">Saved on this device. No account needed.</p>
            <div className="setup-progress" aria-label={'Setup step ' + (step + 1) + ' of 2'}>
              <i className={step === 0 ? 'active' : ''} />
              <i className={step === 1 ? 'active' : ''} />
            </div>
          </Stagger>
        </Transition>
      </main>
    </MetroTheme>
  );
}
