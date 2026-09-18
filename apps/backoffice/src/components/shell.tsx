"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Banknote,
  BookOpen,
  CalendarDays,
  ChevronDown,
  FileStack,
  FolderKanban,
  Handshake,
  Keyboard,
  LayoutDashboard,
  ListChecks,
  Loader2,
  LogOut,
  Menu,
  Megaphone,
  ScrollText,
  Search,
  ShieldCheck,
  Users,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";
import { Avatar, Dialog, Logo, cn } from "@campus-one/ui";
import { bordereaux, campaigns, dossiers, roles } from "@campus-one/mocks";
import { demoUsers, useRole, useSession } from "@/lib/permissions";

type NavItem = { href: string; label: string; icon: LucideIcon; perm?: string; badge?: number };

const sections: { title: string; items: NavItem[] }[] = [
  {
    title: "Pilotage",
    items: [
      { href: "/", label: "Tableau de bord", icon: LayoutDashboard },
      { href: "/dossiers", label: "Dossiers", icon: FolderKanban, perm: "dossiers.read", badge: dossiers.filter((d) => d.docsToReview > 0).length },
      { href: "/candidats", label: "Candidats", icon: Users, perm: "dossiers.read" },
      { href: "/paiements", label: "Paiements", icon: Banknote, perm: "payments.read", badge: bordereaux.length },
      { href: "/rendez-vous", label: "Rendez-vous", icon: CalendarDays, perm: "dossiers.edit" },
    ],
  },
  {
    title: "Configuration",
    items: [
      { href: "/parcours", label: "Parcours d'étapes", icon: Workflow, perm: "config.workflows" },
      { href: "/campagnes", label: "Campagnes", icon: Megaphone, perm: "config.campaigns" },
      { href: "/formations", label: "Catalogue", icon: BookOpen, perm: "config.catalog" },
      { href: "/types-documents", label: "Types de documents", icon: FileStack, perm: "config.catalog" },
      { href: "/partenaires", label: "Partenaires", icon: Handshake, perm: "config.catalog" },
    ],
  },
  {
    title: "Administration",
    items: [
      { href: "/roles", label: "Utilisateurs et rôles", icon: ShieldCheck, perm: "config.roles" },
      { href: "/audit", label: "Journal d'audit", icon: ScrollText, perm: "audit.read" },
    ],
  },
];

const shortcuts = [
  ["/", "Rechercher un dossier"],
  ["g puis d", "Aller aux dossiers"],
  ["g puis t", "Aller au tableau de bord"],
  ["?", "Afficher les raccourcis"],
  ["Échap", "Fermer une fenêtre"],
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { can } = useRole();
  return (
    <nav aria-label="Navigation back-office" className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
      {sections.map((s) => {
        const items = s.items.filter((i) => !i.perm || can(i.perm));
        if (!items.length) return null;
        return (
          <div key={s.title}>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-300">{s.title}</p>
            <ul className="mt-2 space-y-0.5">
              {items.map(({ href, label, icon: Icon, badge }) => {
                const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active ? "bg-white/10 text-white" : "text-navy-200 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <Icon className={cn("size-4.5", active ? "text-brand-300" : "text-navy-300")} aria-hidden />
                      <span className="flex-1">{label}</span>
                      {!!badge && <span className="rounded-full bg-brand-500 px-1.5 py-px text-[11px] font-bold text-white">{badge}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function GlobalSearch() {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLInputElement>(null);
  const results = q.length > 1
    ? dossiers.filter((d) => `${d.candidate} ${d.id} ${d.email} ${d.phone}`.toLowerCase().includes(q.toLowerCase())).slice(0, 6)
    : [];

  React.useEffect(() => {
    let g = false;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) return;
      if (e.key === "/") {
        e.preventDefault();
        ref.current?.focus();
      } else if (e.key === "g") {
        g = true;
        setTimeout(() => (g = false), 800);
      } else if (g && e.key === "d") router.push("/dossiers");
      else if (g && e.key === "t") router.push("/");
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
      <label htmlFor="global-search" className="sr-only">Rechercher un dossier</label>
      <input
        ref={ref}
        id="global-search"
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && results[0]) router.push(`/dossiers/${results[0].id}`);
          if (e.key === "Escape") ref.current?.blur();
        }}
        placeholder="Nom, email, téléphone, n° de dossier…"
        className="h-10 w-full rounded-xl border border-line bg-surface pl-9 pr-10 text-sm focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-100"
      />
      <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-line bg-white px-1.5 text-[11px] text-muted sm:block">/</kbd>
      {open && q.length > 1 && (
        <div className="absolute inset-x-0 top-12 z-50 overflow-hidden rounded-xl border border-line bg-white shadow-lift">
          {results.length ? (
            <ul>
              {results.map((d) => (
                <li key={d.id}>
                  <Link href={`/dossiers/${d.id}`} className="flex items-center gap-3 px-3 py-2.5 hover:bg-surface">
                    <Avatar name={d.candidate} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-navy-900">{d.candidate}</p>
                      <p className="truncate text-xs text-muted">{d.id} · {d.formation}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-4 text-sm text-muted">Aucun dossier ne correspond à « {q} ».</p>
          )}
        </div>
      )}
    </div>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  const { role, setRole, roleName, user } = useRole();
  const [mobile, setMobile] = React.useState(false);
  const [help, setHelp] = React.useState(false);
  const [menu, setMenu] = React.useState(false);
  React.useEffect(() => setMobile(false), [pathname]);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "?" && !["INPUT", "TEXTAREA"].includes(t.tagName)) setHelp(true);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Back-office protégé : sans session, retour à l'écran de connexion.
  React.useEffect(() => {
    if (session.ready && !session.role) router.replace(`/connexion?next=${encodeURIComponent(pathname)}`);
  }, [session.ready, session.role, pathname, router]);

  if (!session.ready || !session.role)
    return (
      <div className="flex min-h-dvh items-center justify-center bg-navy-950" aria-live="polite">
        <Loader2 className="size-6 animate-spin text-brand-300" aria-hidden />
        <span className="sr-only">Vérification de la session…</span>
      </div>
    );

  const brand = (
    <div className="px-6 pb-5 pt-5">
      <Link href="/" aria-label="Tableau de bord"><Logo variant="white" suffix="Back-office" /></Link>
    </div>
  );

  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col bg-navy-950 lg:flex">
        {brand}
        <Sidebar />
        <div className="border-t border-white/10 p-3">
          <button onClick={() => setHelp(true)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-navy-200 hover:bg-white/5 hover:text-white">
            <Keyboard className="size-4.5 text-navy-300" aria-hidden /> Raccourcis clavier
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-white px-4 sm:px-6">
          <button className="rounded-lg p-2 hover:bg-navy-50 lg:hidden" onClick={() => setMobile(true)} aria-label="Ouvrir le menu"><Menu className="size-5" /></button>
          <GlobalSearch />
          <div className="ml-auto flex items-center gap-3">
            <label className="hidden items-center gap-2 text-sm md:flex">
              <span className="text-muted">Campagne</span>
              <select className="h-9 rounded-lg border border-line bg-white px-2.5 text-sm font-medium text-navy-900 focus:outline-none focus:ring-4 focus:ring-brand-100" defaultValue="c1">
                {campaigns.filter((c) => c.status !== "archivee").map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <div className="relative">
              {menu && <div className="fixed inset-0 z-40" onClick={() => setMenu(false)} aria-hidden />}
              <button onClick={() => setMenu((m) => !m)} className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 hover:bg-navy-50" aria-expanded={menu} aria-haspopup="menu">
                <Avatar name={user.name} size="sm" />
                <span className="hidden text-left sm:block">
                  <span className="block text-sm font-semibold leading-tight text-navy-900">{user.name}</span>
                  <span className="block text-xs leading-tight text-muted">{roleName}</span>
                </span>
                <ChevronDown className="size-4 text-slate-400" aria-hidden />
              </button>
              {menu && (
                <div role="menu" className="absolute right-0 z-50 mt-2 w-72 animate-toast-in rounded-2xl border border-line bg-white p-2 shadow-lift">
                  <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">Démo · changer de compte</p>
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      role="menuitemradio"
                      aria-checked={r.id === role}
                      onClick={() => { setRole(r.id); setMenu(false); }}
                      className={cn("flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left hover:bg-surface", r.id === role && "bg-brand-50")}
                    >
                      <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", r.id === role ? "bg-brand-500" : "bg-slate-200")} aria-hidden />
                      <span>
                        <span className="block text-sm font-medium text-navy-900">{r.name} · {demoUsers[r.id].name}</span>
                        <span className="block text-xs text-muted">{r.description}</span>
                      </span>
                    </button>
                  ))}
                  <div className="my-2 border-t border-line" />
                  <button onClick={() => { setMenu(false); session.signOut(); router.push("/connexion"); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-navy-800 hover:bg-surface"><LogOut className="size-4" aria-hidden /> Se déconnecter</button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main id="contenu" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>

      {mobile && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-navy-950/50" onClick={() => setMobile(false)} aria-hidden />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-navy-950">
            <div className="flex items-start justify-between pr-3">
              {brand}
              <button onClick={() => setMobile(false)} className="mt-5 rounded-lg p-1.5 text-white hover:bg-white/10" aria-label="Fermer le menu"><X className="size-5" /></button>
            </div>
            <Sidebar onNavigate={() => setMobile(false)} />
          </div>
        </div>
      )}

      <Dialog open={help} onClose={() => setHelp(false)} title="Raccourcis clavier" size="sm">
        <ul className="divide-y divide-line">
          {shortcuts.map(([k, v]) => (
            <li key={k} className="flex items-center justify-between py-2.5 text-sm">
              <span className="text-navy-800">{v}</span>
              <kbd className="rounded-md border border-line bg-surface px-2 py-0.5 font-mono text-xs text-navy-900">{k}</kbd>
            </li>
          ))}
        </ul>
      </Dialog>
    </div>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-navy-50 text-navy-500"><ListChecks className="size-7" aria-hidden /></span>
      <p className="mt-4 text-lg font-semibold text-navy-900">Cette section n'est pas disponible pour votre profil</p>
      <p className="mt-1 max-w-sm text-sm text-muted">Demandez à un administrateur d'ajuster vos permissions si vous en avez besoin.</p>
    </div>
  );
}
