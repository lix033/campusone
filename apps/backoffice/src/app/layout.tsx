import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ToastProvider } from "@campus-one/ui";
import { RoleProvider } from "@/lib/permissions";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Back-office", template: "%s · Back-office Campus One" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#0c1733" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={jakarta.variable}>
      <body className="bg-surface">
        <ToastProvider>
          <RoleProvider>{children}</RoleProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
