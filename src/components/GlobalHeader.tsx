import React from 'react';
import { Trophy } from 'lucide-react';
import Link from 'next/link';

export const GlobalHeader = () => {
  return (
    <header className="border-b border-zinc-900 bg-[#030303]/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-black flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
            <Trophy className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-zinc-100 text-lg tracking-tight">
            Flex.it
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
            v1.0 Beta
          </span>
          <a 
            href="/sign-in"
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-zinc-900 bg-emerald-400 hover:bg-emerald-300 transition-all cursor-pointer shadow-md shadow-emerald-500/10 flex items-center justify-center"
          >
            Sign In
          </a>
        </div>
      </div>
    </header>
  );
};
