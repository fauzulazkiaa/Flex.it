import React, { useState, useEffect } from 'react';
import { Activity, Category, StatusPendaftaran, ActivityLevel } from '../types';
import { X, Save, Calendar, Link2, Info, Building2, Tag, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ActivityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  initialData?: Activity | null;
  categories: Category[];
}

export const ActivityFormModal: React.FC<ActivityFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories,
}) => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState<StatusPendaftaran>('BELUM_DAFTAR');
  const [regDeadline, setRegDeadline] = useState('');
  const [submitDeadline, setSubmitDeadline] = useState('');
  const [announcementDate, setAnnouncementDate] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [details, setDetails] = useState('');
  const [infoUrl, setInfoUrl] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [documentsUrl, setDocumentsUrl] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [tagsInput, setTagsInput] = useState('');
  const [level, setLevel] = useState<ActivityLevel | ''>('');
  const [achievement, setAchievement] = useState('');
  const [jenisPrestasi, setJenisPrestasi] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCategoryId(initialData.categoryId);
      setStatus(initialData.status);
      setRegDeadline(initialData.regDeadline || '');
      setSubmitDeadline(initialData.submitDeadline || '');
      setAnnouncementDate(initialData.announcementDate || '');
      setEventDate(initialData.eventDate || '');
      setOrganizer(initialData.organizer || '');
      setDetails(initialData.details || '');
      setInfoUrl(initialData.infoUrl || '');
      setDriveUrl(initialData.driveUrl || '');
      setSubmissionUrl(initialData.submissionUrl || '');
      setDocumentsUrl(initialData.documentsUrl || '');
      setYear(initialData.year || new Date().getFullYear());
      setTagsInput(initialData.tags ? initialData.tags.join(', ') : '');
      setLevel(initialData.level || '');
      setAchievement(initialData.achievement || '');
      setJenisPrestasi(initialData.jenisPrestasi || '');
    } else {
      // Form default kosong
      setTitle('');
      setCategoryId(categories[0]?.id || '');
      setStatus('BELUM_DAFTAR');
      setRegDeadline('');
      setSubmitDeadline('');
      setAnnouncementDate('');
      setEventDate('');
      setOrganizer('');
      setDetails('');
      setInfoUrl('');
      setDriveUrl('');
      setSubmissionUrl('');
      setDocumentsUrl('');
      setYear(new Date().getFullYear());
      setTagsInput('');
      setLevel('');
      setAchievement('');
      setJenisPrestasi('');
    }
  }, [initialData, categories, isOpen]);

  // Removed early return to allow AnimatePresence to work
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Mohon isi Nama Kegiatan');
      return;
    }
    if (!categoryId) {
      alert('Mohon pilih Kategori Kegiatan');
      return;
    }
    if (!regDeadline) {
      alert('Mohon isi Deadline Pendaftaran');
      return;
    }

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onSave({
      ...(initialData?.id ? { id: initialData.id } : {}),
      title: title.trim(),
      categoryId,
      status,
      regDeadline,
      submitDeadline: submitDeadline || undefined,
      announcementDate: announcementDate || undefined,
      eventDate: eventDate || undefined,
      organizer: organizer.trim() || undefined,
      details: details.trim(),
      infoUrl: infoUrl.trim() || undefined,
      driveUrl: driveUrl.trim() || undefined,
      submissionUrl: submissionUrl.trim() || undefined,
      documentsUrl: documentsUrl.trim() || undefined,
      year: Number(year) || new Date().getFullYear(),
      tags: parsedTags,
      level: level ? level : undefined,
      achievement: status === 'SELESAI' && achievement.trim() ? achievement.trim() : undefined,
      jenisPrestasi: status === 'SELESAI' && jenisPrestasi.trim() ? jenisPrestasi.trim() : undefined,
    });

    onClose();
  };

  return (
    <AnimatePresence>
    {isOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="glass-card rounded-3xl w-full max-w-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col shadow-2xl"
      >
        
        {/* Header Form */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-[#121215]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Trophy className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-zinc-100 text-lg">
              {initialData ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 p-1.5 rounded-xl hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs sm:text-sm overflow-y-auto flex-1 pr-3 scrollbar-thin">
          
          {/* Row 1: Nama Kegiatan & Penyelenggara */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-zinc-300 flex items-center gap-1">
                Nama Kegiatan <span className="text-rose-400">*</span>
              </label>
              <input
                id="input-activity-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Youth Action Forum 5.0"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#121215] border border-zinc-800 focus:outline-none focus:border-indigo-500 text-zinc-100 font-medium placeholder-zinc-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-300 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-zinc-400" /> Penyelenggara
              </label>
              <input
                id="input-activity-organizer"
                type="text"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="Misal: Kominfo / BEM UI"
                className="w-full px-3.5 py-2 rounded-xl bg-[#121215] border border-zinc-800 focus:outline-none focus:border-indigo-500 text-zinc-100 placeholder-zinc-500"
              />
            </div>
          </div>

          {/* Tautan Pedoman Kegiatan */}
          <div className="space-y-1">
            <label className="font-semibold text-zinc-300 flex items-center gap-1">
              <Link2 className="w-3.5 h-3.5 text-indigo-400" /> Link Pedoman Kegiatan (Website/Guidebook)
            </label>
            <input
              id="input-activity-info-url"
              type="url"
              value={infoUrl}
              onChange={(e) => setInfoUrl(e.target.value)}
              placeholder="Contoh: https://lomba.com/pedoman-kegiatan"
              className="w-full px-3.5 py-2 rounded-xl bg-[#121215] border border-zinc-800 focus:outline-none focus:border-indigo-500 text-zinc-100 placeholder-zinc-500"
            />
          </div>

          {/* Row 2: Kategori, Status Pendaftaran, & Tahun */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Kategori */}
            <div className="space-y-1">
              <label className="font-semibold text-zinc-300">
                Kategori <span className="text-rose-400">*</span>
              </label>
              <select
                id="select-activity-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#121215] border border-zinc-800 focus:outline-none focus:border-indigo-500 text-zinc-100 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-zinc-900 text-zinc-100">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Pendaftaran */}
            <div className="space-y-1">
              <label className="font-semibold text-zinc-300">
                Status Pendaftaran <span className="text-rose-400">*</span>
              </label>
              <select
                id="select-activity-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusPendaftaran)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#121215] border border-zinc-800 focus:outline-none focus:border-indigo-500 text-zinc-300 cursor-pointer font-medium"
              >
                <option value="BELUM_DAFTAR" className="bg-zinc-900 text-zinc-300">Belum Daftar</option>
                <option value="SUDAH_DAFTAR" className="bg-zinc-900 text-zinc-300">Sudah Daftar</option>
                <option value="LOLOS" className="bg-zinc-900 text-zinc-300">Lolos</option>
                <option value="TIDAK_LOLOS" className="bg-zinc-900 text-zinc-300">Tidak Lolos</option>
                <option value="SELESAI" className="bg-zinc-900 text-zinc-300">Selesai</option>
              </select>
            </div>

            {/* Tahun Kegiatan */}
            <div className="space-y-1">
              <label className="font-semibold text-zinc-300">
                Tahun Kegiatan
              </label>
              <input
                id="input-activity-year"
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                min={2020}
                max={2030}
                className="w-full px-3.5 py-2 rounded-xl bg-[#121215] border border-zinc-800 focus:outline-none focus:border-indigo-500 text-zinc-100 font-medium"
              />
            </div>

            {/* Tingkat Kegiatan */}
            <div className="space-y-1">
              <label className="font-semibold text-zinc-300">
                Tingkat Kegiatan
              </label>
              <select
                id="select-activity-level"
                value={level}
                onChange={(e) => setLevel(e.target.value as ActivityLevel)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#121215] border border-zinc-800 focus:outline-none focus:border-indigo-500 text-zinc-100 cursor-pointer font-medium"
              >
                <option value="" className="bg-zinc-900 text-zinc-100">- Pilih Tingkat -</option>
                <option value="Internasional" className="bg-zinc-900 text-zinc-100">Internasional</option>
                <option value="Nasional" className="bg-zinc-900 text-zinc-100">Nasional</option>
                <option value="Provinsi" className="bg-zinc-900 text-zinc-100">Provinsi</option>
                <option value="Kota/Kabupaten" className="bg-zinc-900 text-zinc-100">Kota/Kabupaten</option>
                <option value="Universitas/Instansi" className="bg-zinc-900 text-zinc-100">Universitas/Instansi</option>
                <option value="Fakultas/Prodi" className="bg-zinc-900 text-zinc-100">Fakultas/Prodi</option>
                <option value="Lainnya" className="bg-zinc-900 text-zinc-100">Lainnya</option>
              </select>
            </div>

          </div>

          {/* Kolom Capaian & Jenis Prestasi Jika Selesai */}
          {status === 'SELESAI' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div className="space-y-1">
                <label className="font-semibold text-amber-400 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" /> Capaian / Penghargaan (Juara Brp)
                </label>
                <input
                  id="input-activity-achievement"
                  type="text"
                  value={achievement}
                  onChange={(e) => setAchievement(e.target.value)}
                  placeholder="Contoh: Juara 1, Juara 2, Juara 3, Finalis..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#121215] border border-zinc-800 focus:outline-none focus:border-amber-500 text-zinc-100 font-medium placeholder-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-emerald-400 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" /> Jenis Prestasi
                </label>
                <input
                  id="input-activity-jenis-prestasi"
                  type="text"
                  value={jenisPrestasi}
                  onChange={(e) => setJenisPrestasi(e.target.value)}
                  placeholder="Contoh: Akademik, Riset, Olahraga, dsb."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#121215] border border-zinc-800 focus:outline-none focus:border-emerald-500 text-zinc-100 font-medium placeholder-zinc-500"
                />
              </div>
            </motion.div>
          )}

          {/* Row 3: Tanggal-Tanggal Penting */}
          <div className="p-4 rounded-2xl bg-[#121215] border border-zinc-800/80 space-y-3">
            <h4 className="font-bold text-zinc-100 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" /> Tanggal-Tanggal Penting
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Deadline Pendaftaran */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400">
                  Deadline Pendaftaran <span className="text-rose-400">*</span>
                </label>
                <input
                  id="input-activity-reg-deadline"
                  type="date"
                  value={regDeadline}
                  onChange={(e) => setRegDeadline(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-[#0c0c0e] border border-zinc-800 focus:outline-none focus:border-indigo-500 text-zinc-100"
                />
              </div>

              {/* Deadline Submit Karya */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400">
                  Deadline Submit Karya
                </label>
                <input
                  id="input-activity-submit-deadline"
                  type="date"
                  value={submitDeadline}
                  onChange={(e) => setSubmitDeadline(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-[#0c0c0e] border border-zinc-800 focus:outline-none focus:border-indigo-500 text-zinc-100"
                />
              </div>

              {/* Tanggal Pengumuman */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400">
                  Tanggal Pengumuman
                </label>
                <input
                  id="input-activity-announcement-date"
                  type="date"
                  value={announcementDate}
                  onChange={(e) => setAnnouncementDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-[#0c0c0e] border border-zinc-800 focus:outline-none focus:border-indigo-500 text-zinc-100"
                />
              </div>

              {/* Tanggal Pelaksanaan */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400">
                  Tanggal Pelaksanaan
                </label>
                <input
                  id="input-activity-event-date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-[#0c0c0e] border border-zinc-800 focus:outline-none focus:border-indigo-500 text-zinc-100"
                />
              </div>

            </div>
          </div>

          {/* Row 4: Detail & Benefit */}
          <div className="space-y-1">
            <label className="font-semibold text-zinc-300 flex items-center justify-between">
              <span>Detail & Benefit Kegiatan</span>
              <span className="text-xs text-zinc-500 font-normal">Akomodasi, hadiah, catatan khusus</span>
            </label>
            <textarea
              id="input-activity-details"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Jelaskan benefit (Fully funded/hadiah), syarat khusus, atau catatan pribadi..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#121215] border border-zinc-800 focus:outline-none focus:border-indigo-500 text-zinc-100 resize-none placeholder-zinc-500"
            />
          </div>

          {/* Row 5: Tautan Berkas & Arsip (Google Drive, Submit, Persyaratan) */}
          <div className="p-4 rounded-2xl bg-[#121215] border border-zinc-800/80 space-y-3">
            <h4 className="font-bold text-zinc-100 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-emerald-400" /> Tautan Berkas & Pengarsipan (Google Drive / URL)
            </h4>

            <div className="space-y-3">
              {/* Google Drive Sertifikat/Arsip */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
                  Google Drive Sertifikat / Arsip Hasil
                </label>
                <input
                  id="input-activity-drive-url"
                  type="url"
                  value={driveUrl}
                  onChange={(e) => setDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0c0c0e] border border-zinc-800 focus:outline-none focus:border-indigo-500 text-zinc-100 placeholder-zinc-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Tautan Submit Karya */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400">
                    Tautan Submit Karya / Form Lomba
                  </label>
                  <input
                    id="input-activity-submission-url"
                    type="url"
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    placeholder="https://lomba.com/submit"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0c0c0e] border border-zinc-800 focus:outline-none focus:border-indigo-500 text-zinc-100 placeholder-zinc-500"
                  />
                </div>

                {/* Tautan Berkas Persyaratan */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400">
                    Tautan Berkas Persyaratan (Proposal/KTM/CV)
                  </label>
                  <input
                    id="input-activity-documents-url"
                    type="url"
                    value={documentsUrl}
                    onChange={(e) => setDocumentsUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#0c0c0e] border border-zinc-800 focus:outline-none focus:border-indigo-500 text-zinc-100 placeholder-zinc-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tag / Label */}
          <div className="space-y-1">
            <label className="font-semibold text-zinc-300 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-zinc-400" /> Tag (Pisahkan dengan koma)
            </label>
            <input
              id="input-activity-tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Contoh: Fully Funded, Juara 1, Tim 3 Orang"
              className="w-full px-3.5 py-2 rounded-xl bg-[#121215] border border-zinc-800 focus:outline-none focus:border-indigo-500 text-zinc-100 placeholder-zinc-500"
            />
          </div>

          {/* Footer Form Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-400 font-semibold hover:bg-zinc-800 hover:text-zinc-100 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              id="btn-save-activity"
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 border border-indigo-400/30 active:scale-95 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Kegiatan</span>
            </button>
          </div>

        </form>

      </motion.div>
    </div>
    )}
    </AnimatePresence>
  );
};
