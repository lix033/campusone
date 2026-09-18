import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { ToastProvider } from "@/components/ui";
import "./globals.css";

// Inter pour le texte courant, Inter Tight pour les titres : une famille unique,
// deux largeurs — le registre institutionnel attendu sur un site d'orientation.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });

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
    <html lang="fr" className={`${inter.variable} ${interTight.variable}`}>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
