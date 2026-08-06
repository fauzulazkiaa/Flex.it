import React, { useMemo, useState } from 'react';
import { Activity, Category } from '../types';
import { ExternalLink, FolderGit2, Search, Trophy, Calendar, Award, Edit3 } from 'lucide-react';
import { formatDateIndo } from '../utils/storage';

interface LPDPTableProps {
  activities: Activity[];
  categories: Category[];
  onEditActivity: (activity: Activity) => void;
  onSelectActivity?: (activity: Activity) => void;
}

export const LPDPTable: React.FC<LPDPTableProps> = ({ 
  activities, 
  categories,
  onEditActivity,
  onSelectActivity
}) => {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  // Extract unique years from completed activities for filtering
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    activities
      .filter(a => a.status === 'SELESAI')
      .forEach(a => {
        if (a.year) years.add(a.year.toString());
      });
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [activities]);

  const completedActivities = useMemo(() => {
    return activities
      .filter(a => a.status === 'SELESAI')
      .filter(a => {
        // Search Filter
        if (!search) return true;
        const query = search.toLowerCase();
        return (
          a.title.toLowerCase().includes(query) ||
          (a.achievement && a.achievement.toLowerCase().includes(query)) ||
          (a.level && a.level.toLowerCase().includes(query)) ||
          (a.organizer && a.organizer.toLowerCase().includes(query)) ||
          (a.jenisPrestasi && a.jenisPrestasi.toLowerCase().includes(query))
        );
      })
      .filter(a => {
        // Category Filter
        if (!categoryId) return true;
        return a.categoryId === categoryId;
      })
      .filter(a => {
        // Year Filter
        if (!yearFilter) return true;
        return a.year?.toString() === yearFilter;
      })
      .sort((a, b) => {
        // Sort by most recent event date or reg deadline
        const dateA = a.eventDate || a.regDeadline || '';
        const dateB = b.eventDate || b.regDeadline || '';
        return dateB.localeCompare(dateA);
      });
  }, [activities, search, categoryId, yearFilter]);

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full shadow-xl">
      {/* Header & Filter Controls */}
      <div className="p-4 sm:p-5 border-b border-zinc-800/80 bg-[#121215]/40 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 text-zinc-100">
            <h3 className="font-extrabold text-base text-zinc-100">Daftar Rekap Prestasi Selesai</h3>
            <p className="text-[11px] text-zinc-400">Rangkuman seluruh kegiatan yang telah selesai dengan capaian penghargaan.</p>
          </div>
          <div className="text-xs font-semibold text-zinc-400 shrink-0 bg-[#121215] px-3 py-1.5 rounded-xl border border-zinc-800">
            Total Selesai: <span className="font-bold text-indigo-400">{completedActivities.length}</span> Kegiatan
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari prestasi, judul, tingkat, dll..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#121215] border border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 text-zinc-100 placeholder-zinc-500 font-medium"
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-full sm:w-48">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#121215] border border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 text-zinc-100 cursor-pointer font-medium"
            >
              <option value="">Semua Kategori</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Year Dropdown */}
          <div className="w-full sm:w-32">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#121215] border border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 text-zinc-100 cursor-pointer font-medium"
            >
              <option value="">Semua Tahun</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-[#121215]/80 text-zinc-400">
              <th className="py-3 px-4 font-semibold uppercase tracking-wider">Tahun</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider">Nama Kegiatan</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider">Level</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider">Juara</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider">Kategori</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider">Jenis Prestasi</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider">Penyelenggara</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider text-center">Link Sertifikat</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {completedActivities.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-zinc-500">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Trophy className="w-8 h-8 text-zinc-700" />
                    <p className="font-semibold text-zinc-400">Tidak ada rekap prestasi yang sesuai filter</p>
                  </div>
                </td>
              </tr>
            ) : (
              completedActivities.map((act) => {
                const categoryObj = categories.find((c) => c.id === act.categoryId);
                
                return (
                  <tr 
                    key={act.id} 
                    className="hover:bg-zinc-800/40 transition-colors duration-150"
                  >
                    {/* 1. Tahun */}
                    <td className="py-3 px-4 font-bold text-zinc-450 whitespace-nowrap">{act.year}</td>
                    
                    {/* 2. Nama Kegiatan */}
                    <td className="py-3 px-4 font-bold text-zinc-100">
                      <button 
                        onClick={() => onSelectActivity && onSelectActivity(act)}
                        className="font-bold text-zinc-100 hover:text-indigo-400 transition text-left cursor-pointer focus:outline-none"
                      >
                        {act.title}
                      </button>
                    </td>

                    {/* 3. Level */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {act.level ? (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                          <Award className="w-3.5 h-3.5 shrink-0" /> {act.level}
                        </span>
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
                    </td>

                    {/* 4. Juara */}
                    <td className="py-3 px-4">
                      {act.achievement ? (
                        <span className="inline-flex items-center gap-1 text-yellow-400 font-bold bg-yellow-500/10 px-2 py-0.5 rounded-md border border-yellow-500/20">
                          <Trophy className="w-3 h-3 shrink-0" /> {act.achievement}
                        </span>
                      ) : (
                        <span className="text-[11px] text-zinc-500">Selesai</span>
                      )}
                    </td>

                    {/* 5. Kategori */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {categoryObj ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-850 text-zinc-300 border border-zinc-700">
                          {categoryObj.name}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>

                    {/* 6. Jenis Prestasi */}
                    <td className="py-3 px-4 font-medium text-zinc-200">
                      {act.jenisPrestasi ? act.jenisPrestasi : <span className="text-zinc-650 italic text-[11px]">Belum diisi</span>}
                    </td>

                    {/* 7. Penyelenggara */}
                    <td className="py-3 px-4 text-zinc-400 font-medium">{act.organizer || '-'}</td>

                    {/* 8. Link Sertifikat */}
                    <td className="py-3 px-4 text-center">
                      {act.driveUrl ? (
                        <a
                          href={act.driveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Buka Drive Sertifikat"
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900/80 transition"
                        >
                          <FolderGit2 className="w-3 h-3" /> Sertifikat
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-zinc-600 italic">Tidak ada</span>
                      )}
                    </td>

                    {/* 9. Aksi (Edit Icon) */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onEditActivity(act)}
                        className="p-1.5 rounded-lg text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/50 transition cursor-pointer"
                        title="Edit Kegiatan"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
