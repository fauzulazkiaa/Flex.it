import React from 'react';
import { 
  Trophy, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  BookCheck, 
  Target
} from 'lucide-react';
import { Activity } from '../types';
import { getDaysRemaining } from '../utils/storage';
import { motion } from 'motion/react';

interface StatCardsProps {
  activities: Activity[];
  selectedYear: string;
  selectedMonth: string;
}

export const StatCards: React.FC<StatCardsProps> = ({ activities, selectedYear, selectedMonth }) => {
  // Filter berdasarkan tahun dan bulan
  const filteredActivities = activities.filter(a => {
    const matchYear = selectedYear === 'ALL' || a.year.toString() === selectedYear;
    let matchMonth = true;
    if (selectedMonth !== 'ALL') {
      const dateStr = a.regDeadline || a.eventDate || a.createdAt;
      if (dateStr) {
        const month = new Date(dateStr).getMonth().toString();
        matchMonth = month === selectedMonth;
      }
    }
    return matchYear && matchMonth;
  });

  const totalThisYear = filteredActivities.length;

  const countBelum = filteredActivities.filter(a => a.status === 'BELUM_DAFTAR').length;
  const countSudah = filteredActivities.filter(a => a.status === 'SUDAH_DAFTAR').length;
  const countLolos = filteredActivities.filter(a => a.status === 'LOLOS').length;
  const countTidakLolos = filteredActivities.filter(a => a.status === 'TIDAK_LOLOS').length;
  const countSelesai = filteredActivities.filter(a => a.status === 'SELESAI').length;

  // Success rate: (Lolos + Selesai) / Total kegiatan yang sudah diproses pengumumannya (Lolos + Tidak Lolos + Selesai)
  const processedCount = countLolos + countTidakLolos + countSelesai;
  const successCount = countLolos + countSelesai;
  const successRate = processedCount > 0 ? Math.round((successCount / processedCount) * 100) : 0;

  // Upcoming deadlines in < 14 days
  const upcomingCount = filteredActivities.filter(a => {
    if (a.status === 'SELESAI' || a.status === 'TIDAK_LOLOS') return false;
    const daysInfo = getDaysRemaining(a.regDeadline);
    return daysInfo && daysInfo.status !== 'overdue' && daysInfo.days <= 14;
  }).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      
      {/* 1. Total Kegiatan */}
      <motion.div variants={itemVariants} className="glass-card rounded-2xl p-5 relative overflow-hidden group hover:border-zinc-700 transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Total Kegiatan {selectedYear !== 'ALL' ? `(${selectedYear})` : ''}
            </p>
            <h3 className="text-3xl font-extrabold text-zinc-100 mt-1">
              {totalThisYear}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              {countSudah + countBelum} aktif • {processedCount} selesai/hasil
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1 font-medium text-zinc-300">
            <BookCheck className="w-3.5 h-3.5 text-indigo-400" /> {countSudah} Terdaftar
          </span>
          <span className="flex items-center gap-1 font-medium text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-zinc-500" /> {countBelum} Belum Daftar
          </span>
        </div>
      </motion.div>

      {/* 2. Success Rate / Persentase Lolos */}
      <motion.div variants={itemVariants} className="glass-card rounded-2xl p-5 relative overflow-hidden group hover:border-zinc-700 transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Success Rate (Lolos/Menang)
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-extrabold text-zinc-100">
                {successRate}%
              </h3>
              <span className="text-xs font-semibold text-emerald-400">
                ({successCount}/{processedCount} program)
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              {countLolos} Lolos • {countSelesai} Selesai • {countTidakLolos} Evaluasi
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Trophy className="w-6 h-6" />
          </div>
        </div>
        
        {/* Progress Bar Mini */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80">
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${successRate}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* 3. Upcoming Deadlines */}
      <motion.div variants={itemVariants} className="glass-card rounded-2xl p-5 relative overflow-hidden group hover:border-zinc-700 transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Upcoming Deadlines
            </p>
            <h3 className="text-3xl font-extrabold text-zinc-100 mt-1">
              {upcomingCount}
            </h3>
            <p className="text-xs text-amber-400 font-medium mt-1">
              Tenggat waktu &lt; 14 hari kedepan
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <span className="text-zinc-400">Persiapkan berkas & submit tepat waktu</span>
        </div>
      </motion.div>

      {/* 4. Status Overview Pill Counts */}
      <motion.div variants={itemVariants} className="glass-card rounded-2xl p-5 relative overflow-hidden group hover:border-zinc-700 transition">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            Ringkasan Status
          </p>
          <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60">
            <span className="flex items-center gap-1 font-medium text-emerald-400">
              <CheckCircle2 className="w-3 h-3" /> Lolos
            </span>
            <span className="font-bold text-emerald-300">{countLolos}</span>
          </div>

          <div className="flex items-center justify-between p-1.5 rounded-lg bg-indigo-950/40 border border-indigo-800/60">
            <span className="flex items-center gap-1 font-medium text-indigo-400">
              <BookCheck className="w-3 h-3" /> Daftar
            </span>
            <span className="font-bold text-indigo-300">{countSudah}</span>
          </div>

          <div className="flex items-center justify-between p-1.5 rounded-lg bg-teal-950/40 border border-teal-800/60">
            <span className="flex items-center gap-1 font-medium text-teal-400">
              <CheckCircle2 className="w-3 h-3" /> Selesai
            </span>
            <span className="font-bold text-teal-300">{countSelesai}</span>
          </div>

          <div className="flex items-center justify-between p-1.5 rounded-lg bg-rose-950/40 border border-rose-800/60">
            <span className="flex items-center gap-1 font-medium text-rose-400">
              <XCircle className="w-3 h-3" /> Evaluasi
            </span>
            <span className="font-bold text-rose-300">{countTidakLolos}</span>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
};
