import { useState, useReducer, useRef, useLayoutEffect, useEffect } from 'react';
import { Button, TextField, Transition, Stagger } from '@pane-ui/react';
import { DEFAULT_SHORTCUTS, ACCENTS } from './model.js';
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
  const nameField = useRef(null);
  const saving = useRef(false);
  const [name, setName] = useState(settings.name || ''),
    [accent, setAccent] = useState(settings.accent || 'blue');
  const existing = shortcuts.map((s) => s.id);
  const [selected, setSelected] = useState(
    revisit ? existing : ['mail', 'github', 'calendar', 'figma'],
  );
  const busy = phase !== 'ready';
  const brandScreen = ['intro', 'begin', 'docking'].includes(phase);
  useLayoutEffect(() => {
    if (phase === 'preparing') dispatch({ type: 'PREPARED' });
  }, [phase]);
  useEffect(() => {
    if (phase === 'complete') onComplete?.();
  }, [phase, onComplete]);
  const entered = () => {
    dispatch({ type: 'ENTERED' });
    if (document.activeElement === document.body || !document.activeElement?.closest('input')) {
      (step === 0 ? nameField : heading).current?.focus({ preventScroll: true });
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
      <main className="workspace onboarding" data-journey-phase={phase} data-setup-step={step}>
        <div className="topline">
          <div ref={brandTarget} className={brandScreen ? 'brand-destination' : undefined}>
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
        {brandScreen && (
          <BrandReveal
            phase={phase}
            targetRef={brandTarget}
            onRevealed={() => dispatch({ type: 'INTRO_DONE' })}
            onBegin={() => dispatch({ type: 'BEGIN' })}
            onComplete={() => dispatch({ type: 'DOCKED' })}
          />
        )}
        <Transition
          show={['entering', 'ready', 'saving'].includes(phase)}
          preset="turnstile"
          direction={direction}
          duration={reduced ? 0 : phase === 'exiting' ? 340 : 520}
          onEntered={entered}
          onExited={() => dispatch({ type: 'EXITED' })}
        >
          <Stagger
            show
            className={`setup-content ${step === 0 ? 'name-step' : 'places-step'}`}
            key={step}
            interval={60}
          >
            <p className="eyebrow">
              {step === 0 ? 'FIRST, A LITTLE HELLO' : 'MAKE THIS SPACE YOURS'}
            </p>
            <h1 ref={heading} tabIndex={-1}>
              {step === 0 ? 'what should we call you' : 'familiar places'}
              <span>{step === 0 ? '?' : '.'}</span>
            </h1>
            <p className="setup-intro">
              {step === 0
                ? 'A name makes it feel a little more like home.'
                : 'Choose your everyday places. Find a color that feels like you.'}
            </p>
            {step === 0 ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  dispatch({ type: 'GO', step: 1 });
                }}
              >
                <TextField
                  ref={nameField}
                  className="setup-name"
                  aria-label="Your name"
                  aria-describedby="name-optional"
                  placeholder="Your name"
                  value={name}
                  maxLength={40}
                  disabled={phase === 'saving'}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="given-name"
                />
                <p id="name-optional" className="setup-caption">
                  Optional. This stays on your device.
                </p>
                <div className="setup-actions">
                  <Button type="submit" variant="accent" disabled={busy}>
                    Continue <Icon name="arrow" />
                  </Button>
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
                <fieldset className="accent-options">
                  <legend>Make it your color</legend>
                  <div className="swatches">
                    {ACCENTS.map((color) => (
                      <Button
                        key={color}
                        type="button"
                        className={'swatch swatch-' + color}
                        disabled={busy}
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
                <div className="setup-shortcuts">
                  {DEFAULT_SHORTCUTS.map((s, index) => (
                    <Button
                      className="setup-choice"
                      style={{ '--color-delay': `${index * 55}ms` }}
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
