import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Buat client Supabase standar (Bisa digunakan untuk fetch awal jika belum login)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fungsi untuk membuat client Supabase yang terhubung dengan token JWT dari Clerk (RLS)
export const createClerkSupabaseClient = (clerkToken: string) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${clerkToken}`,
      },
    },
  });
};
