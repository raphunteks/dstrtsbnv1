import type { ReactNode } from "react";

export const metadata = {
  title: "Admin Panel — Daster Tasbon Olshop",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
