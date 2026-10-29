import { createRoot } from 'react-dom/client';
import '@pane-ui/react/styles.css';
import './app.css';
import '@pane-ui/react/motion.css';
import './motion.css';
import { App } from './AppShell.jsx';
createRoot(document.getElementById('root')).render(<App />);
