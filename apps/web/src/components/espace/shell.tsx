"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  CreditCard,
  FileText,
  FolderOpen,
  House,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  MessagesSquare,
  Plus,
  UserRound,
  X,
} from "lucide-react";
import { Avatar, Logo, buttonClasses, cn } from "@campus-one/ui";
import { me, myApplications, myDocuments, myNotifications, myRemarks } from "@campus-one/mocks";
import { signOut, useSession } from "@/lib/session";

const openRemarks = myRemarks.filter((r) => !r.resolved).length;
const docsToFix = myDocuments.filter((d) => d.status === "a_corriger" || (d.required && d.status === "a_fournir")).length;

const nav = [
  { href: "/mon-espace", label: "Tableau de bord", icon: House, exact: true },
  { href: "/mon-espace/candidatures", label: "Mes candidatures", icon: FolderOpen },
  { href: "/mon-espace/documents", label: "Mes documents", icon: FileText, badge: docsToFix },
  { href: "/mon-espace/remarques", label: "Remarques", icon: MessageSquare, badge: openRemarks },
  { href: "/mon-espace/paiements", label: "Mes paiements", icon: CreditCard },
  { href: "/mon-espace/rendez-vous", label: "Mes rendez-vous", icon: CalendarDays },
  { href: "/mon-espace/messages", label: "Messages", icon: MessagesSquare },
  { href: "/mon-espace/profil", label: "Mon profil", icon: UserRound },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className="space-y-1">
      {nav.map(({ href, label, icon: Icon, badge, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-brand-50 text-brand-700" : "text-navy-700 hover:bg-navy-50 hover:text-navy-900",
              )}
            >
              <Icon className={cn("size-5", active ? "text-brand-600" : "text-navy-400")} aria-hidden />
              <span className="flex-1">{label}</span>
              {!!badge && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-bold text-white" aria-label={`${badge} en attente`}>
                  {badge}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Notifications() {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState(myNotifications);
  const ref = React.useRef<HTMLDivElement>(null);
  const unread = items.filter((n) => n.unread).length;
  React.useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-xl p-2.5 text-navy-700 hover:bg-navy-50"
        aria-label={`Notifications${unread ? ` (${unread} non lues)` : ""}`}
        aria-expanded={open}
      >
        <Bell className="size-5" />
        {unread > 0 && <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-white" aria-hidden />}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 animate-toast-in overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-sm font-semibold text-navy-900">Notifications</p>
            {unread > 0 && (
              <button onClick={() => setItems((l) => l.map((n) => ({ ...n, unread: false })))} className="text-xs font-medium text-brand-600 hover:text-brand-700">
                Tout marquer comme lu
              </button>
            )}
          </div>
          <ul className="max-h-80 divide-y divide-line overflow-y-auto">
            {items.map((n) => (
              <li key={n.id} className={cn("flex gap-3 px-4 py-3", n.unread && "bg-brand-50/40")}>
                <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.unread ? "bg-brand-500" : "bg-transparent")} aria-hidden />
                <div>
                  <p className="text-sm font-medium text-navy-900">{n.title}</p>
                  <p className="text-sm text-muted">{n.text}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{n.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function CandidateShell({ children }: { children: React.ReactNode }) {
  const [mobile, setMobile] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  const main = myApplications[0]!;
  const current = main.steps.findIndex((s) => s.status === "current");
  React.useEffect(() => setMobile(false), [pathname]);
  // Espace protégé : sans session, retour à la connexion puis à la page demandée.
  React.useEffect(() => {
    if (session === null) router.replace(`/connexion?next=${encodeURIComponent(pathname)}`);
  }, [session, pathname, router]);

  if (!session)
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface" aria-live="polite">
        <Loader2 className="size-6 animate-spin text-brand-500" aria-hidden />
        <span className="sr-only">Vérification de la session…</span>
      </div>
    );

  const fullName = `${session.firstName} ${session.lastName}`;

  const sidebar = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col">
      <div className="px-3">
        <Link href="/mon-espace/candidatures/nouvelle" onClick={onNavigate} className={buttonClasses({ className: "w-full" })}>
          <Plus className="size-4" aria-hidden /> Nouvelle candidature
        </Link>
      </div>
      <nav aria-label="Espace candidat" className="mt-6 flex-1 px-3">
        <NavList onNavigate={onNavigate} />
      </nav>
      <div className="m-3 rounded-2xl bg-surface p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Votre conseillère</p>
        <div className="mt-3 flex items-center gap-3">
          <Avatar name={me.advisor.name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-navy-900">{me.advisor.name}</p>
            <p className="truncate text-xs text-muted">{me.advisor.role}</p>
          </div>
        </div>
        <Link href="/mon-espace/messages" onClick={onNavigate} className={buttonClasses({ variant: "outline", size: "sm", className: "mt-3 w-full" })}>
          Écrire un message
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-surface">
      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
          <button className="rounded-lg p-2 text-navy-900 hover:bg-navy-50 lg:hidden" onClick={() => setMobile(true)} aria-label="Ouvrir le menu">
            <Menu className="size-5" />
          </button>
          <Link href="/" className="shrink-0" aria-label="Retour au site Campus One">
            <Logo className="[&_img]:h-8" />
          </Link>
          <Link
            href={`/mon-espace/candidatures/${main.id}`}
            className="ml-4 hidden min-w-0 items-center gap-3 rounded-xl border border-line px-3 py-1.5 transition-colors hover:border-brand-200 hover:bg-brand-50/50 md:flex"
          >
            <span className="relative flex size-2.5" aria-hidden>
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-amber-500" />
            </span>
            <span className="truncate text-sm">
              <span className="text-muted">Dossier {main.id} · </span>
              <span className="font-semibold text-navy-900">Étape {current + 1}/{main.steps.length} : {main.currentStep}</span>
            </span>
            <ChevronRight className="size-4 text-slate-400" aria-hidden />
          </Link>
          <div className="ml-auto flex items-center gap-1">
            <Notifications />
            <Link href="/mon-espace/profil" className="ml-1 flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 hover:bg-navy-50">
              <Avatar name={fullName} />
              <span className="hidden text-sm font-semibold text-navy-900 sm:block">{session.firstName}</span>
            </Link>
            <button
              onClick={() => { signOut(); router.push("/connexion"); }}
              className="rounded-xl p-2.5 text-navy-500 hover:bg-navy-50 hover:text-navy-900"
              aria-label="Se déconnecter"
              title="Se déconnecter"
            >
              <LogOut className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px]">
        <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-64 shrink-0 border-r border-line bg-white py-6 lg:block">{sidebar()}</aside>
        <main id="contenu" className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>

      {mobile && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-navy-950/40" onClick={() => setMobile(false)} aria-hidden />
          <div className="absolute inset-y-0 left-0 w-72 animate-[fade-up_0.25s_ease-out] bg-white py-5">
            <div className="mb-5 flex items-center justify-between px-5">
              <Logo className="[&_img]:h-8" />
              <button onClick={() => setMobile(false)} className="rounded-lg p-1.5 hover:bg-navy-50" aria-label="Fermer le menu"><X className="size-5" /></button>
            </div>
            {sidebar(() => setMobile(false))}
          </div>
        </div>
      )}
    </div>
  );
}

export function PageTitle({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
