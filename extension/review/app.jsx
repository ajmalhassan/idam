import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@pane-ui/react/styles.css';
import '../src/app.css';
import '@pane-ui/react/motion.css';
import '../src/motion.css';
import '../src/home.css';
import './review.css';
import { App } from '../src/AppShell.jsx';
import { Brand } from '../src/Brand.jsx';
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
          <Brand /> <span className="review-caption">motion study / 02</span>
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
          <p className="review-lede">A roof, two tiles, and a place that feels like yours.</p>
          <button className="review-start" onClick={() => replay()}>
            Experience the welcome <span>↗</span>
          </button>
          <ol className="flow-map">
            <li>
              <span>01 / REVEAL + BEGIN</span>
              <strong>Idam appears</strong>
              <p>
                A roof and two tiles turn into place. The name resolves. Begin appears, ready when
                you are.
              </p>
            </li>
            <li>
              <span>02 / YOUR PACE</span>
              <strong>A little hello</strong>
              <p>A large, centered name prompt. Your name, at your pace.</p>
            </li>
            <li>
              <span>03 / 860 ms TURN</span>
              <strong>Familiar places</strong>
              <p>Choose shortcuts and an accent. Color flows across your tiles.</p>
            </li>
            <li>
              <span>04 / 920 ms ARRIVAL</span>
              <strong>Welcome home</strong>
              <p>Your chosen color comes home. Tiles unfold, with tasks and room to think.</p>
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
