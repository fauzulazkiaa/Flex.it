import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Category, 
  STATUS_LABELS, 
  StatusPendaftaran 
} from '../types';
import { formatDateIndo, getDaysRemaining } from '../utils/storage';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ExternalLink, 
  FolderGit2, 
  FileCheck2, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  X,
  Plus,
  Sparkles
} from 'lucide-react';

interface ActivityTableProps {
  activities: Activity[];
  categories: Category[];
  onSelectActivity: (activity: Activity) => void;
  onEditActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
  onOpenNewActivity: () => void;
  selectedYearNav: string;
  selectedMonthNav: string;
}

export const ActivityTable: React.FC<ActivityTableProps> = ({
  activities,
  categories,
  onSelectActivity,
  onEditActivity,
  onDeleteActivity,
  onOpenNewActivity,
  selectedYearNav,
  selectedMonthNav,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>(selectedYearNav || 'ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>(selectedMonthNav || 'ALL');
  const [sortBy, setSortBy] = useState<'regDeadline' | 'eventDate' | 'title' | 'status'>('regDeadline');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter & Sort Logic
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      // Search
      const query = search.toLowerCase().trim();
      const matchesSearch =
        !query ||
        act.title.toLowerCase().includes(query) ||
        (act.organizer && act.organizer.toLowerCase().includes(query)) ||
        act.details.toLowerCase().includes(query) ||
        (act.tags && act.tags.some(t => t.toLowerCase().includes(query)));

      // Category
      const matchesCat = selectedCategory === 'ALL' || act.categoryId === selectedCategory;

      // Status
      let matchesStatus = false;
      if (selectedStatus === 'ALL') {
        matchesStatus = true;
      } else if (selectedStatus === 'ON_GOING') {
        matchesStatus = act.status !== 'SELESAI' && act.status !== 'TIDAK_LOLOS';
      } else {
        matchesStatus = act.status === selectedStatus;
      }

      // Year & Month
      const matchesYear = selectedYear === 'ALL' || act.year.toString() === selectedYear;
      
      let matchesMonth = true;
      if (selectedMonth !== 'ALL') {
        const dateStr = act.regDeadline || act.eventDate || act.createdAt;
        if (dateStr) {
          const month = new Date(dateStr).getMonth().toString();
          matchesMonth = month === selectedMonth;
        }
      }

      return matchesSearch && matchesCat && matchesStatus && matchesYear && matchesMonth;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'regDeadline') {
        comparison = (a.regDeadline || '').localeCompare(b.regDeadline || '');
      } else if (sortBy === 'eventDate') {
        comparison = (a.eventDate || '').localeCompare(b.eventDate || '');
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [activities, search, selectedCategory, selectedStatus, selectedYear, selectedMonth, sortBy, sortOrder]);

  const toggleSort = (field: 'regDeadline' | 'eventDate' | 'title' | 'status') => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setSelectedYear('ALL');
    setSelectedMonth('ALL');
  };

  const hasActiveFilters = search || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || selectedYear !== 'ALL' || selectedMonth !== 'ALL';

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      
      {/* Search & Filter Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-800/80 space-y-3">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              id="input-search-activity"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kegiatan, penyelenggara, atau berkas..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#121215] border border-zinc-800 rounded-xl focus:outline-none focus:border-indigo-500 text-zinc-100 placeholder-zinc-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Add Button & Count */}
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            <span className="text-xs font-medium text-zinc-400">
              Menampilkan <span className="font-bold text-zinc-100">{filteredActivities.length}</span> dari {activities.length} kegiatan
            </span>
            <button
              id="btn-table-add-activity"
              onClick={onOpenNewActivity}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah</span>
            </button>
          </div>

        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mr-1">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold">Filter:</span>
          </div>

          {/* Filter Kategori */}
          <select
            id="select-filter-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-[#121215] border border-zinc-800 rounded-xl px-3 py-1.5 font-medium text-zinc-200 outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-zinc-900 text-zinc-100">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-zinc-900 text-zinc-100">
                {c.name}
              </option>
            ))}
          </select>

          {/* Filter Status */}
          <select
            id="select-filter-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-[#121215] border border-zinc-800 rounded-xl px-3 py-1.5 font-medium text-zinc-300 outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-zinc-900 text-zinc-300">Semua Status</option>
            <option value="ON_GOING" className="bg-zinc-900 text-zinc-300 font-medium">Sedang Berjalan (Ongoing)</option>
            <option value="BELUM_DAFTAR" className="bg-zinc-900 text-zinc-300">Belum Daftar</option>
            <option value="SUDAH_DAFTAR" className="bg-zinc-900 text-zinc-300">Sudah Daftar</option>
            <option value="LOLOS" className="bg-zinc-900 text-zinc-300">Lolos</option>
            <option value="TIDAK_LOLOS" className="bg-zinc-900 text-zinc-300">Tidak Lolos (Evaluasi)</option>
            <option value="SELESAI" className="bg-zinc-900 text-zinc-300">Selesai</option>
          </select>

          {/* Filter Tahun */}
          <select
            id="select-filter-year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="text-xs bg-[#121215] border border-zinc-800 rounded-xl px-3 py-1.5 font-medium text-zinc-200 outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-zinc-900 text-zinc-100">Semua Tahun</option>
            <option value="2026" className="bg-zinc-900 text-zinc-100">2026</option>
            <option value="2025" className="bg-zinc-900 text-zinc-100">2025</option>
            <option value="2024" className="bg-zinc-900 text-zinc-100">2024</option>
          </select>

          {/* Filter Bulan */}
          <select
            id="select-filter-month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-xs bg-[#121215] border border-zinc-800 rounded-xl px-3 py-1.5 font-medium text-zinc-200 outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-zinc-900 text-zinc-100">Semua Bulan</option>
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

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-rose-400 font-semibold hover:underline px-2 py-1 rounded-lg bg-rose-950/40 border border-rose-900/50 cursor-pointer"
            >
              Reset Filter
            </button>
          )}

        </div>

      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#121215] border-b border-zinc-800 text-zinc-400 font-semibold">
              <th className="py-3 px-4">
                <button
                  onClick={() => toggleSort('title')}
                  className="flex items-center gap-1 hover:text-zinc-100 cursor-pointer"
                >
                  Kegiatan & Penyelenggara
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">
                <button
                  onClick={() => toggleSort('status')}
                  className="flex items-center gap-1 hover:text-zinc-100 cursor-pointer"
                >
                  Status Pendaftaran
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </th>
              <th className="py-3 px-4">
                <button
                  onClick={() => toggleSort('regDeadline')}
                  className="flex items-center gap-1 hover:text-zinc-100 cursor-pointer"
                >
                  Deadline Pendaftaran
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </th>
              <th className="py-3 px-4">Tautan Berkas & Arsip</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {filteredActivities.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-zinc-500">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="font-semibold text-zinc-300">Kegiatan Tidak Ditemukan</p>
                    <p className="text-xs">Coba sesuaikan kata kunci pencarian atau reset filter yang terpasang.</p>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-950/80 text-indigo-300 border border-indigo-800 cursor-pointer"
                      >
                        Reset Filter
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredActivities.map((act) => {
                const categoryObj = categories.find((c) => c.id === act.categoryId);
                const statusStyle = STATUS_LABELS[act.status];
                const daysInfo = getDaysRemaining(act.regDeadline);

                return (
                  <tr
                    key={act.id}
                    className="hover:bg-zinc-800/60 hover:shadow-inner transition-colors duration-200 group"
                  >
                    {/* Nama Kegiatan */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-zinc-100 group-hover:text-indigo-400 transition">
                        {act.title}
                      </div>
                      <div className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                        {act.organizer && <span>{act.organizer}</span>}
                        <span>• {act.year}</span>
                      </div>
                    </td>

                    {/* Kategori */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {categoryObj ? (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {categoryObj.name}
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-500">-</span>
                      )}
                    </td>

                    {/* Status Pendaftaran */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                        {statusStyle.label}
                      </span>
                    </td>

                    {/* Deadline Pendaftaran */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-zinc-200">
                        {formatDateIndo(act.regDeadline)}
                      </div>
                      {daysInfo && act.status !== 'SELESAI' && act.status !== 'TIDAK_LOLOS' && (
                        <div className="text-[11px] mt-0.5">
                          {daysInfo.status === 'today' && <span className="text-rose-400 font-bold">Hari Ini!</span>}
                          {daysInfo.status === 'overdue' && <span className="text-zinc-500">Lewat ({daysInfo.days} hari)</span>}
                          {daysInfo.status === 'upcoming' && <span className="text-indigo-400 font-medium">{daysInfo.days} hari lagi</span>}
                        </div>
                      )}
                    </td>

                    {/* Tautan Berkas & Arsip (Google Drive, Submit, Berkas) */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {act.driveUrl ? (
                          <a
                            href={act.driveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Buka Google Drive Sertifikat/Arsip"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900/80 transition"
                          >
                            <FolderGit2 className="w-3 h-3" />
                            <span>Drive Sertifikat</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : null}

                        {act.submissionUrl ? (
                          <a
                            href={act.submissionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Tautan Submit Karya"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-indigo-950/60 text-indigo-300 border border-indigo-800/80 hover:bg-indigo-900/80 transition"
                          >
                            <FileCheck2 className="w-3 h-3" />
                            <span>Submit Karya</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : null}

                        {act.documentsUrl ? (
                          <a
                            href={act.documentsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Tautan Berkas Persyaratan"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-violet-950/60 text-violet-300 border border-violet-800/80 hover:bg-violet-900/80 transition"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Berkas</span>
                          </a>
                        ) : null}

                        {!act.driveUrl && !act.submissionUrl && !act.documentsUrl && (
                          <span className="text-xs text-zinc-500 italic">Belum ada tautan</span>
                        )}
                      </div>
                    </td>

                    {/* Row Action Buttons */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectActivity(act)}
                          title="Lihat Detail & Benefit"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditActivity(act)}
                          title="Edit Kegiatan"
                          className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-950/60 transition cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus kegiatan "${act.title}"?`)) {
                              onDeleteActivity(act.id);
                            }
                          }}
                          title="Hapus Kegiatan"
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/60 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
