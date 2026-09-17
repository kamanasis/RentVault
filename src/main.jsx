import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { initGlobalErrorListeners } from './services/monitoring';

// Initialize production error monitoring
initGlobalErrorListeners();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
