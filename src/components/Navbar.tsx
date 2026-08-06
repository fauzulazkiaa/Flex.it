import React from 'react';
import Image from 'next/image';
import {
  Plus,
  FolderKanban,
  LayoutDashboard,
  TableProperties,
  Settings,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  activeTab: 'dashboard' | 'table';
  setActiveTab: (tab: 'dashboard' | 'table') => void;
  onOpenNewActivity: () => void;
  onOpenSettings: () => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  availableYears: number[];
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewActivity,
  onOpenSettings,
  selectedYear,
  setSelectedYear,
  availableYears,
  selectedMonth,
  setSelectedMonth,
}) => {
  return (
    <header className="glass border-b border-zinc-800/80 sticky top-0 z-30 shadow-md">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Flex.it Logo" width={40} height={40} className="w-10 h-10 object-contain rounded-xl shadow-lg border border-zinc-800/60 bg-white" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-zinc-100 text-lg tracking-tight leading-tight">
                  Flex.it
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                  <Sparkles className="w-3 h-3 mr-1 text-indigo-400" />
                  Full-Stack
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Pelacak Kegiatan, Kompetisi & Arsip Berkas
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center bg-[#121215] p-1 rounded-xl border border-zinc-800">
            <button
              id="btn-tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeTab === 'dashboard'
                ? 'bg-zinc-800 text-indigo-400 border border-zinc-700/60 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-100'
                }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              id="btn-tab-table"
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeTab === 'table'
                ? 'bg-zinc-800 text-indigo-400 border border-zinc-700/60 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-100'
                }`}
            >
              <TableProperties className="w-4 h-4" />
              <span>Daftar & Filter</span>
            </button>
          </nav>

          {/* Action Buttons & Year Selector */}
          <div className="flex items-center gap-2">

            {/* Filter Group */}
            <div className="hidden lg:flex items-center gap-2 bg-[#121215] px-2.5 py-1.5 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-zinc-400 font-medium">Bulan:</span>
                <select
                  id="select-navbar-month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent font-semibold text-zinc-200 outline-none cursor-pointer"
                >
                  <option value="ALL" className="bg-zinc-900 text-zinc-100">Semua</option>
                  <option value="0" className="bg-zinc-900 text-zinc-100">Januari</option>
                  <option value="1" className="bg-zinc-900 text-zinc-100">Februari</option>
                  <option value="2" className="bg-zinc-900 text-zinc-100">Maret</option>
                  <option value="3" className="bg-zinc-900 text-zinc-100">April</option>
                  <option value="4" className="bg-zinc-900 text-zinc-100">Mei</option>
                  <option value="5" className="bg-zinc-900 text-zinc-100">Juni</option>
                  <option value="6" className="bg-zinc-900 text-zinc-100">Juli</option>
                  <option value="7" className="bg-zinc-900 text-zinc-100">Agustus</option>
                  <option value="8" className="bg-zinc-900 text-zinc-100">September</option>
                  <option value="9" className="bg-zinc-900 text-zinc-100">Oktober</option>
                  <option value="10" className="bg-zinc-900 text-zinc-100">November</option>
                  <option value="11" className="bg-zinc-900 text-zinc-100">Desember</option>
                </select>
              </div>

              <div className="w-px h-4 bg-zinc-700"></div>

              <div className="flex items-center gap-1 text-xs">
                <span className="text-zinc-400 font-medium">Tahun:</span>
                <select
                  id="select-navbar-year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-transparent font-semibold text-zinc-200 outline-none cursor-pointer"
                >
                  <option value="ALL" className="bg-zinc-900 text-zinc-100">Semua</option>
                  {availableYears.map((y) => (
                    <option key={y} value={y.toString()} className="bg-zinc-900 text-zinc-100">
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Manage Settings (Settings Hub) */}
            <button
              id="btn-manage-settings"
              onClick={onOpenSettings}
              title="Pengaturan"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#121215] text-zinc-300 border border-zinc-800 hover:bg-zinc-800 transition cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pengaturan</span>
            </button>

            {/* Primary CRUD Add Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1.99 }}
              id="btn-add-activity"
              onClick={onOpenNewActivity}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 border border-indigo-400/30 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kegiatan</span>
            </motion.button>

          </div>

        </div>
      </div>
    </header>
  );
};

