/**
 * Variabel NEXT_PUBLIC_* — aman untuk browser.
 * Dilengkapi fallback untuk PUBLIC_PUBLIC_* dan pembersihan tanda kutip otomatis.
 */
function clean(val: string | undefined): string {
  if (!val) return "";
  const v = val.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1).trim();
  }
  return v;
}

export const publicEnv = {
  supabaseUrl: clean(
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.PUBLIC_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL
  ),
  supabaseAnonKey: clean(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.PUBLIC_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.PUBLIC_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY
  ),
} as const;

export function assertPublicEnv() {
  if (!publicEnv.supabaseUrl || !publicEnv.supabaseAnonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/ANON_KEY wajib diisi di Vercel Environment Variables.",
    );
  }
  return publicEnv;
}
