"use server";

import { z } from "zod";
import { getSupabaseServer } from "@/server/supabase/server";
import { publicEnv } from "@/lib/public-env";

const loginSchema = z.object({
  email: z.string().trim().email("Format email tidak valid."),
  password: z.string().min(6, "Kata sandi minimal 6 karakter."),
});

export type LoginResult = { ok: true } | { ok: false; message: string };

export async function loginWithPassword(formData: FormData): Promise<LoginResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  if (!publicEnv.supabaseUrl || !publicEnv.supabaseAnonKey) {
    return { ok: false, message: "Layanan autentikasi belum terhubung ke Supabase." };
  }

  try {
    const supabase = await getSupabaseServer();
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return { ok: false, message: "Email atau kata sandi salah. Silakan periksa kembali." };
      }
      return { ok: false, message: error.message };
    }

    return { ok: true };
  } catch (err) {
    console.error("[auth:login]", err);
    return { ok: false, message: "Terjadi kesalahan saat masuk. Coba beberapa saat lagi." };
  }
}

export async function requestPasswordReset(formData: FormData): Promise<{ ok: boolean; message: string }> {
  const email = formData.get("email") as string;
  if (!email || !email.includes("@")) {
    return { ok: false, message: "Masukkan alamat email yang valid." };
  }

  if (!publicEnv.supabaseUrl || !publicEnv.supabaseAnonKey) {
    return { ok: true, message: "Jika email terdaftar, instruksi pemulihan telah dikirimkan." };
  }

  try {
    const supabase = await getSupabaseServer();
    // FR-032: Tidak mengungkap apakah email terdaftar ke publik (timing-safe).
    await supabase.auth.resetPasswordForEmail(email.trim());
  } catch {
    // Tangani secara tenang agar tidak ada enumerasi akun
  }

  return {
    ok: true,
    message: "Jika email kamu terdaftar di Daster Tasbon Olshop, kami telah mengirimkan tautan pemulihan kata sandi.",
  };
}
