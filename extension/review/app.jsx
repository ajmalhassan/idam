import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@pane-ui/react/styles.css';
import '../src/app.css';
import '@pane-ui/react/motion.css';
import '../src/motion.css';
import './review.css';
import { App } from '../src/AppShell.jsx';
import { store } from './storage.js';
import { setupUpdates } from '../src/lifecycle.js';

function Review() {
  const [run, setRun] = useState(0);
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState('welcome');
  const replay = async (returning = false) => {
    store.reset();
    if (returning)
      await store.set(
        setupUpdates(
          {},
          {
            name: 'Ajmal',
            accent: 'blue',
            selected: ['mail', 'github', 'calendar', 'drive', 'figma', 'music'],
          },
        ),
      );
    setMode(returning ? 'home' : 'welcome');
    setRun((value) => value + 1);
    setStarted(true);
  };
  return (
    <>
      <div className="review-bar">
        <a href="./index.html">
          IDAM <span>motion study / 01</span>
        </a>
        <div>
          <button onClick={() => replay()}>Replay welcome</button>
          <button onClick={() => replay(true)}>Everyday entrance</button>
        </div>
      </div>
      {started ? (
        <div className="review-stage" key={run} data-review-mode={mode}>
          <App />
        </div>
      ) : (
        <main className="review-cover">
          <p className="eyebrow">A LITTLE CEREMONY. YOUR OWN SPACE.</p>
          <h1>
            make an
            <br />
            entrance<span>.</span>
          </h1>
          <p className="review-lede">From four small tiles to a place that feels like yours.</p>
          <button className="review-start" onClick={() => replay()}>
            Experience the welcome <span>↗</span>
          </button>
          <ol className="flow-map">
            <li>
              <span>01 / 980 ms</span>
              <strong>Idam appears</strong>
              <p>Four tiles turn into place. The name resolves. The mark finds its home.</p>
            </li>
            <li>
              <span>02 / YOUR PACE</span>
              <strong>Make it yours</strong>
              <p>Your name and your accent. Each choice is optional.</p>
            </li>
            <li>
              <span>03 / 440 ms TURN</span>
              <strong>Familiar places</strong>
              <p>A turnstile reveals your shortcuts. Choose what belongs.</p>
            </li>
            <li>
              <span>04 / 600 ms ARRIVAL</span>
              <strong>Welcome home</strong>
              <p>Your tiles unfold. A priority, your tasks, and room for a thought.</p>
            </li>
          </ol>
          <p className="review-footnote">
            This preview uses temporary data. Your installed Idam workspace is untouched. Reduced
            motion follows your system setting.
          </p>
        </main>
      )}
    </>
  );
}
createRoot(document.getElementById('root')).render(<Review />);
