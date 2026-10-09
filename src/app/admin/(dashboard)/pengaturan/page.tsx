import { db } from "@/server/db/client";
import { SettingsClientView } from "./SettingsClientView";

export const dynamic = "force-dynamic";

export default async function AdminPengaturanPage() {
  let settings = null;
  let warehouse = null;
  let auditLogs: Array<{
    id: string;
    action: string;
    targetType: string;
    targetId: string | null;
    reason: string | null;
    createdAt: Date;
  }> = [];

  try {
    const [s, w, a] = await Promise.all([
      db.storeSettings.findUnique({ where: { id: 1 } }),
      db.fulfillmentSource.findFirst({ where: { code: "GUDANG-UTAMA" } }),
      db.auditLog.findMany({
        take: 50,
        orderBy: { createdAt: "desc" },
      }),
    ]);
    settings = s;
    warehouse = w;
    auditLogs = a;
  } catch (err) {
    console.error("[admin:pengaturan:dbError]", err);
  }

  return <SettingsClientView settings={settings} warehouse={warehouse} auditLogs={auditLogs} />;
}
