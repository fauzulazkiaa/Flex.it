'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ background: 'black', color: 'red', padding: '20px', fontFamily: 'monospace' }}>
          <h2>CRITICAL APP CRASH</h2>
          <p>{error.message}</p>
          <pre>{error.stack}</pre>
        </div>
      </body>
    </html>
  );
}
