import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from 'next';
import "./globals.css";

export const metadata: Metadata = {
  title: "Flex.it - Pusat Data Portofolio",
  description: "Pelacak Kegiatan, Kompetisi & Arsip Berkas",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' }
    ]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full dark">
      <body className="min-h-full flex flex-col bg-[#050505] text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white">
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
