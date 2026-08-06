import React from 'react';
import { GlobalHeader } from '../../components/GlobalHeader';
import { GlobalFooter } from '../../components/GlobalFooter';

export default function PrivacyPolicyPage() {
  const currentDate = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-300 font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* Background Subtle Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-900/40 via-[#030303] to-[#030303] pointer-events-none -z-10" />

      {/* Navigation */}
      <GlobalHeader />

      {/* Content */}
      <main className="max-w-[800px] mx-auto px-6 py-24">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2 text-zinc-100">Privacy Policy</h1>
        <p className="text-sm text-zinc-500 mb-12">Last Updated: {currentDate}</p>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-4 border-b border-zinc-800/80 pb-3">1. Pengumpulan Data</h2>
            <p className="text-zinc-300 leading-relaxed text-base sm:text-lg">
              Kami di Flex.it sangat menghargai privasi Anda. Saat Anda menggunakan layanan kami, kami mengumpulkan data profil dasar melalui layanan otentikasi pihak ketiga (Clerk/Google Auth). Selain itu, kami juga menyimpan data portofolio, kegiatan, dan dokumen yang Anda unggah secara sadar ke database kami yang dikelola secara aman menggunakan infrastruktur PostgreSQL dari Supabase.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-4 border-b border-zinc-800/80 pb-3">2. Penggunaan Data</h2>
            <p className="text-zinc-300 leading-relaxed text-base sm:text-lg">
              Data yang Anda berikan semata-mata digunakan untuk kepentingan Anda sendiri—yakni untuk memfasilitasi pembuatan, pengelolaan, dan penampilan portofolio digital Anda. Informasi ini membantu kami dalam menyajikan fitur-fitur seperti roadmap visual secara kronologis dan kalkulasi statistik <i className="text-emerald-400">success rate</i> yang dapat membantu Anda melacak capaian karir dan akademik secara akurat.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-4 border-b border-zinc-800/80 pb-3">3. Privasi & Keamanan</h2>
            <p className="text-zinc-300 leading-relaxed text-base sm:text-lg">
              Keamanan data Anda adalah prioritas utama kami. Flex.it menerapkan standar enkripsi industri modern untuk melindungi pertukaran dan penyimpanan informasi Anda. Kami berkomitmen penuh untuk <strong className="text-zinc-100">tidak pernah menjual, menyewakan, atau mendistribusikan</strong> data pribadi Anda kepada pihak ketiga manapun untuk tujuan komersial. Data Anda terisolasi dan hanya bisa diakses oleh Anda secara pribadi atau melalui tautan portofolio yang Anda bagikan secara sukarela.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-4 border-b border-zinc-800/80 pb-3">4. Hak Pengguna</h2>
            <p className="text-zinc-300 leading-relaxed text-base sm:text-lg">
              Anda memegang kendali penuh atas data Anda. Sebagai pengguna, Anda memiliki hak absolut untuk mengubah, menyembunyikan, atau menghapus informasi portofolio kapan saja. Jika Anda memutuskan untuk berhenti menggunakan layanan kami, Anda berhak menghapus akun beserta seluruh jejak rekam data dari server kami secara permanen.
            </p>
          </section>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}
