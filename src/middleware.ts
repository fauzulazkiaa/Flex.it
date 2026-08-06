import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

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
  // Lindungi rute yang bukan publik
  if (!isPublicRoute(request)) {
    await auth.protect();
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
