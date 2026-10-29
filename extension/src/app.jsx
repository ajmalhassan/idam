import { createRoot } from 'react-dom/client';
import '@pane-ui/react/styles.css';
import './app.css';
import { App } from './AppShell.jsx';
createRoot(document.getElementById('root')).render(<App />);
