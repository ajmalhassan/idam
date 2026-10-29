export const createJourney = (revisit = false) => ({
  step: 0,
  phase: revisit ? 'preparing' : 'intro',
  target: null,
  direction: 'forward',
});
export function journeyReducer(state, action) {
  switch (action.type) {
    case 'INTRO_DONE':
      return state.phase === 'intro' ? { ...state, phase: 'begin' } : state;
    case 'BEGIN':
      return state.phase === 'begin' ? { ...state, phase: 'docking' } : state;
    case 'DOCKED':
      return state.phase === 'docking' ? { ...state, phase: 'preparing' } : state;
    case 'PREPARED':
      return state.phase === 'preparing' ? { ...state, phase: 'entering' } : state;
    case 'ENTERED':
      return state.phase === 'entering' ? { ...state, phase: 'ready' } : state;
    case 'GO':
      return state.phase === 'ready' && [0, 1].includes(action.step) && action.step !== state.step
        ? {
            ...state,
            phase: 'exiting',
            target: action.step,
            direction: action.step > state.step ? 'forward' : 'backward',
          }
        : state;
    case 'SAVE':
      return state.phase === 'ready' ? { ...state, phase: 'saving' } : state;
    case 'SAVED':
      return state.phase === 'saving'
        ? { ...state, phase: 'exiting', target: 'home', direction: 'forward' }
        : state;
    case 'FAILED':
      return state.phase === 'saving' ? { ...state, phase: 'ready' } : state;
    case 'EXITED':
      return state.phase === 'exiting'
        ? {
            ...state,
            phase: state.target === 'home' ? 'complete' : 'preparing',
            step: state.target === 'home' ? state.step : state.target,
            target: null,
          }
        : state;
    default:
      return state;
  }
}
