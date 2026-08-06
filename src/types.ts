export type StatusPendaftaran = 
  | 'BELUM_DAFTAR'
  | 'SUDAH_DAFTAR'
  | 'LOLOS'
  | 'TIDAK_LOLOS'
  | 'SELESAI';

export type ActivityLevel = 
  | 'Internasional' 
  | 'Nasional' 
  | 'Provinsi' 
  | 'Kota/Kabupaten' 
  | 'Universitas/Instansi' 
  | 'Fakultas/Prodi' 
  | 'Lainnya';

export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind bg/text color class or hex code
  iconName: string; // Lucide icon name indicator
  description?: string;
}

export interface Activity {
  id: string;
  userId?: string;
  title: string;
  categoryId: string;
  status: StatusPendaftaran;
  regDeadline: string;       // Tenggat Pendaftaran (YYYY-MM-DD)
  submitDeadline?: string;   // Tenggat Submit Karya (YYYY-MM-DD)
  announcementDate?: string; // Tanggal Pengumuman (YYYY-MM-DD)
  eventDate?: string;        // Tanggal Pelaksanaan (YYYY-MM-DD)
  organizer?: string;        // Penyelenggara / Organisasi
  details: string;           // Detail, Benefit, dsb
  infoUrl?: string;          // Tautan Informasi Lomba (Pedoman/Website/Postingan)
  driveUrl?: string;         // Tautan Arsip Berkas
  submissionUrl?: string;    // Tautan Submit Karya
  documentsUrl?: string;     // Tautan Dokumen Persyaratan
  year: number;              // Tahun kegiatan (misal: 2026)
  tags?: string[];
  level?: ActivityLevel;     // Tingkat kegiatan
  achievement?: string;      // Capaian/penghargaan jika selesai (misal: Juara 1)
  jenisPrestasi?: string;    // Jenis prestasi jika selesai (misal: Akademik/Non-Akademik)
  createdAt: string;
  updatedAt: string;
}

export interface ActivityFilterOptions {
  search: string;
  categoryId: string;
  status: string;
  year: string;
  sortBy: 'regDeadline' | 'eventDate' | 'title' | 'status' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-proyek-sosial', name: 'Proyek Sosial', color: 'emerald', iconName: 'HeartHandshake', description: 'Program pengabdian masyarakat & aksi sosial' },
  { id: 'cat-video-editing', name: 'Video Editing', color: 'purple', iconName: 'Video', description: 'Kompetisi videografi, sinematografi & editing' },
  { id: 'cat-essay', name: 'Essay', color: 'amber', iconName: 'FileText', description: 'Lomba karya tulis ilmiah, esai & artikel' },
  { id: 'cat-business-comp', name: 'Business Competition', color: 'blue', iconName: 'Briefcase', description: 'Business plan, pitch deck & case competition' },
  { id: 'cat-hackathon', name: 'Hackathon', color: 'indigo', iconName: 'Code2', description: 'Kompetisi pemrograman, AI & pengembangan produk' },
  { id: 'cat-infografis', name: 'Infografis', color: 'pink', iconName: 'Layout', description: 'Lomba desain grafis, poster & infografis' },
  { id: 'cat-youth-forum', name: 'Youth Forum', color: 'rose', iconName: 'Users', description: 'Konferensi pemuda, simposium & pertukaran budaya' },
  { id: 'cat-pelatihan', name: 'Pelatihan', color: 'teal', iconName: 'GraduationCap', description: 'Bootcamp, workshop & kursus bersertifikat' },
];

export const STATUS_LABELS: Record<StatusPendaftaran, { label: string; bg: string; text: string; border: string }> = {
  BELUM_DAFTAR: { label: 'Belum Daftar', bg: 'bg-zinc-900/80', text: 'text-zinc-300', border: 'border-zinc-800' },
  SUDAH_DAFTAR: { label: 'Sudah Daftar', bg: 'bg-blue-950/40', text: 'text-blue-400', border: 'border-blue-900/60' },
  LOLOS: { label: 'Lolos', bg: 'bg-emerald-950/40', text: 'text-emerald-400', border: 'border-emerald-900/60' },
  TIDAK_LOLOS: { label: 'Tidak Lolos', bg: 'bg-rose-950/40', text: 'text-rose-400', border: 'border-rose-900/60' },
  SELESAI: { label: 'Selesai', bg: 'bg-teal-950/40', text: 'text-teal-400', border: 'border-teal-900/60' },
};
