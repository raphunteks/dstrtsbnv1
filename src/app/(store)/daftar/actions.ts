"use server";

import { z } from "zod";
import { getSupabaseServer } from "@/server/supabase/server";
import { db } from "@/server/db/client";
import { publicEnv } from "@/lib/public-env";

const signUpSchema = z.object({
  displayName: z.string().trim().min(2, "Nama lengkap minimal 2 karakter.").max(80),
  email: z.string().trim().email("Format email tidak valid."),
  phone: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.trim() !== "" ? v.trim() : undefined)),
  password: z.string().min(6, "Kata sandi minimal 6 karakter."),
  termsAccepted: z.literal("on", {
    errorMap: () => ({ message: "Kamu wajib menyetujui Syarat & Ketentuan serta Kebijakan Privasi." }),
  }),
  marketingOptIn: z.enum(["on"]).optional(),
});

export type SignUpResult = { ok: true } | { ok: false; message: string };

export async function registerCustomer(formData: FormData): Promise<SignUpResult> {
  const raw = {
    displayName: formData.get("displayName") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || undefined,
    password: formData.get("password") as string,
    termsAccepted: formData.get("termsAccepted") as string,
    marketingOptIn: (formData.get("marketingOptIn") as string) || undefined,
  };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Data pendaftaran tidak valid." };
  }

  const { displayName, email, phone, password, marketingOptIn } = parsed.data;

  if (!publicEnv.supabaseUrl || !publicEnv.supabaseAnonKey) {
    return { ok: false, message: "Layanan autentikasi Supabase belum terkonfigurasi di server." };
  }

  try {
    const supabase = await getSupabaseServer();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          phone: phone ?? null,
        },
      },
    });

    if (authError) {
      if (authError.message.includes("User already registered")) {
        return { ok: false, message: "Email ini sudah terdaftar. Silakan masuk atau gunakan email lain." };
      }
      return { ok: false, message: authError.message };
    }

    const userId = authData.user?.id;
    if (userId) {
      // Sinkronkan data ke Postgres (schema app.User + CustomerProfile)
      try {
        await db.user.upsert({
          where: { id: userId },
          create: {
            id: userId,
            email,
            phone: phone ?? null,
            profile: {
              create: {
                displayName,
                marketingOptInAt: marketingOptIn === "on" ? new Date() : null,
              },
            },
          },
          update: {
            email,
            phone: phone ?? null,
          },
        });
      } catch (dbErr) {
        console.error("[register:dbSync]", dbErr);
        // Supabase Auth tetap sukses
      }
    }

    return { ok: true };
  } catch (err) {
    console.error("[auth:register]", err);
    return { ok: false, message: "Terjadi kesalahan saat pendaftaran. Coba beberapa saat lagi." };
  }
}
