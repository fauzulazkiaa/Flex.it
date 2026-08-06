import React from 'react';
import { Activity, Category, STATUS_LABELS, StatusPendaftaran } from '../types';
import { TeamMembersTab } from './TeamMembersTab';
import { formatDateIndo, getDaysRemaining } from '../utils/storage';
import { 
  X, 
  ExternalLink, 
  FolderGit2, 
  FileCheck2, 
  Calendar, 
  Building2, 
  Tag, 
  Edit, 
  Trash2, 
  Copy, 
  Check, 
  Award,
  Clock,
  CheckCircle2,
  Trophy,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ActivityDetailModalProps {
  activity: Activity | null;
  onClose: () => void;
  categories: Category[];
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: StatusPendaftaran) => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  activity,
  onClose,
  categories,
  onEdit,
  onDelete,
  onUpdateStatus,
}) => {
  const [copiedLink, setCopiedLink] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'detail' | 'team'>('detail');

  // Removed early return to allow AnimatePresence to work
  const categoryObj = activity ? categories.find((c) => c.id === activity.categoryId) : null;
  const statusStyle = activity ? STATUS_LABELS[activity.status] : null;
  const daysInfo = activity ? getDaysRemaining(activity.regDeadline) : null;

  const copyToClipboard = (url: string, label: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(label);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <AnimatePresence>
    {activity && statusStyle && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="glass-card rounded-3xl w-full max-w-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col shadow-2xl"
      >
        
        {/* Header Modal */}
        <div className="flex items-start justify-between p-6 border-b border-zinc-800/80 bg-[#121215]">
          <div className="space-y-2 max-w-lg">
            <div className="flex items-center gap-2 flex-wrap">
              {categoryObj && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800">
                  {categoryObj.name}
                </span>
              )}
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                {statusStyle.label}
              </span>
              <span className="text-xs text-zinc-400 font-medium">Tahun {activity.year}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-100 leading-tight">
              {activity.title}
            </h2>

            {activity.organizer && (
              <p className="text-xs sm:text-sm text-zinc-400 flex items-center gap-1.5 font-medium">
                <Building2 className="w-4 h-4 text-zinc-500" /> Penyelenggara: {activity.organizer}
              </p>
            )}
            
            {(activity.level || activity.achievement || activity.jenisPrestasi) && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {activity.level && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Award className="w-3.5 h-3.5" /> Tingkat {activity.level}
                  </span>
                )}
                {activity.achievement && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]">
                    <Trophy className="w-3.5 h-3.5" /> {activity.achievement}
                  </span>
                )}
                {activity.jenisPrestasi && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Trophy className="w-3.5 h-3.5" /> Jenis: {activity.jenisPrestasi}
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 p-2 rounded-xl hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 px-6 pt-4 bg-[#121215] border-b border-zinc-800/80">
          <button
            onClick={() => setActiveTab('detail')}
            className={`pb-3 text-sm font-bold border-b-2 transition ${activeTab === 'detail' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            Detail Kegiatan
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-1.5 ${activeTab === 'team' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            <Users className="w-4 h-4" /> Tim & Anggota
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-xs sm:text-sm overflow-y-auto flex-1 pr-3 scrollbar-thin">
          
          {activeTab === 'detail' ? (
            <>
              {/* Quick Status Updater Dropdown */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#121215] border border-indigo-900/40">
                <span className="font-semibold text-indigo-300 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Ubah Status Pendaftaran:
                </span>
                <select
                  value={activity.status}
                  onChange={(e) => onUpdateStatus(activity.id, e.target.value as StatusPendaftaran)}
                  className="text-xs font-medium px-3 py-1.5 rounded-xl bg-[#0c0c0e] border border-indigo-800/60 text-zinc-300 outline-none cursor-pointer"
                >
                  <option value="BELUM_DAFTAR" className="bg-zinc-900 text-zinc-300">Belum Daftar</option>
                  <option value="SUDAH_DAFTAR" className="bg-zinc-900 text-zinc-300">Sudah Daftar</option>
                  <option value="LOLOS" className="bg-zinc-900 text-zinc-300">Lolos</option>
                  <option value="TIDAK_LOLOS" className="bg-zinc-900 text-zinc-300">Tidak Lolos</option>
                  <option value="SELESAI" className="bg-zinc-900 text-zinc-300">Selesai</option>
                </select>
              </div>

              {/* Timeline Dates */}
              <div className="p-4 rounded-2xl bg-[#121215] border border-zinc-800/80 space-y-3">
                <h4 className="font-bold text-zinc-100 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-400" /> Timeline & Tanggal Penting
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  
                  <div className="p-2.5 rounded-xl bg-[#0c0c0e] border border-zinc-800">
                    <p className="text-zinc-400 text-[11px] font-medium">Deadline Pendaftaran</p>
                    <p className="font-bold text-zinc-100 mt-0.5">{formatDateIndo(activity.regDeadline)}</p>
                    {daysInfo && (
                      <p className="text-[10px] text-indigo-400 font-semibold mt-0.5">
                        {daysInfo.status === 'today' ? 'Hari ini!' : daysInfo.status === 'upcoming' ? `${daysInfo.days} hari lagi` : 'Selesai'}
                      </p>
                    )}
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0c0c0e] border border-zinc-800">
                    <p className="text-zinc-400 text-[11px] font-medium">Deadline Submit</p>
                    <p className="font-bold text-zinc-100 mt-0.5">{formatDateIndo(activity.submitDeadline)}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0c0c0e] border border-zinc-800">
                    <p className="text-zinc-400 text-[11px] font-medium">Pengumuman</p>
                    <p className="font-bold text-zinc-100 mt-0.5">{formatDateIndo(activity.announcementDate)}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0c0c0e] border border-zinc-800">
                    <p className="text-zinc-400 text-[11px] font-medium">Pelaksanaan</p>
                    <p className="font-bold text-zinc-100 mt-0.5">{formatDateIndo(activity.eventDate)}</p>
                  </div>

                </div>
              </div>

              {/* Detail & Benefit Teks */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-zinc-100 text-xs uppercase tracking-wider">
                  Detail, Benefit & Catatan
                </h4>
                <div className="p-4 rounded-2xl bg-[#121215] border border-zinc-800 text-zinc-200 leading-relaxed whitespace-pre-line">
                  {activity.details || 'Tidak ada catatan detail tambahan.'}
                </div>
              </div>

              {/* Tautan Berkas & Arsip (Google Drive / Submit / Berkas) */}
              <div className="space-y-2">
                <h4 className="font-bold text-zinc-100 text-xs uppercase tracking-wider">
                  Tautan Berkas & Pengarsipan Sertifikat
                </h4>

                <div className="space-y-2">
                  
                  {/* Info URL */}
                  {activity.infoUrl ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-blue-950/40 border border-blue-800/80">
                      <div className="flex items-center gap-2 overflow-hidden mr-2">
                        <ExternalLink className="w-4 h-4 text-blue-400 shrink-0" />
                        <div>
                          <p className="font-bold text-blue-300 text-xs">Informasi Lomba (Pedoman/Web)</p>
                          <p className="text-[11px] text-blue-400 truncate max-w-xs">{activity.infoUrl}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => copyToClipboard(activity.infoUrl!, 'info')}
                          className="p-1.5 rounded-lg bg-[#0c0c0e] text-zinc-300 hover:bg-zinc-800 transition cursor-pointer"
                          title="Salin Tautan"
                        >
                          {copiedLink === 'info' ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <a
                          href={activity.infoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition"
                        >
                          Buka Info <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ) : null}

                  {/* Google Drive */}
                  {activity.driveUrl ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/80">
                      <div className="flex items-center gap-2 overflow-hidden mr-2">
                        <FolderGit2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <p className="font-bold text-emerald-300 text-xs">Drive Sertifikat / Hasil</p>
                          <p className="text-[11px] text-emerald-400 truncate max-w-xs">{activity.driveUrl}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => copyToClipboard(activity.driveUrl!, 'drive')}
                          className="p-1.5 rounded-lg bg-[#0c0c0e] text-zinc-300 hover:bg-zinc-800 transition cursor-pointer"
                          title="Salin Tautan"
                        >
                          {copiedLink === 'drive' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <a
                          href={activity.driveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition"
                        >
                          Buka Drive <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ) : null}

                  {/* Submission Url */}
                  {activity.submissionUrl ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/80">
                      <div className="flex items-center gap-2 overflow-hidden mr-2">
                        <FileCheck2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div>
                          <p className="font-bold text-indigo-300 text-xs">Tautan Submit Karya</p>
                          <p className="text-[11px] text-indigo-400 truncate max-w-xs">{activity.submissionUrl}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => copyToClipboard(activity.submissionUrl!, 'submit')}
                          className="p-1.5 rounded-lg bg-[#0c0c0e] text-zinc-300 hover:bg-zinc-800 transition cursor-pointer"
                          title="Salin Tautan"
                        >
                          {copiedLink === 'submit' ? <Check className="w-3.5 h-3.5 text-indigo-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <a
                          href={activity.submissionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition"
                        >
                          Buka Link <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ) : null}

                  {/* Documents Url */}
                  {activity.documentsUrl ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-violet-950/40 border border-violet-800/80">
                      <div className="flex items-center gap-2 overflow-hidden mr-2">
                        <ExternalLink className="w-4 h-4 text-violet-400 shrink-0" />
                        <div>
                          <p className="font-bold text-violet-300 text-xs">Berkas Persyaratan</p>
                          <p className="text-[11px] text-violet-400 truncate max-w-xs">{activity.documentsUrl}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => copyToClipboard(activity.documentsUrl!, 'docs')}
                          className="p-1.5 rounded-lg bg-[#0c0c0e] text-zinc-300 hover:bg-zinc-800 transition cursor-pointer"
                          title="Salin Tautan"
                        >
                          {copiedLink === 'docs' ? <Check className="w-3.5 h-3.5 text-violet-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <a
                          href={activity.documentsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 transition"
                        >
                          Buka Link <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ) : null}

                  {!activity.driveUrl && !activity.submissionUrl && !activity.documentsUrl && (
                    <div className="p-4 text-center text-xs text-zinc-500 bg-[#121215] rounded-xl border border-dashed border-zinc-800">
                      Belum ada tautan berkas atau sertifikat yang diunggah. Klik edit untuk menambahkan URL Google Drive.
                    </div>
                  )}

                </div>
              </div>

              {/* Tags */}
              {activity.tags && activity.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap pt-2">
                  <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Label Tag:
                  </span>
                  {activity.tags.map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <TeamMembersTab activity={activity} />
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-zinc-800/80 bg-[#121215]">
          <button
            onClick={() => {
              if (confirm(`Hapus kegiatan "${activity.title}"?`)) {
                onDelete(activity.id);
                onClose();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hapus Kegiatan</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(activity);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-950/80 border border-indigo-800 hover:bg-indigo-900 transition cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Data</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>

      </motion.div>
    </div>
    )}
    </AnimatePresence>
  );
};
