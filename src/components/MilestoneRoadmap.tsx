import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Crown, 
  Award, 
  Sparkles, 
  Calendar, 
  Map, 
  Compass, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  Search, 
  Filter, 
  Zap, 
  MapPin, 
  Building,
  Target
} from 'lucide-react';
import { Activity, Category } from '../types';

interface MilestoneRoadmapProps {
  activities: Activity[];
  categories: Category[];
  onSelectActivity: (activity: Activity) => void;
  onEditActivity: (activity: Activity) => void;
}

export const MilestoneRoadmap: React.FC<MilestoneRoadmapProps> = ({
  activities,
  categories,
  onSelectActivity,
  onEditActivity
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(null);

  // Helper to resolve category information
  const getCategory = (catId: string) => {
    return categories.find((c) => c.id === catId);
  };

  // Helper to check if achievement is a major win
  const getWinDecoration = (achievement?: string) => {
    if (!achievement) return null;
    const lower = achievement.toLowerCase();
    if (lower.includes('1') || lower.includes('emas') || lower.includes('first') || lower.includes('gold')) {
      return { icon: Crown, color: 'text-amber-400', glow: 'shadow-amber-500/30' };
    }
    if (lower.includes('2') || lower.includes('perak') || lower.includes('second') || lower.includes('silver')) {
      return { icon: Trophy, color: 'text-zinc-300', glow: 'shadow-zinc-300/30' };
    }
    if (lower.includes('3') || lower.includes('perunggu') || lower.includes('third') || lower.includes('bronze')) {
      return { icon: Award, color: 'text-amber-700', glow: 'shadow-amber-700/30' };
    }
    return { icon: Award, color: 'text-indigo-400', glow: 'shadow-indigo-500/20' };
  };

  // Chronologically sort all activities (oldest to newest for roadmap path)
  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => {
      const dateA = a.eventDate || a.announcementDate || a.submitDeadline || a.regDeadline || '';
      const dateB = b.eventDate || b.announcementDate || b.submitDeadline || b.regDeadline || '';
      return dateA.localeCompare(dateB);
    });
  }, [activities]);

  // Apply filters
  const filteredActivities = useMemo(() => {
    return sortedActivities.filter((act) => {
      const matchesLevel = selectedLevel === 'ALL' || act.level === selectedLevel;
      const matchesCategory = selectedCategory === 'ALL' || act.categoryId === selectedCategory;
      const matchesSearch = 
        act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (act.organizer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (act.achievement || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesLevel && matchesCategory && matchesSearch;
    });
  }, [sortedActivities, selectedLevel, selectedCategory, searchTerm]);

  // Group filtered activities by Year (Season)
  const groupedByYear = useMemo(() => {
    const groups: Record<number, Activity[]> = {};
    filteredActivities.forEach((act) => {
      const year = act.year || new Date(act.createdAt).getFullYear();
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(act);
    });
    // Sort years descending so newest seasons are at the top, but internal milestones are chronological
    return Object.keys(groups)
      .map(Number)
      .sort((a, b) => b - a)
      .reduce<Record<number, Activity[]>>((acc, yr) => {
        acc[yr] = groups[yr];
        return acc;
      }, {});
  }, [filteredActivities]);

  // Adventure statistics
  const stats = useMemo(() => {
    const wins = activities.filter((a) => a.status === 'SELESAI' && a.achievement).length;
    const certificates = activities.filter((a) => a.driveUrl || a.infoUrl).length;
    const uniqueLevels = Array.from(new Set(activities.map((a) => a.level).filter(Boolean)));
    const highestLevel = uniqueLevels.includes('Internasional') 
      ? 'Internasional' 
      : uniqueLevels.includes('Nasional') 
      ? 'Nasional' 
      : uniqueLevels.includes('Provinsi') 
      ? 'Provinsi' 
      : uniqueLevels.length > 0 
      ? uniqueLevels[0] 
      : 'N/A';

    return {
      total: activities.length,
      wins,
      highestLevel,
      certificates
    };
  }, [activities]);

  const activeMilestone = useMemo(() => {
    if (!activeMilestoneId) return null;
    return activities.find((a) => a.id === activeMilestoneId) || null;
  }, [activeMilestoneId, activities]);

  return (
    <div className="space-y-6">
      
      {/* Adventure Stats Card Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="relative overflow-hidden p-4 rounded-2xl bg-[#121215] border border-zinc-800/80 flex items-center gap-3.5 shadow-sm">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] text-zinc-400">
            <Compass className="w-24 h-24" />
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Compass className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase">Total Quest</div>
            <div className="text-lg font-black text-zinc-100">{stats.total} <span className="text-xs font-normal text-zinc-400">Kegiatan</span></div>
          </div>
        </div>

        <div className="relative overflow-hidden p-4 rounded-2xl bg-[#121215] border border-zinc-800/80 flex items-center gap-3.5 shadow-sm">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] text-zinc-400">
            <Crown className="w-24 h-24" />
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Crown className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase">Piala & Penghargaan</div>
            <div className="text-lg font-black text-zinc-100">{stats.wins} <span className="text-xs font-normal text-zinc-400">Prestasi</span></div>
          </div>
        </div>

        <div className="relative overflow-hidden p-4 rounded-2xl bg-[#121215] border border-zinc-800/80 flex items-center gap-3.5 shadow-sm">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] text-zinc-400">
            <Zap className="w-24 h-24" />
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Zap className="w-5 h-5 text-rose-400 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase">Level Tertinggi</div>
            <div className="text-lg font-black text-zinc-100">{stats.highestLevel}</div>
          </div>
        </div>

        <div className="relative overflow-hidden p-4 rounded-2xl bg-[#121215] border border-zinc-800/80 flex items-center gap-3.5 shadow-sm">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] text-zinc-400">
            <FileText className="w-24 h-24" />
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FileText className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase">Berkas Teralokasi</div>
            <div className="text-lg font-black text-zinc-100">{stats.certificates} <span className="text-xs font-normal text-zinc-400">Tautan</span></div>
          </div>
        </div>

      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#121215] border border-zinc-800/80 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari petualangan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0c0c0e] border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-xs text-zinc-400 font-medium">Filter:</span>
          </div>

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="text-xs bg-[#0c0c0e] border border-zinc-800 rounded-xl px-3 py-1.5 font-medium text-zinc-300 outline-none cursor-pointer"
          >
            <option value="ALL">Semua Tingkatan</option>
            <option value="Internasional">Internasional</option>
            <option value="Nasional">Nasional</option>
            <option value="Provinsi">Provinsi</option>
            <option value="Kota/Kabupaten">Kota/Kabupaten</option>
            <option value="Universitas/Instansi">Universitas/Instansi</option>
            <option value="Fakultas/Prodi">Fakultas/Prodi</option>
            <option value="Lainnya">Lainnya</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-[#0c0c0e] border border-zinc-800 rounded-xl px-3 py-1.5 font-medium text-zinc-300 outline-none cursor-pointer"
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {(selectedLevel !== 'ALL' || selectedCategory !== 'ALL' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedLevel('ALL');
                setSelectedCategory('ALL');
                setSearchTerm('');
              }}
              className="text-xs text-rose-400 font-semibold hover:underline px-2.5 py-1.5 rounded-xl bg-rose-950/40 border border-rose-900/50 cursor-pointer"
            >
              Reset
            </button>
          )}

        </div>

      </div>

      {/* Main Roadmap Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Winding Adventure Path Map (Left/Center Column) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#121215] border border-zinc-800/80 relative overflow-hidden min-h-[500px]">
          
          <div className="absolute top-4 left-6 flex items-center gap-2 text-zinc-500">
            <Map className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Adventure Map View</span>
          </div>

          {filteredActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
              <Compass className="w-12 h-12 text-zinc-600 mb-3" />
              <p className="text-sm font-medium">Tidak ada rute perjalanan yang cocok.</p>
              <p className="text-xs text-zinc-600 mt-1">Coba sesuaikan filter atau tambahkan kegiatan baru.</p>
            </div>
          ) : (
            <div className="mt-8 space-y-12 relative">
              
              {/* Outer map layout loop for seasons */}
              {Object.keys(groupedByYear).map((yearStr) => {
                const year = Number(yearStr);
                const yearActs = groupedByYear[year];

                return (
                  <div key={year} className="space-y-8 relative">
                    
                    {/* Season Header Divider */}
                    <div className="flex items-center gap-3">
                      <div className="h-[1px] bg-zinc-800/80 flex-1"></div>
                      <div className="px-4 py-1.5 rounded-full bg-indigo-950/40 border border-indigo-900/50 text-xs font-black text-indigo-300 tracking-widest uppercase">
                        Season {year}
                      </div>
                      <div className="h-[1px] bg-zinc-800/80 flex-1"></div>
                    </div>

                    {/* Timeline Path Container */}
                    <div className="relative pl-6 md:pl-0 md:mx-auto max-w-2xl">
                      
                      {/* Vertical line connecting nodes */}
                      <div className="absolute left-[11px] md:left-1/2 md:-translate-x-1/2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-indigo-500/20 via-indigo-500/40 to-indigo-500/20 border-l border-indigo-500/20"></div>

                      <div className="space-y-10 relative">
                        {yearActs.map((act, index) => {
                          const cat = getCategory(act.categoryId);
                          const dec = getWinDecoration(act.achievement);
                          const isOngoing = act.status !== 'SELESAI' && act.status !== 'TIDAK_LOLOS';
                          const isWin = act.status === 'SELESAI' && act.achievement;
                          const isActive = activeMilestoneId === act.id;

                          // Alternates left and right position for layout
                          const isRight = index % 2 === 0;

                          return (
                            <div 
                              key={act.id} 
                              className={`flex flex-col md:flex-row relative items-start md:items-center ${
                                isRight ? 'md:flex-row' : 'md:flex-row-reverse'
                              }`}
                            >
                              
                              {/* Central Interactive Node Point */}
                              <div className="absolute left-0 md:left-1/2 top-1.5 md:-translate-x-1/2 z-10">
                                <button
                                  onClick={() => setActiveMilestoneId(act.id)}
                                  className={`w-[24px] h-[24px] rounded-full flex items-center justify-center border transition-all duration-300 ${
                                    isActive 
                                      ? 'bg-indigo-500 border-indigo-400 scale-125 shadow-[0_0_12px_rgba(99,102,241,0.6)]' 
                                      : isOngoing
                                      ? 'bg-rose-500/20 border-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                                      : isWin
                                      ? 'bg-[#121215] border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                                      : 'bg-[#121215] border-zinc-700 hover:border-indigo-500'
                                  }`}
                                >
                                  {/* Node Icons inside circle */}
                                  {dec ? (
                                    <dec.icon className={`w-3 h-3 ${isActive ? 'text-white' : dec.color}`} />
                                  ) : isOngoing ? (
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                  ) : (
                                    <CheckCircle2 className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                                  )}
                                </button>
                              </div>

                              {/* Card Content block */}
                              <div className={`w-full pl-10 md:pl-0 md:w-1/2 ${
                                isRight ? 'md:pr-10 md:text-right' : 'md:pl-10 md:text-left'
                              }`}>
                                <div
                                  onClick={() => setActiveMilestoneId(act.id)}
                                  className={`p-4 rounded-2xl bg-[#0c0c0e]/80 border transition-all duration-300 cursor-pointer hover:border-zinc-700/80 hover:bg-[#121215] ${
                                    isActive 
                                      ? 'border-indigo-500 bg-indigo-950/10 shadow-lg' 
                                      : 'border-zinc-800/80'
                                  }`}
                                >
                                  {/* Category tag & Date */}
                                  <div className={`flex flex-wrap gap-2 items-center text-[10px] text-zinc-500 mb-2 ${
                                    isRight ? 'md:justify-end' : 'md:justify-start'
                                  }`}>
                                    <span className="font-semibold text-zinc-400">
                                      {act.eventDate || act.announcementDate || act.regDeadline}
                                    </span>
                                    {cat && (
                                      <span className={`px-2 py-0.5 rounded-md bg-${cat.color}-500/10 text-${cat.color}-400 font-bold border border-${cat.color}-500/20`}>
                                        {cat.name}
                                      </span>
                                    )}
                                  </div>

                                  {/* Title */}
                                  <h4 className="font-bold text-xs sm:text-sm text-zinc-200 line-clamp-1 hover:text-white">
                                    {act.title}
                                  </h4>

                                  {/* Level / Organizer / Reward summary */}
                                  <div className={`flex flex-wrap gap-1.5 items-center mt-2 text-[10px] text-zinc-400 ${
                                    isRight ? 'md:justify-end' : 'md:justify-start'
                                  }`}>
                                    <span className="bg-zinc-800/50 px-2 py-0.5 rounded-md border border-zinc-700/60 font-medium">
                                      {act.level || 'Lainnya'}
                                    </span>
                                    {act.achievement && (
                                      <span className="bg-amber-950/30 text-amber-400 border border-amber-900/50 px-2 py-0.5 rounded-md font-extrabold flex items-center gap-0.5">
                                        <Trophy className="w-2.5 h-2.5" /> {act.achievement}
                                      </span>
                                    )}
                                  </div>

                                </div>
                              </div>

                              {/* Spacer on the opposite side to balance spacing */}
                              <div className="hidden md:block w-1/2"></div>

                            </div>
                          );
                        })}
                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* Milestone Detail Card / Sidebar (Right Column) */}
        <div className="p-5 rounded-3xl bg-[#121215] border border-zinc-800/80 space-y-4">
          
          <div className="flex items-center gap-2 text-zinc-500 border-b border-zinc-800 pb-3">
            <Compass className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Detail Petualangan</span>
          </div>

          {activeMilestone ? (
            <div className="space-y-4">
              
              {/* Category Badge and Achievement status */}
              <div className="flex items-center justify-between">
                {getCategory(activeMilestone.categoryId) && (
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg bg-${getCategory(activeMilestone.categoryId)?.color}-500/10 text-${getCategory(activeMilestone.categoryId)?.color}-400 border border-${getCategory(activeMilestone.categoryId)?.color}-500/20`}>
                    {getCategory(activeMilestone.categoryId)?.name}
                  </span>
                )}
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg ${
                  activeMilestone.status === 'SELESAI' 
                    ? 'bg-teal-950/30 text-teal-400 border border-teal-900/50' 
                    : activeMilestone.status === 'TIDAK_LOLOS'
                    ? 'bg-rose-950/30 text-rose-400 border border-rose-900/50'
                    : 'bg-indigo-950/30 text-indigo-400 border border-indigo-900/50 animate-pulse'
                }`}>
                  {activeMilestone.status.replace('_', ' ')}
                </span>
              </div>

              {/* Title and Level */}
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-zinc-100 leading-snug">
                  {activeMilestone.title}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-xs text-zinc-400 font-semibold">{activeMilestone.level || 'Tingkat Lainnya'}</span>
                </div>
              </div>

              {/* Achievement Badge decoration (Trophy / Win details) */}
              {activeMilestone.achievement && (
                <div className="p-3.5 rounded-2xl bg-amber-950/10 border border-amber-900/30 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Trophy className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-amber-500/80 font-bold uppercase tracking-wider">Capaian Prestasi</div>
                    <div className="text-xs sm:text-sm font-black text-amber-300">{activeMilestone.achievement}</div>
                    {activeMilestone.jenisPrestasi && (
                      <div className="text-[10px] text-zinc-500 font-medium mt-0.5">{activeMilestone.jenisPrestasi}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Details & Info */}
              <div className="space-y-3.5 text-xs text-zinc-400 bg-[#0c0c0e]/60 p-4 rounded-2xl border border-zinc-800/80">
                
                {activeMilestone.organizer && (
                  <div className="flex gap-2">
                    <Building className="w-4 h-4 text-zinc-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-zinc-500 block font-semibold uppercase">Penyelenggara</span>
                      <span className="text-zinc-300">{activeMilestone.organizer}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Calendar className="w-4 h-4 text-zinc-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-500 block font-semibold uppercase">Tenggat Waktu</span>
                    <span className="text-zinc-300 font-medium">Pendaftaran: {activeMilestone.regDeadline}</span>
                    {activeMilestone.eventDate && (
                      <span className="block text-zinc-400 mt-0.5">Pelaksanaan: {activeMilestone.eventDate}</span>
                    )}
                  </div>
                </div>

                {activeMilestone.details && (
                  <div className="pt-2 border-t border-zinc-800/80">
                    <span className="text-[10px] text-zinc-500 block font-semibold uppercase mb-1">Catatan Tambahan</span>
                    <p className="text-zinc-300 leading-relaxed text-xs line-clamp-4">
                      {activeMilestone.details}
                    </p>
                  </div>
                )}

              </div>

              {/* Action Link Buttons */}
              <div className="grid grid-cols-1 gap-2 pt-2">
                
                {activeMilestone.driveUrl && (
                  <a
                    href={activeMilestone.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-950/20 text-emerald-400 border border-emerald-900/60 font-bold text-xs hover:bg-emerald-900/20 transition-all cursor-pointer"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    Lihat Sertifikat
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                {activeMilestone.infoUrl && (
                  <a
                    href={activeMilestone.infoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0c0c0e] border border-zinc-800 text-zinc-300 font-semibold text-xs hover:bg-[#121215] transition-all cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    Link Pedoman Kegiatan
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => onSelectActivity(activeMilestone)}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-all cursor-pointer text-center"
                  >
                    Buka Detail Penuh
                  </button>
                  <button
                    onClick={() => onEditActivity(activeMilestone)}
                    className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition-all cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500 text-center">
              <Target className="w-8 h-8 text-zinc-700 mb-2 animate-bounce" />
              <p className="text-xs font-semibold">Pilih salah satu titik di peta</p>
              <p className="text-[10px] text-zinc-600 max-w-[200px] mt-1">
                Gunakan kursor atau sentuh titik/piala untuk memunculkan detail petualangan.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
