import test from 'node:test';
import assert from 'node:assert/strict';
import { createJourney, journeyReducer as reduce } from '../src/journey.js';
const ready = () => reduce(reduce(createJourney(true), { type: 'PREPARED' }), { type: 'ENTERED' });

test('intro completion waits at Begin; only Begin starts the name screen', () => {
  const initial = createJourney(false);
  assert.equal(initial.phase, 'intro');
  const next = reduce(initial, { type: 'INTRO_DONE' });
  assert.equal(next.phase, 'begin');
  assert.equal(reduce(next, { type: 'PREPARED' }), next);
  assert.equal(reduce(next, { type: 'SAVE' }), next);
  const docking = reduce(next, { type: 'BEGIN' });
  assert.equal(docking.phase, 'docking');
  assert.equal(reduce(docking, { type: 'BEGIN' }), docking);
  assert.equal(reduce(docking, { type: 'DOCKED' }).phase, 'preparing');
  assert.equal(next.step, 0);
  assert.equal(reduce(next, { type: 'SAVED' }), next);
});
test('revisit bypasses intro; step transitions ignore rapid navigation and reverse on Back', () => {
  let state = ready();
  state = reduce(state, { type: 'GO', step: 1 });
  assert.equal(state.phase, 'exiting');
  assert.equal(state.step, 0);
  assert.equal(reduce(state, { type: 'GO', step: 0 }), state);
  state = reduce(state, { type: 'EXITED' });
  assert.equal(state.step, 1);
  assert.equal(state.phase, 'preparing');
  state = reduce(reduce(state, { type: 'PREPARED' }), { type: 'ENTERED' });
  state = reduce(state, { type: 'GO', step: 0 });
  assert.equal(state.direction, 'backward');
  state = reduce(state, { type: 'EXITED' });
  assert.equal(state.step, 0);
});
test('save must succeed before home departure; failures allow retry', () => {
  let state = reduce(ready(), { type: 'SAVE' });
  assert.equal(state.phase, 'saving');
  assert.equal(reduce(state, { type: 'GO', step: 1 }), state);
  state = reduce(state, { type: 'FAILED' });
  assert.equal(state.phase, 'ready');
  state = reduce(reduce(state, { type: 'SAVE' }), { type: 'SAVED' });
  assert.equal(state.phase, 'exiting');
  assert.equal(state.target, 'home');
  state = reduce(state, { type: 'EXITED' });
  assert.equal(state.phase, 'complete');
});
test('stale callbacks and invalid destinations cannot advance the journey', () => {
  const state = ready();
  for (const action of [{ type: 'EXITED' }, { type: 'SAVED' }, { type: 'GO', step: 9 }]) {
    assert.equal(reduce(state, action), state);
  }
});
