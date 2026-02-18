'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    });
  }, [error]);

  return (
    <html lang="de">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backgroundColor: '#fff',
          color: '#0a0a1a',
        }}
      >
        <div style={{ textAlign: 'center', padding: '2rem' }} role="alert" aria-live="assertive">
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Ein kritischer Fehler ist aufgetreten
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', maxWidth: '28rem' }}>
            Die Anwendung konnte nicht geladen werden. Bitte versuchen Sie es erneut.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '0.625rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#fff',
              backgroundColor: '#ea580c',
              cursor: 'pointer',
              border: 'none',
              borderRadius: '0.5rem',
            }}
          >
            Seite neu laden
          </button>
          {error.digest && (
            <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#9ca3af' }}>
              Fehler-ID: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
