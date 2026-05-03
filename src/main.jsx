import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', padding: '20px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
    Iniciando Se-Flow...
  </div>
);

async function boot() {
  try {
    const { default: App } = await import('./App.jsx');
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    root.render(
      <div style={{ minHeight: '100vh', background: '#111827', color: '#f9fafb', padding: '20px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
        {'Se-Flow bootstrap error:\n' + (error?.stack || error?.message || String(error))}
      </div>
    );
  }
}

boot();
