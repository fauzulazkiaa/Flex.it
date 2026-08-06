import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, useUser, useClerk } from '@clerk/nextjs';
import { 
  X, 
  User, 
  Shield, 
  Tag, 
  Database,
  Sparkles,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Edit3,
  Trash2,
  Save,
  LogOut
} from 'lucide-react';
import { exportDataAsJSON, importDataFromJSON, resetToSampleData } from '../utils/storage';
import { Category, Activity } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSaveCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onDataRefresh: (activities: Activity[], categories: Category[]) => void;
}

type TabType = 'account' | 'security' | 'categories' | 'data';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSaveCategory,
  onDeleteCategory,
  onDataRefresh
}) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // --- CATEGORY MANAGER STATE ---
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catColor, setCatColor] = useState('blue');
  const [catDescription, setCatDescription] = useState('');

  const startCreateCategory = () => {
    setEditingCat({ id: '', name: '', color: 'blue', iconName: 'Tag', description: '' });
    setCatName('');
    setCatColor('blue');
    setCatDescription('');
  };

  const startEditCategory = (cat: Category) => {
    setEditingCat(cat);
    setCatName(cat.name);
    setCatColor(cat.color || 'blue');
    setCatDescription(cat.description || '');
  };

  const handleSaveCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const catToSave: Category = {
      id: editingCat?.id ? editingCat.id : `cat-${Date.now()}`,
      name: catName.trim(),
      color: catColor,
      iconName: editingCat?.iconName || 'Tag',
      description: catDescription.trim() || undefined,
    };

    onSaveCategory(catToSave);
    setEditingCat(null);
  };

  // --- DATA BACKUP HANDLERS ---
  const handleExport = () => {
    const jsonStr = exportDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flexit_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const updated = importDataFromJSON(result);
        onDataRefresh(updated.activities, updated.categories);
        alert('Data berhasil diimpor!');
      } catch (err: any) {
        alert(err.message || 'Gagal mengimpor file data.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan data ke sampel awal? SEMUA DATA ANDA SAAT INI AKAN DIHAPUS.')) {
      const reset = resetToSampleData();
      onDataRefresh(reset.activities, reset.categories);
      alert('Data telah dikembalikan ke sampel awal.');
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setActiveTab('account'), 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-[95vw] max-w-[1280px] h-full max-h-[85vh] bg-[#0c0c0e] border border-zinc-800/80 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden"
          >
            {/* ═══════════════ SIDEBAR ═══════════════ */}
            <div className="w-full md:w-64 shrink-0 bg-[#121215] border-b md:border-b-0 md:border-r border-zinc-800/60 flex flex-col">
              <div className="p-6 border-b border-zinc-800/60 flex items-center justify-between md:block">
                <div>
                  <h2 className="text-xl font-extrabold text-zinc-100 tracking-tight">Pengaturan</h2>
                  <p className="text-xs text-zinc-500 mt-1">Konfigurasi akun dan sistem</p>
                </div>
                <button
                  onClick={handleClose}
                  className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible no-scrollbar">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                    activeTab === 'account'
                      ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/50 shadow-xs'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent'
                  }`}
                >
                  <User className={`w-4 h-4 ${activeTab === 'account' ? 'text-emerald-400' : ''}`} />
                  Akun & Profil
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                    activeTab === 'security'
                      ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/50 shadow-xs'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent'
                  }`}
                >
                  <Shield className={`w-4 h-4 ${activeTab === 'security' ? 'text-rose-400' : ''}`} />
                  Privasi & Keamanan
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                    activeTab === 'categories'
                      ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/50 shadow-xs'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent'
                  }`}
                >
                  <Tag className={`w-4 h-4 ${activeTab === 'categories' ? 'text-indigo-400' : ''}`} />
                  Kategori Kegiatan
                </button>
                <button
                  onClick={() => setActiveTab('data')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                    activeTab === 'data'
                      ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/50 shadow-xs'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent'
                  }`}
                >
                  <Database className={`w-4 h-4 ${activeTab === 'data' ? 'text-amber-400' : ''}`} />
                  Data & Backup
                </button>
              </div>

              {/* Bottom Spacer/Close button for desktop */}
              <div className="hidden md:flex flex-col gap-2 mt-auto p-4 border-t border-zinc-800/60">
                <button
                  onClick={() => signOut({ redirectUrl: '/' })}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar Akun
                </button>
                <button
                  onClick={handleClose}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-300 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  Tutup
                </button>
              </div>
            </div>

            {/* ═══════════════ MAIN CONTENT AREA ═══════════════ */}
            <div className="flex-1 overflow-y-auto scrollbar-thin relative">
              
              {/* TAB 1: ACCOUNT (Clerk UserProfile) */}
              {activeTab === 'account' && (
                <div className="p-6 md:p-8 animate-in fade-in duration-300 max-w-4xl mx-auto w-full">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-zinc-100">Profil & Autentikasi</h3>
                    <p className="text-sm text-zinc-400 mt-1">Kelola data diri, email, dan password Anda secara terpusat.</p>
                  </div>
                  
                  <div className="clerk-profile-container flex justify-start w-full">
                    <UserProfile 
                      routing="hash"
                      appearance={{
                        elements: {
                          rootBox: "w-full",
                          card: "bg-[#121215] border border-zinc-800/60 shadow-xl rounded-2xl w-full",
                          navbar: "hidden", // Hide Clerk's own sidebar since we built a better one
                          pageScrollBox: "p-4 sm:p-6",
                          headerTitle: "text-zinc-100 font-bold text-lg",
                          headerSubtitle: "text-zinc-400 text-sm",
                          profileSectionTitle: "border-b border-zinc-800/60 pb-2 mb-4",
                          profileSectionTitleText: "text-zinc-300 text-xs font-bold uppercase tracking-wider",
                          profileSectionContent: "text-zinc-300",
                          profileSectionPrimaryButton: "text-emerald-400 hover:text-emerald-300 text-xs font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20",
                          formFieldLabel: "text-zinc-300 text-xs",
                          formFieldInput: "bg-zinc-900/80 border-zinc-700/60 text-zinc-100 rounded-xl text-sm focus:border-emerald-500/50 focus:ring-emerald-500/20",
                          formButtonPrimary: "bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-xs px-4 py-2 shadow-lg shadow-emerald-500/15",
                          formButtonReset: "text-zinc-400 hover:text-zinc-200 text-xs px-4 py-2 rounded-xl",
                          badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded-full",
                          identityPreviewText: "text-zinc-300 text-sm font-medium",
                          identityPreviewEditButtonIcon: "text-emerald-400",
                          avatarBox: "border-2 border-zinc-700/80 w-16 h-16",
                          socialButtonsBlockButton: "bg-zinc-900/60 border-zinc-700/60 text-zinc-300 hover:bg-zinc-800 rounded-xl",
                          socialButtonsBlockButtonText: "text-zinc-300 text-xs font-semibold",
                          dividerLine: "bg-zinc-800/60",
                          dividerText: "text-zinc-500 text-[10px]",
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: SECURITY */}
              {activeTab === 'security' && (
                <div className="p-6 md:p-8 animate-in fade-in duration-300 max-w-3xl mx-auto w-full">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-zinc-100">Privasi & Keamanan</h3>
                    <p className="text-sm text-zinc-400 mt-1">Status sesi dan kebijakan perlindungan data Anda.</p>
                  </div>

                  <div className="space-y-6">
                    {/* Status Card */}
                    <div className="bg-[#121215] rounded-2xl border border-zinc-800/60 overflow-hidden">
                      <div className="p-5 border-b border-zinc-800/40 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <Shield className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-zinc-100">Status Keamanan</p>
                            <p className="text-xs text-zinc-400">Akun Anda terlindungi</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
                          Aman
                        </span>
                      </div>
                      
                      <div className="p-5 space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          <p className="text-sm text-zinc-400 leading-relaxed">Data portofolio Anda <span className="text-zinc-200 font-medium">hanya bisa diakses oleh Anda</span> dan tidak pernah dibagikan ke pihak ketiga.</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          <p className="text-sm text-zinc-400 leading-relaxed">Semua komunikasi dienkripsi dengan <span className="text-zinc-200 font-medium">TLS 1.3</span> standar industri.</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          <p className="text-sm text-zinc-400 leading-relaxed">Sistem autentikasi dikelola oleh Clerk yang tersertifikasi <span className="text-zinc-200 font-medium">SOC 2 Type II</span>.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CATEGORIES */}
              {activeTab === 'categories' && (
                <div className="p-6 md:p-8 animate-in fade-in duration-300 max-w-3xl mx-auto w-full">
                  <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-zinc-100">Manajemen Kategori Kegiatan</h3>
                      <p className="text-sm text-zinc-400 mt-1">Buat, ubah, dan hapus kategori pengelompokan portofolio.</p>
                    </div>
                    {!editingCat && (
                      <button
                        onClick={startCreateCategory}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition cursor-pointer shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        Tambah Kategori
                      </button>
                    )}
                  </div>

                  {editingCat ? (
                    <form onSubmit={handleSaveCategorySubmit} className="p-5 sm:p-6 rounded-2xl bg-indigo-950/20 border border-indigo-900/50 mb-6 space-y-4">
                      <h4 className="font-bold text-indigo-400 text-sm uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        {editingCat.id ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-400">Nama Kategori</label>
                          <input
                            type="text"
                            value={catName}
                            onChange={(e) => setCatName(e.target.value)}
                            placeholder="Misal: Kepanitiaan, Lomba..."
                            required
                            className="w-full px-4 py-2.5 rounded-xl bg-[#0c0c0e] border border-zinc-800 text-zinc-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-400">Deskripsi Singkat</label>
                          <input
                            type="text"
                            value={catDescription}
                            onChange={(e) => setCatDescription(e.target.value)}
                            placeholder="Penjelasan opsional..."
                            className="w-full px-4 py-2.5 rounded-xl bg-[#0c0c0e] border border-zinc-800 text-zinc-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-indigo-900/30">
                        <button
                          type="button"
                          onClick={() => setEditingCat(null)}
                          className="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 px-6 py-2 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          Simpan
                        </button>
                      </div>
                    </form>
                  ) : null}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-2">
                    {categories.map((cat) => (
                      <div key={cat.id} className="group flex items-center justify-between p-4 rounded-2xl bg-[#121215] border border-zinc-800 hover:border-zinc-700 transition">
                        <div>
                          <h4 className="font-bold text-zinc-100 flex items-center gap-2">
                            <Tag className="w-3.5 h-3.5 text-indigo-400" />
                            {cat.name}
                          </h4>
                          {cat.description && (
                            <p className="text-[11px] text-zinc-500 mt-1 line-clamp-1">{cat.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEditCategory(cat)}
                            className="p-2 rounded-lg text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (categories.length <= 1) {
                                alert('Minimal harus ada 1 kategori sistem!');
                                return;
                              }
                              if (confirm(`Hapus kategori "${cat.name}"? Kegiatan yang terkait kategori ini mungkin kehilangan referensinya.`)) {
                                onDeleteCategory(cat.id);
                              }
                            }}
                            className="p-2 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: DATA & BACKUP */}
              {activeTab === 'data' && (
                <div className="p-6 md:p-8 animate-in fade-in duration-300 max-w-3xl mx-auto w-full">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-zinc-100">Manajemen Data & Backup</h3>
                    <p className="text-sm text-zinc-400 mt-1">Ekspor data Anda sebagai cadangan atau impor data lama.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Export */}
                    <div className="p-6 rounded-2xl bg-[#121215] border border-zinc-800 space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                        <Download className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-100 text-lg">Ekspor Data</h4>
                        <p className="text-sm text-zinc-400 mt-1">Unduh seluruh portofolio dan kategori Anda ke dalam file JSON lokal.</p>
                      </div>
                      <button
                        onClick={handleExport}
                        className="w-full py-2.5 rounded-xl font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition cursor-pointer"
                      >
                        Unduh Backup (.json)
                      </button>
                    </div>

                    {/* Import */}
                    <div className="p-6 rounded-2xl bg-[#121215] border border-zinc-800 space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-100 text-lg">Impor Data</h4>
                        <p className="text-sm text-zinc-400 mt-1">Pulihkan data dari file JSON cadangan sebelumnya.</p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleImportFile}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2.5 rounded-xl font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition cursor-pointer"
                      >
                        Pilih File (.json)
                      </button>
                    </div>
                  </div>

                  {/* Reset Zone */}
                  <div className="mt-8 p-6 rounded-2xl bg-rose-950/20 border border-rose-900/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-rose-400 text-lg flex items-center gap-2">
                          <RotateCcw className="w-5 h-5" /> Zona Berbahaya
                        </h4>
                        <p className="text-sm text-rose-300/70 mt-1 max-w-md">Menghapus semua data yang ada dan mengembalikannya ke data sampel awal. Tindakan ini tidak dapat dibatalkan.</p>
                      </div>
                      <button
                        onClick={handleResetData}
                        className="shrink-0 px-6 py-2.5 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/20 transition cursor-pointer"
                      >
                        Reset ke Data Sampel
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
