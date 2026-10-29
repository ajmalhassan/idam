import { useState } from 'react';
import { Button, Field, TextField } from '@pane-ui/react';
import { DEFAULT_SHORTCUTS } from './model.js';
import { setupUpdates } from './lifecycle.js';
import { store } from './storage.js';
import { Brand } from './Brand.jsx';
import { MetroTheme } from './MetroTheme.jsx';
import { Icon } from './Icon.jsx';
export function Onboarding({
  run,
  error,
  retry,
  revisit = false,
  settings = {},
  shortcuts = [],
  onComplete,
  onCancel,
}) {
  const [step, setStep] = useState(0),
    [name, setName] = useState(settings.name || ''),
    [accent, setAccent] = useState(settings.accent || 'blue');
  const existing = shortcuts.map((s) => s.id);
  const [selected, setSelected] = useState(
      revisit ? existing : ['mail', 'github', 'calendar', 'figma'],
    ),
    [busy, setBusy] = useState(false);
  const finish = async () => {
    setBusy(true);
    await run(async () => {
      const raw = await store.get();
      const updates = setupUpdates(raw, { name, accent, selected }, { revisit });
      if (Object.keys(updates).length) await store.set(updates);
      onComplete?.();
    }, 'setup');
    setBusy(false);
  };
  return (
    <MetroTheme accent={accent}>
      <main className="workspace onboarding">
        <div className="topline">
          <Brand />
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
            {error} <Button onClick={retry}>Try again</Button>
          </div>
        )}
        <div className="setup-content" key={step}>
          <p className="eyebrow">
            {step === 0 ? 'A LITTLE SPACE FOR YOUR DAY' : 'YOUR EVERYDAY ESSENTIALS'}
          </p>
          <h1>
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
                setStep(1);
              }}
            >
              <Field label="What should we call you?" description="Optional">
                <TextField
                  className="setup-name"
                  placeholder="Your name"
                  value={name}
                  maxLength={40}
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
                <Button type="submit" variant="accent">
                  Make it mine <Icon name="arrow" />
                </Button>
                <span>You can change this anytime.</span>
              </div>
            </form>
          ) : (
            <>
              {revisit && (
                <p className="setup-caption">
                  Existing shortcuts stay as they are. Add more here; edit or remove them from home.
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
                <Button variant="accent" onClick={finish} loading={busy}>
                  Open my start page <Icon name="arrow" />
                </Button>
                <Button variant="subtle" disabled={busy} onClick={() => setStep(0)}>
                  Back
                </Button>
              </div>
              <p className="setup-caption">
                {DEFAULT_SHORTCUTS.filter((s) => selected.includes(s.id)).length} shortcuts selected
              </p>
            </>
          )}
          <p className="setup-caption">Saved on this device. No account needed.</p>
          <div className="setup-progress" aria-label={'Setup step ' + (step + 1) + ' of 2'}>
            <i className={step === 0 ? 'active' : ''} />
            <i className={step === 1 ? 'active' : ''} />
          </div>
        </div>
      </main>
    </MetroTheme>
  );
}
