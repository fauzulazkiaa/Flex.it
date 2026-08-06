import React from 'react';
import { Activity, Category, STATUS_LABELS } from '../types';
import { formatDateIndo, getDaysRemaining } from '../utils/storage';
import { Clock, Calendar, ChevronRight, ExternalLink, Award } from 'lucide-react';

interface UpcomingDeadlinesProps {
  activities: Activity[];
  categories: Category[];
  onSelectActivity: (activity: Activity) => void;
  onOpenTableWithFilter?: () => void;
}

export const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({
  activities,
  categories,
  onSelectActivity,
  onOpenTableWithFilter,
}) => {
  // Ambil hanya yang statusnya belum selesai & urutkan tenggat terdekat
  const upcomingList = activities
    .filter(a => a.status !== 'SELESAI' && a.status !== 'TIDAK_LOLOS')
    .map(a => {
      const daysInfo = getDaysRemaining(a.regDeadline);
      return { activity: a, daysInfo };
    })
    .sort((a, b) => {
      if (!a.daysInfo) return 1;
      if (!b.daysInfo) return -1;
      if (a.daysInfo.status === 'overdue' && b.daysInfo.status !== 'overdue') return 1;
      if (b.daysInfo.status === 'overdue' && a.daysInfo.status !== 'overdue') return -1;
      return (a.daysInfo.days || 0) - (b.daysInfo.days || 0);
    })
    .slice(0, 5); // Tampilkan 5 teratas

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-100 text-base">
              Upcoming Deadlines (Tenggat Terdekat)
            </h3>
            <p className="text-[11px] sm:text-xs text-zinc-400 font-medium">
              Aktivitas dengan tenggat pendaftaran segera
            </p>
          </div>
        </div>

        {onOpenTableWithFilter && (
          <button
            onClick={onOpenTableWithFilter}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline cursor-pointer"
          >
            Lihat Semua ({activities.length})
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {upcomingList.length === 0 ? (
        <div className="py-8 text-center text-xs text-zinc-500 bg-zinc-900/40 rounded-xl border border-dashed border-zinc-800">
          Tidak ada tenggat waktu kegiatan aktif dalam waktu dekat.
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingList.map(({ activity, daysInfo }) => {
            const categoryObj = categories.find(c => c.id === activity.categoryId);
            const statusStyle = STATUS_LABELS[activity.status];

            // Badge sisa hari
            let countdownBadge = null;
            if (daysInfo) {
              if (daysInfo.status === 'today') {
                countdownBadge = (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500 text-white animate-pulse">
                    HARI INI!
                  </span>
                );
              } else if (daysInfo.status === 'overdue') {
                countdownBadge = (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
                    Lewat {daysInfo.days} hari
                  </span>
                );
              } else if (daysInfo.days <= 3) {
                countdownBadge = (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800">
                    {daysInfo.days} Hari Lagi
                  </span>
                );
              } else {
                countdownBadge = (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800">
                    {daysInfo.days} Hari Lagi
                  </span>
                );
              }
            }

            return (
              <div
                key={activity.id}
                onClick={() => onSelectActivity(activity)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/50 hover:bg-zinc-800/60 hover:border-zinc-700 transition cursor-pointer gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-zinc-100 text-sm group-hover:text-indigo-400 transition line-clamp-1">
                          {activity.title}
                        </h4>
                        {categoryObj && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase tracking-wider">
                            {categoryObj.name}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
                        {activity.organizer && <span className="flex items-center gap-1 line-clamp-1 max-w-[200px]"><Award className="w-3 h-3 text-zinc-500" /> {activity.organizer}</span>}
                        <span className="flex items-center gap-1 text-zinc-300 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                          {formatDateIndo(activity.regDeadline)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                    {statusStyle.label}
                  </span>
                  {countdownBadge}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
