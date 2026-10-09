import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { db } from "@/server/db/client";
import { listActiveCategories } from "@/server/modules/catalog/queries";
import { getCurrentCartCount } from "@/server/modules/cart/current";

export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: ReactNode }) {
  let cartCount = 0;
  let categories: Awaited<ReturnType<typeof listActiveCategories>> = [];
  let settings: { supportEmail: string | null; supportWhatsapp: string | null } | null = null;

  try {
    const [cCount, cats, st] = await Promise.all([
      getCurrentCartCount().catch(() => 0),
      listActiveCategories(db).catch(() => []),
      db.storeSettings.findUnique({ where: { id: 1 }, select: { supportEmail: true, supportWhatsapp: true } }).catch(() => null),
    ]);
    cartCount = cCount;
    categories = cats;
    settings = st;
  } catch (err) {
    console.error("[store:layoutError]", err);
  }

  const topCategories = categories.filter((c) => c.parentId === null);

  return (
    <>
      <Header cartCount={cartCount} categories={topCategories} />
      <main id="konten" className="pb-20 md:pb-0">
        {children}
      </main>
      <Footer supportEmail={settings?.supportEmail ?? null} supportWhatsapp={settings?.supportWhatsapp ?? null} />
      <MobileBottomNav cartCount={cartCount} />
    </>
  );
}
