"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/server/db/client";
import { getSupabaseServer } from "@/server/supabase/server";

export async function getAuthenticatedCustomer() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    include: {
      profile: true,
      addresses: {
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      },
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
        },
      },
    },
  });

  return { authUser: user, dbUser };
}

export async function signOutAction() {
  const supabase = await getSupabaseServer();
  await supabase.auth.signOut();
  redirect("/masuk");
}

const updateProfileSchema = z.object({
  displayName: z.string().trim().min(2, "Nama minimal 2 karakter.").max(80),
  phone: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.trim() !== "" ? v.trim() : null)),
  marketingOptIn: z.boolean().optional(),
});

export async function updateProfileAction(data: z.input<typeof updateProfileSchema>) {
  const customer = await getAuthenticatedCustomer();
  if (!customer) return { ok: false, message: "Silakan masuk terlebih dahulu." };

  const parsed = updateProfileSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  await db.user.update({
    where: { id: customer.authUser.id },
    data: {
      phone: parsed.data.phone,
      profile: {
        upsert: {
          create: {
            displayName: parsed.data.displayName,
            marketingOptInAt: parsed.data.marketingOptIn ? new Date() : null,
          },
          update: {
            displayName: parsed.data.displayName,
            ...(parsed.data.marketingOptIn !== undefined
              ? { marketingOptInAt: parsed.data.marketingOptIn ? new Date() : null }
              : {}),
          },
        },
      },
    },
  });

  revalidatePath("/akun");
  return { ok: true };
}

const addressSchema = z.object({
  label: z.string().trim().max(40).optional(),
  recipientName: z.string().trim().min(2, "Nama penerima wajib diisi.").max(80),
  phone: z.string().trim().min(8, "Nomor telepon minimal 8 digit.").max(20),
  provinceName: z.string().trim().min(2, "Provinsi wajib diisi."),
  cityName: z.string().trim().min(2, "Kota/kabupaten wajib diisi."),
  districtName: z.string().trim().min(2, "Kecamatan wajib diisi."),
  postalCode: z.string().trim().max(10).optional(),
  street: z.string().trim().min(5, "Alamat jalan wajib diisi lengkap.").max(300),
  landmark: z.string().trim().max(100).optional(),
  rajaongkirDestinationId: z.string().trim().optional(),
  isDefault: z.boolean().optional(),
});

export async function addAddressAction(data: z.infer<typeof addressSchema>) {
  const customer = await getAuthenticatedCustomer();
  if (!customer) return { ok: false, message: "Silakan masuk terlebih dahulu." };

  const parsed = addressSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Data alamat tidak valid." };
  }

  const userId = customer.authUser.id;
  const isDefault = Boolean(parsed.data.isDefault) || customer.dbUser?.addresses.length === 0;

  await db.$transaction(async (tx) => {
    if (isDefault) {
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    await tx.address.create({
      data: {
        userId,
        label: parsed.data.label || "Alamat Rumah",
        recipientName: parsed.data.recipientName,
        phone: parsed.data.phone,
        provinceName: parsed.data.provinceName,
        cityName: parsed.data.cityName,
        districtName: parsed.data.districtName,
        postalCode: parsed.data.postalCode ?? null,
        street: parsed.data.street,
        landmark: parsed.data.landmark ?? null,
        rajaongkirDestinationId: parsed.data.rajaongkirDestinationId ?? null,
        isDefault,
      },
    });
  });

  revalidatePath("/akun");
  return { ok: true };
}

export async function deleteAddressAction(addressId: string) {
  const customer = await getAuthenticatedCustomer();
  if (!customer) return { ok: false, message: "Silakan masuk terlebih dahulu." };

  // FR-035: Hanya bisa menghapus alamat miliknya sendiri
  await db.address.deleteMany({
    where: {
      id: addressId,
      userId: customer.authUser.id,
    },
  });

  revalidatePath("/akun");
  return { ok: true };
}

export async function setDefaultAddressAction(addressId: string) {
  const customer = await getAuthenticatedCustomer();
  if (!customer) return { ok: false, message: "Silakan masuk terlebih dahulu." };

  const userId = customer.authUser.id;

  await db.$transaction(async (tx) => {
    await tx.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
    await tx.address.updateMany({
      where: { id: addressId, userId },
      data: { isDefault: true },
    });
  });

  revalidatePath("/akun");
  return { ok: true };
}
