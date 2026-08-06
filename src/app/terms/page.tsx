import React from 'react';
import { GlobalHeader } from '../../components/GlobalHeader';
import { GlobalFooter } from '../../components/GlobalFooter';

export default function TermsAndConditionsPage() {
  const currentDate = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-300 font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* Background Subtle Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-900/40 via-[#030303] to-[#030303] pointer-events-none -z-10" />

      {/* Navigation */}
      <GlobalHeader />

      {/* Content */}
      <main className="max-w-[800px] mx-auto px-6 py-24">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2 text-zinc-100">Terms & Conditions</h1>
        <p className="text-sm text-zinc-500 mb-12">Last Updated: {currentDate}</p>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-4 border-b border-zinc-800/80 pb-3">1. Penerimaan Syarat</h2>
            <p className="text-zinc-300 leading-relaxed text-base sm:text-lg">
              Selamat datang di Flex.it! Dengan mendaftar, mengakses, atau menggunakan layanan platform portofolio digital Flex.it, Anda secara sadar menyatakan bahwa Anda telah membaca, memahami, dan menyetujui seluruh syarat serta ketentuan yang berlaku dalam halaman ini. Jika Anda tidak menyetujui bagian mana pun dari ketentuan ini, Anda dipersilakan untuk tidak menggunakan layanan kami.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-4 border-b border-zinc-800/80 pb-3">2. Tanggung Jawab Pengguna</h2>
            <p className="text-zinc-300 leading-relaxed text-base sm:text-lg">
              Flex.it didesain sebagai platform profesional untuk memamerkan prestasi. Oleh karena itu, pengguna memiliki tanggung jawab penuh atas informasi pencapaian, dokumen, dan portofolio yang diunggah. Semua data haruslah valid dan dapat dipertanggungjawabkan kebenarannya. Dilarang keras menggunakan layanan ini untuk mengunggah konten ilegal, melanggar hak cipta, bermuatan kebencian, atau hal-hal yang membahayakan individu maupun pihak lain.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-4 border-b border-zinc-800/80 pb-3">3. Layanan Beta (v1.0)</h2>
            <p className="text-zinc-300 leading-relaxed text-base sm:text-lg">
              Saat ini, platform Flex.it berstatus rilis Beta (v1.0) dan masih berada dalam tahap pengembangan aktif. Oleh sebab itu, kami sangat menghargai pemakluman Anda apabila sewaktu-waktu terdapat pemeliharaan sistem terencana, <i className="text-emerald-400">bug</i> minor, atau pembaruan fitur yang mengharuskan layanan dihentikan sementara waktu demi meningkatkan kualitas aplikasi ke depannya.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-4 border-b border-zinc-800/80 pb-3">4. Kontak</h2>
            <p className="text-zinc-300 leading-relaxed text-base sm:text-lg">
              Jika Anda memiliki pertanyaan lebih lanjut, laporan kendala teknis, masukan terkait platform, atau hal lainnya seputar syarat dan ketentuan penggunaan layanan ini, jangan ragu untuk menghubungi tim kami secara langsung melalui email di <a href="mailto:support@flex.it" className="text-emerald-400 hover:text-emerald-300 hover:underline">support@flex.it</a>.
            </p>
          </section>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}
