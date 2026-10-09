import { redirect } from "next/navigation";
import { getAuthenticatedCustomer } from "./actions";
import { AccountView } from "./AccountView";

export const metadata = {
  title: "Akun Saya — Daster Tasbon Olshop",
  description: "Kelola profil, buku alamat, dan riwayat pesanan kamu di Daster Tasbon Olshop.",
};

export default async function AkunPage() {
  const customer = await getAuthenticatedCustomer();

  if (!customer) {
    redirect("/masuk?next=/akun");
  }

  const { authUser, dbUser } = customer;

  return (
    <main>
      <AccountView
        email={authUser.email ?? dbUser?.email ?? ""}
        phone={dbUser?.phone ?? null}
        displayName={dbUser?.profile?.displayName ?? authUser.user_metadata?.display_name ?? null}
        marketingOptIn={Boolean(dbUser?.profile?.marketingOptInAt)}
        addresses={dbUser?.addresses ?? []}
        orders={(dbUser?.orders as unknown as Parameters<typeof AccountView>[0]["orders"]) ?? []}
      />
    </main>
  );
}
