import type { Metadata } from "next";
import { RoleProvider } from "@/lib/admin/permissions";

export const metadata: Metadata = {
  title: { default: "Back-office", template: "%s · Back-office Campus One" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <div className="min-h-dvh bg-surface">{children}</div>
    </RoleProvider>
  );
}
