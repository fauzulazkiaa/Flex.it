import React from 'react';
import Image from 'next/image';
import { 
  Trophy, 
  Sparkles, 
  Database, 
  Shield, 
  Zap, 
  BarChart3, 
  Calendar, 
  ArrowRight, 
  Compass, 
  CheckCircle2,
  Lock,
  LayoutDashboard,
  TableProperties,
  FolderHeart,
  History,
  TrendingUp,
  Clock,
  Instagram,
  Linkedin
} from 'lucide-react';
import { motion } from 'motion/react';
import { GlobalHeader } from './GlobalHeader';
import { GlobalFooter } from './GlobalFooter';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#030303] text-zinc-300 font-sans selection:bg-emerald-500 selection:text-black overflow-hidden relative">
      
      {/* Background Glowing Blobs (Supabase Aesthetic) */}
      <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Grid Pattern overlay - Extended and subtly visible throughout */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f11_1px,transparent_1px),linear-gradient(to_bottom,#0f0f11_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_30%,#000_80%,transparent_100%)] pointer-events-none z-0" />

      {/* Top Header Navbar */}
      <GlobalHeader />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" /> 🚀 Pusat Data Portofolio Valid No Debat
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-100 max-w-4xl mx-auto leading-[1.1] mb-6">
          Kelola Ambisi,<br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            Rangkai Prestasi.
          </span>
        </h1>

        <p className="text-xs sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          Jangan biarkan kerja kerasmu tenggelam di folder yang berantakan. Bangun &quot;pusat data diri&quot; untuk menyusun jejak akademik, organisasi, dan kompetisimu. Dari persiapan beasiswa S2 hingga apply kerja, jadikan prestasimu bukti yang valid, no debat.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="/sign-up"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-zinc-950 bg-emerald-400 hover:bg-emerald-300 shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            Bangun Portofoliomu Sekarang (Gratis!)
            <ArrowRight className="w-4.5 h-4.5" />
          </a>
          <a 
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition active:scale-95"
          >
            Pelajari Fitur
          </a>
        </div>

        {/* Dashboard Mockup (Premium Supabase-like Graphic - Fixed spacing and labels) */}
        <div className="mt-16 max-w-5xl mx-auto rounded-2xl border border-zinc-800 bg-[#08080a] p-2 shadow-2xl relative shadow-emerald-500/5 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent z-10 pointer-events-none" />
          
          {/* Header Browser Mock */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-900 bg-zinc-950/60 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="text-[11px] text-zinc-500 bg-zinc-900 px-12 py-1 rounded border border-zinc-800/60 font-mono">
              flexit.app/dashboard
            </div>
            <div className="w-8" />
          </div>
          
          {/* Mock Dashboard Layout */}
          <div className="bg-zinc-950/40 grid grid-cols-12 min-h-[350px] text-left opacity-90 group-hover:opacity-100 transition-opacity duration-300">
            
            {/* Sidebar Mock - High Fidelity with Labels */}
            <div className="col-span-3 border-r border-zinc-900 p-4 space-y-6 hidden md:block">
              <div className="flex items-center gap-2 px-2">
                <Image src="/logo.png" alt="Flex.it Logo" width={24} height={24} className="w-6 h-6 object-contain rounded-md shadow-sm" />
                <span className="text-xs font-bold text-zinc-200">Flex.it</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 px-3 py-2 bg-emerald-950/30 text-emerald-400 border border-emerald-900/40 rounded-lg text-xs font-semibold">
                  <LayoutDashboard className="w-3.5 h-3.5" /> 
                  <span>Dashboard</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 text-zinc-400 hover:text-zinc-200 rounded-lg text-xs cursor-pointer transition-colors">
                  <TableProperties className="w-3.5 h-3.5" /> 
                  <span>Daftar & Filter</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 text-zinc-400 hover:text-zinc-200 rounded-lg text-xs cursor-pointer transition-colors">
                  <FolderHeart className="w-3.5 h-3.5" /> 
                  <span>Rekap Prestasi</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 text-zinc-400 hover:text-zinc-200 rounded-lg text-xs cursor-pointer transition-colors">
                  <History className="w-3.5 h-3.5" /> 
                  <span>Roadmap</span>
                </div>
              </div>
            </div>
            
            {/* Core Mock Content - Dense and aligned */}
            <div className="col-span-12 md:col-span-9 p-5 space-y-5">
              
              {/* Stat Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="border border-zinc-900 bg-zinc-900/20 p-4 rounded-xl space-y-1">
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">TOTAL KEGIATAN</div>
                  <div className="text-xl sm:text-2xl font-black text-zinc-200">18</div>
                </div>
                <div className="border border-emerald-900/40 bg-emerald-950/10 p-4 rounded-xl space-y-1">
                  <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> SUCCESS RATE
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-300">75%</div>
                </div>
                <div className="border border-zinc-900 bg-zinc-900/20 p-4 rounded-xl space-y-1">
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3" /> TENGGAT DEKAT
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400">3 Hari</div>
                </div>
              </div>
              
              {/* Activity List table */}
              <div className="border border-zinc-900 bg-zinc-900/10 p-4 rounded-xl space-y-3">
                <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Tenggat Waktu Terdekat</div>
                <div className="space-y-2">
                  <div className="h-10 bg-zinc-900/40 border border-zinc-900 rounded-lg flex items-center justify-between px-3">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-xs text-zinc-200 font-medium">Youth Action Forum 5.0</span>
                    </div>
                    <span className="text-[9px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-900/60 px-2 py-0.5 rounded-full">Lolos</span>
                  </div>
                  <div className="h-10 bg-zinc-900/40 border border-zinc-900 rounded-lg flex items-center justify-between px-3">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                      <span className="text-xs text-zinc-200 font-medium">AI Innovation Hackathon</span>
                    </div>
                    <span className="text-[9px] font-bold bg-zinc-900 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded-full">Belum Daftar</span>
                  </div>
                  <div className="h-10 bg-zinc-900/40 border border-zinc-900 rounded-lg flex items-center justify-between px-3">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="text-xs text-zinc-200 font-medium">National Business Plan Competition</span>
                    </div>
                    <span className="text-[9px] font-bold bg-blue-950/60 text-blue-400 border border-blue-900/60 px-2 py-0.5 rounded-full">Sudah Daftar</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 relative z-10 border-t border-zinc-900">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 mb-4 tracking-tight">
            Masih Panik Cari Sertifikat Pas Deadline Semakin Dekat?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
            Kami tahu lelahnya mencari bukti sertifikat lomba atau surat tugas saat penutupan pendaftaran LPDP di depan mata. Waktumu terlalu berharga untuk sekadar bongkar arsip lama. Temukan fitur yang bikin kamu tampil sebagai Main Character:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl border border-zinc-850 bg-zinc-950/20 hover:border-emerald-500/40 hover:bg-zinc-900/10 transition-all duration-300 transform hover:-translate-y-1 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-900/30">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-100">Kategorisasi Cerdas</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Akademik, Kepanitiaan, Sertifikasi, atau Pengabdian Masyarakat? Semua dikelompokkan secara otomatis dan rapi.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl border border-zinc-850 bg-zinc-950/20 hover:border-emerald-500/40 hover:bg-zinc-900/10 transition-all duration-300 transform hover:-translate-y-1 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-900/30">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-100">Roadmap Prestasi Visual</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Lihat character arc kamu! Pantau perkembangan dan pertumbuhan dirimu dari tahun ke tahun lewat peta perjalanan visual yang premium.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl border border-zinc-850 bg-zinc-950/20 hover:border-emerald-500/40 hover:bg-zinc-900/10 transition-all duration-300 transform hover:-translate-y-1 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-900/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-100">Progres Real-Time</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Lacak setiap ambisimu. Dari status &quot;Baru Direncanakan&quot; sampai berhasil &quot;Menang Juara 1&quot;, semua terdokumentasi dengan jelas.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl border border-zinc-850 bg-zinc-950/20 hover:border-emerald-500/40 hover:bg-zinc-900/10 transition-all duration-300 transform hover:-translate-y-1 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-900/30">
              <ArrowRight className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-100">Satu Klik untuk Berbagi</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Dapatkan tautan portofolio digital yang estetik. Tinggal bagikan, dan buat rekruter atau pewawancara terkesan seketika.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-2xl border border-zinc-850 bg-zinc-950/20 hover:border-emerald-500/40 hover:bg-zinc-900/10 transition-all duration-300 transform hover:-translate-y-1 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-900/30">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-100">Cepat, Aman, dan Seamless</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Dibangun dengan arsitektur modern berstandar industri. Data privasimu aman, fokus saja mengejar prestasi biar kami yang jaga jejak langkahmu.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-2xl border border-zinc-850 bg-zinc-950/20 hover:border-emerald-500/40 hover:bg-zinc-900/10 transition-all duration-300 transform hover:-translate-y-1 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-900/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-100">Main Character Energy</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Ubah jejak digitalmu menjadi kebanggaan. Pamerkan kerja kerasmu tanpa ragu dengan tampilan yang elegan dan sangat profesional.
            </p>
          </div>

        </div>
      </section>

      {/* Call to Action section (consistent button and style) */}
      <section className="relative z-10 border-t border-zinc-900 bg-[#050507]">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">Siap Membangun Jejak Digital yang Membanggakan?</h2>
          <div className="flex justify-center">
            <a 
              href="/sign-up"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-zinc-950 bg-emerald-400 hover:bg-emerald-300 shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Mulai Flexing Prestasimu Sekarang
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer copyright & Promo */}
      <GlobalFooter />
    </div>
  );
};
