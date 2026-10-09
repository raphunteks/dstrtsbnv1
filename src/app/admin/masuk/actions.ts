"use server";

import { z } from "zod";
import { getSupabaseServer } from "@/server/supabase/server";
import { publicEnv } from "@/lib/public-env";
import { db } from "@/server/db/client";

const staffLoginSchema = z.object({
  email: z.string().trim().email("Format email staf tidak valid."),
  password: z.string().min(6, "Kata sandi minimal 6 karakter."),
});

export type StaffLoginResult =
  | { ok: true; needMfa?: boolean }
  | { ok: false; message: string };

export async function loginStaff(formData: FormData): Promise<StaffLoginResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const parsed = staffLoginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  if (!publicEnv.supabaseUrl || !publicEnv.supabaseAnonKey) {
    return { ok: false, message: "Layanan Supabase belum dikonfigurasi di server." };
  }

  try {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      return { ok: false, message: "Kredensial staf salah atau akun dinonaktifkan." };
    }

    const userId = data.user?.id;
    if (!userId) {
      return { ok: false, message: "Pengguna tidak ditemukan." };
    }

    // Cek apakah user memiliki peran di app.StaffRole
    const account = await db.user.findUnique({
      where: { id: userId },
      select: {
        status: true,
        staffRoles: { select: { role: true } },
      },
    });

    if (!account || account.status !== "active" || account.staffRoles.length === 0) {
      await supabase.auth.signOut();
      return { ok: false, message: "Akun ini tidak memiliki hak akses ke panel admin toko." };
    }

    // Cek AAL2 MFA (SEC-001)
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal?.currentLevel !== "aal2") {
      return {
        ok: true,
        needMfa: true,
      };
    }

    return { ok: true };
  } catch (err) {
    console.error("[admin:loginStaff]", err);
    return { ok: false, message: "Terjadi kesalahan internal. Silakan coba lagi." };
  }
}

export async function logoutStaff() {
  const supabase = await getSupabaseServer();
  await supabase.auth.signOut();
}
