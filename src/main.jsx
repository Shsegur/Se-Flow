import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error('Se-Flow render error:', error);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <div style={{ width: '100%', maxWidth: '720px', background: '#ffffff', border: '1px solid #fecdd3', borderRadius: '24px', padding: '24px', boxShadow: '0 10px 30px rgba(15,23,42,0.08)' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#e11d48', marginBottom: '10px' }}>
              Error de interfaz
            </div>
            <div style={{ fontSize: '13px', lineHeight: 1.6, color: '#475569', whiteSpace: 'pre-wrap' }}>
              {this.state.error?.message || String(this.state.error)}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const root = createRoot(document.getElementById('root'));
root.render(
  <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, system-ui, sans-serif' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: '36px', height: '36px', border: '3px solid #cbd5e1', borderTopColor: '#2563eb', borderRadius: '999px', animation: 'seflow-spin 1s linear infinite' }} />
      <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b' }}>
        Cargando Se-Flow
      </div>
    </div>
  </div>
);

async function boot() {
  try {
    const { default: App } = await import('./App.jsx');
    root.render(
      <React.StrictMode>
        <AppErrorBoundary>
          <App />
        </AppErrorBoundary>
      </React.StrictMode>
    );
  } catch (error) {
    root.render(
      <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ width: '100%', maxWidth: '720px', background: '#ffffff', border: '1px solid #fecdd3', borderRadius: '24px', padding: '24px', boxShadow: '0 10px 30px rgba(15,23,42,0.08)' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#e11d48', marginBottom: '10px' }}>
            Error al iniciar Se-Flow
          </div>
          <div style={{ fontSize: '13px', lineHeight: 1.6, color: '#475569', whiteSpace: 'pre-wrap' }}>
            {error?.message || String(error)}
          </div>
        </div>
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
