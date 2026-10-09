import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { db } from "@/server/db/client";
import { listActiveCategories } from "@/server/modules/catalog/queries";
export const revalidate = 60;

let cachedSettings: {
  data: { supportEmail: string | null; supportWhatsapp: string | null } | null;
  expiresAt: number;
} | null = null;

async function getStoreSettingsContact() {
  const now = Date.now();
  if (cachedSettings && cachedSettings.expiresAt > now) {
    return cachedSettings.data;
  }
  const data = await db.storeSettings
    .findUnique({ where: { id: 1 }, select: { supportEmail: true, supportWhatsapp: true } })
    .catch(() => null);
  cachedSettings = { data, expiresAt: now + 60_000 };
  return data;
}

export default async function StoreLayout({ children }: { children: ReactNode }) {
  let categories: Awaited<ReturnType<typeof listActiveCategories>> = [];
  let settings: { supportEmail: string | null; supportWhatsapp: string | null } | null = null;

  try {
    const [cats, st] = await Promise.all([
      listActiveCategories(db).catch(() => []),
      getStoreSettingsContact(),
    ]);
    categories = cats;
    settings = st;
  } catch (err) {
    console.error("[store:layoutError]", err);
  }

  const topCategories = categories.filter((c) => c.parentId === null);

  return (
    <>
      <Header cartCount={0} categories={topCategories} />
      <main id="konten" className="pb-20 md:pb-0">
        {children}
      </main>
      <Footer supportEmail={settings?.supportEmail ?? null} supportWhatsapp={settings?.supportWhatsapp ?? null} />
      <MobileBottomNav cartCount={0} />
    </>
  );
}
