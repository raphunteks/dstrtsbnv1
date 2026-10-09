"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/server/db/client";
import { getStaffActor } from "@/server/auth/staff";
import type { StaffActor } from "@/server/auth/permissions";
import { transitionOrder, shipManually } from "@/server/modules/orders/fulfillment";
import { setProductStatus } from "@/server/modules/catalog/commands";
import { getEnv } from "@/server/env";
import { approveRefund } from "@/server/modules/refunds/service";
import { updateStoreSettings } from "@/server/modules/admin/settings";
import { isDomainError } from "@/server/errors";

/** Helper untuk mendapatkan aktor staf (dengan toleransi development bila belum enroll MFA). */
async function getEffectiveStaffActor(): Promise<StaffActor> {
  try {
    return await getStaffActor();
  } catch (err) {
    if (getEnv().NODE_ENV !== "production") {
      // Fallback dev actor khusus lokal agar testing admin tidak terblokir
      return {
        userId: "00000000-0000-0000-0000-000000000001",
        roles: ["super_admin"],
      };
    }
    throw err;
  }
}

export type AdminActionResult = { ok: true } | { ok: false; message: string };

/** Transisi status fulfillment pesanan (FR-049). */
export async function updateOrderFulfillmentAction(
  orderId: string,
  transition: "startPicking" | "markPacked" | "markDelivered" | "reportException",
  note?: string,
): Promise<AdminActionResult> {
  try {
    const actor = await getEffectiveStaffActor();
    await transitionOrder(db, actor, orderId, transition, note);
    revalidatePath("/admin/pesanan");
    revalidatePath(`/admin/pesanan/${orderId}`);
    return { ok: true };
  } catch (err) {
    if (isDomainError(err)) return { ok: false, message: err.message };
    console.error("[admin:transition]", err);
    return { ok: false, message: "Gagal memperbarui status fulfillment." };
  }
}

/** Input resi pengiriman kurir manual (FR-050). */
export async function shipOrderManualAction(data: {
  orderId: string;
  courierCode: string;
  serviceCode: string;
  waybill: string;
  costIdr: number;
}): Promise<AdminActionResult> {
  try {
    const actor = await getEffectiveStaffActor();
    await shipManually(db, actor, data);
    revalidatePath("/admin/pesanan");
    revalidatePath(`/admin/pesanan/${data.orderId}`);
    return { ok: true };
  } catch (err) {
    if (isDomainError(err)) return { ok: false, message: err.message };
    console.error("[admin:ship]", err);
    return { ok: false, message: "Gagal mencatat resi pengiriman." };
  }
}

/** Ubah status katalog produk (FR-042). */
export async function toggleProductStatusAction(
  productId: string,
  status: "draft" | "published" | "archived",
): Promise<AdminActionResult> {
  try {
    const actor = await getEffectiveStaffActor();
    await setProductStatus(db, actor, productId, status);
    revalidatePath("/admin/katalog");
    return { ok: true };
  } catch (err) {
    if (isDomainError(err)) return { ok: false, message: err.message };
    console.error("[admin:toggleProduct]", err);
    return { ok: false, message: "Gagal mengubah status produk." };
  }
}

const createCouponSchema = z.object({
  code: z.string().trim().min(3).max(30).toUpperCase(),
  type: z.enum(["percentage", "fixed_amount"]),
  value: z.number().int().min(1),
  minSubtotalIdr: z.number().int().min(0).optional(),
  maxDiscountIdr: z.number().int().min(0).optional(),
  usageLimit: z.number().int().min(1).optional(),
  startsAt: z.string(),
  endsAt: z.string(),
});

/** Buat kupon promo baru (FR-055). */
export async function createCouponAction(raw: z.input<typeof createCouponSchema>): Promise<AdminActionResult> {
  try {
    const parsed = createCouponSchema.safeParse(raw);
    if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Input tidak valid" };

    const { code, type, value, minSubtotalIdr, maxDiscountIdr, usageLimit, startsAt, endsAt } = parsed.data;

    await db.coupon.create({
      data: {
        code,
        type,
        value,
        minSubtotalIdr: minSubtotalIdr ?? null,
        maxDiscountIdr: maxDiscountIdr ?? null,
        usageLimit: usageLimit ?? null,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        active: true,
      },
    });

    revalidatePath("/admin/promosi");
    return { ok: true };
  } catch (err) {
    console.error("[admin:createCoupon]", err);
    return { ok: false, message: "Gagal membuat kupon baru. Kode mungkin sudah ada." };
  }
}

/** Setujui pengajuan refund manual (FR-057). */
export async function approveRefundAction(refundId: string): Promise<AdminActionResult> {
  try {
    const actor = await getEffectiveStaffActor();
    await approveRefund(db, actor, refundId);
    revalidatePath("/admin/keuangan");
    return { ok: true };
  } catch (err) {
    if (isDomainError(err)) return { ok: false, message: err.message };
    console.error("[admin:approveRefund]", err);
    return { ok: false, message: "Gagal menyetujui refund." };
  }
}

/** Update pengaturan toko (FR-061). */
export async function updateSettingsAction(data: {
  supportEmail?: string | null;
  supportWhatsapp?: string | null;
  reservationHoldMinutes?: number;
  shippingCouriers?: string[];
  warehouseOriginId?: string | null;
  warehouseOriginLabel?: string | null;
}): Promise<AdminActionResult> {
  try {
    const actor = await getEffectiveStaffActor();
    await updateStoreSettings(db, actor, {
      supportEmail: data.supportEmail,
      supportWhatsapp: data.supportWhatsapp,
      reservationHoldMinutes: data.reservationHoldMinutes,
      shippingCouriers: data.shippingCouriers,
    });
    if (data.warehouseOriginId !== undefined || data.warehouseOriginLabel !== undefined) {
      await db.fulfillmentSource.updateMany({
        where: { code: "GUDANG-UTAMA" },
        data: {
          rajaongkirOriginId: data.warehouseOriginId ?? null,
          originLabel: data.warehouseOriginLabel ?? undefined,
        },
      });
    }
    revalidatePath("/admin/pengaturan");
    revalidatePath("/checkout");
    return { ok: true };
  } catch (err) {
    if (isDomainError(err)) return { ok: false, message: err.message };
    console.error("[admin:updateSettings]", err);
    return { ok: false, message: "Gagal menyimpan pengaturan toko." };
  }
}
