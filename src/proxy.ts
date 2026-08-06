import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Tentukan rute mana saja yang bisa diakses publik (tanpa login)
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks/clerk(.*)',
  '/privacy(.*)',
  '/terms(.*)'
]);

export default clerkMiddleware(async (auth, request) => {
  try {
    if (!isPublicRoute(request)) {
      await auth.protect();
    }
  } catch (error: any) {
    // Tangkap error dan tampilkan ke layar agar kita tahu persis apa masalahnya di Vercel
    console.error("Middleware Error:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Middleware crashed", 
        message: error?.message || String(error)
      }), 
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
});

export const config = {
  matcher: [
    // Lewati internal Next.js dan file statis (gambar, css, dll)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Selalu jalankan middleware untuk rute API
    '/(api|trpc)(.*)',
  ],
};
