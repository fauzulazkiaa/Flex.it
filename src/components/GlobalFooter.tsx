import React from 'react';
import { Trophy } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const GlobalFooter = () => {
  return (
    <footer className="border-t border-zinc-900 bg-black pt-16 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 pb-16">
        {/* Sisi Kiri (Brand Statement) */}
        <div className="space-y-4 max-w-sm">
          <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Flex.it Logo" width={24} height={24} className="w-6 h-6 object-contain rounded" />
            <span className="font-extrabold text-zinc-200 text-sm tracking-tight">Flex.it</span>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Flex.it adalah pusat data portofolio yang valid no debat.
          </p>
          <p className="text-xs text-zinc-500">
            Developed by <a href="https://www.linkedin.com/in/fauzul-azkia/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">Fauzul Azkia</a>
          </p>
        </div>

        {/* Sisi Kanan (Kolom Navigasi) */}
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase">NAVIGASI</span>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="text-zinc-400 hover:text-emerald-400 transition-colors">Dashboard</Link></li>
              <li><Link href="/#features" className="text-zinc-400 hover:text-emerald-400 transition-colors">Fitur</Link></li>
              <li><Link href="/" className="text-zinc-400 hover:text-emerald-400 transition-colors">Roadmap</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase">LEGAL</span>
            <ul className="space-y-2 text-xs">
              <li><Link href="/privacy" className="text-zinc-400 hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-zinc-400 hover:text-emerald-400 transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase">SOSIAL</span>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://www.instagram.com/fauzulazkiaa/?hl=id" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-emerald-400 transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/fauzul-azkia/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-emerald-400 transition-colors">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bagian Bawah (Oversized Typography) */}
      <div className="max-w-7xl mx-auto px-6 border-t border-zinc-900/60 pt-8 relative overflow-hidden select-none">
        <div className="relative flex justify-center items-center">
          <span className="absolute top-0 right-4 sm:right-8 text-2xl sm:text-4xl text-zinc-600 font-light select-none">©</span>
          <h1 className="text-[14vw] font-black tracking-tighter leading-none text-zinc-800/80 uppercase select-none w-full text-center">
            FLEX.IT
          </h1>
        </div>
      </div>
    </footer>
  );
};
