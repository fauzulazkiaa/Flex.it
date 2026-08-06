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
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-red-500 p-8 text-center font-mono">
      <h2 className="text-2xl font-bold mb-4">Aplikasi Mengalami Crash di Browser!</h2>
      <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl max-w-2xl w-full text-left overflow-auto">
        <p className="font-bold text-white mb-2">Pesan Error:</p>
        <p className="text-red-400 mb-4">{error.message || "Unknown error"}</p>
        {error.stack && (
          <>
            <p className="font-bold text-white mb-2">Stack Trace:</p>
            <pre className="text-xs text-red-300 whitespace-pre-wrap">{error.stack}</pre>
          </>
        )}
      </div>
      <button
        className="mt-6 px-6 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition"
        onClick={() => reset()}
      >
        Coba Muat Ulang (Refresh)
      </button>
    </div>
  );
}
