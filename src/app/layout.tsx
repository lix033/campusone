import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ToastProvider } from "@/components/ui";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Campus One — Votre projet d'études, de l'orientation à l'installation",
    template: "%s · Campus One",
  },
  description:
    "Campus One accompagne les étudiants dans leur projet d'études à l'étranger : orientation, admission, Campus France, visa, logement et installation.",
};

export const viewport: Viewport = { themeColor: "#15264f" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={jakarta.variable}>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
