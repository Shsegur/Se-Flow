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

if ('serviceWorker' in navigator && window.isSecureContext && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch((error) => {
      console.error('SW register error', error);
    });
  });
} else if ('serviceWorker' in navigator && import.meta.env.DEV) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister().catch(() => undefined));
  }).catch(() => undefined);
}
