import Link from "next/link";
import { ArrowLeft, Quote } from "lucide-react";
import { Logo } from "@/components/ui";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-4 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Accueil Campus One"><Logo /></Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy-900">
            <ArrowLeft className="size-4" aria-hidden /> Retour au site
          </Link>
        </div>
        <main id="contenu" className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">{children}</main>
        <p className="text-center text-xs text-muted">© 2026 Campus One · Vos données sont protégées et hébergées dans l'Union européenne.</p>
      </div>
      <div className="relative hidden overflow-hidden bg-navy-950 lg:block">
        <img src="/images/students-laptop.jpg" alt="" className="absolute inset-0 size-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" aria-hidden />
        <div className="absolute inset-x-12 bottom-12 animate-fade-up text-white">
          <Quote className="size-10 text-brand-300" aria-hidden />
          <p className="mt-4 text-2xl font-semibold leading-snug">Je voyais l'avancement de mon dossier en temps réel. Je savais toujours quelle était la prochaine étape.</p>
          <p className="mt-4 text-navy-200">Aïcha K. — Master Management International, Paris</p>
        </div>
      </div>
    </div>
  );
}
