"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, CircleUserRound, LogIn, Menu, X } from "lucide-react";
import { Avatar, Logo, buttonClasses, cn } from "@campus-one/ui";
import { useSession } from "@/lib/session";

const primary = [
  { href: "/etudier-a-l-etranger", label: "Étudier à l'étranger" },
  { href: "/formations", label: "Formations" },
  { href: "/services", label: "Nos services" },
  { href: "/comment-ca-marche", label: "Comment ça marche ?" },
];

const more = [
  { href: "/partenaires", label: "Nos partenaires", text: "Les établissements avec qui nous travaillons" },
  { href: "/actualites", label: "Actualités", text: "Guides et conseils pratiques" },
  { href: "/orientation", label: "Orientation", text: "Trouver la formation qui me correspond" },
  { href: "/contact", label: "Contact", text: "Écrire ou prendre rendez-vous" },
];

export const mainNav = [...primary, ...more];

function MoreMenu({ isActive }: { isActive: (h: string) => boolean }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLLIElement>(null);
  const pathname = usePathname();
  React.useEffect(() => setOpen(false), [pathname]);
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const active = more.some((m) => isActive(m.href));
  return (
    <li ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="menu-plus"
        className={cn("flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-[14px] font-medium transition-colors", active || open ? "text-navy-900" : "text-muted hover:text-navy-900")}
      >
        Plus
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open && (
        <div className="absolute right-0 top-full pt-2">
          <ul id="menu-plus" className="w-80 animate-toast-in rounded-2xl border border-line bg-white p-2 shadow-lift">
            {more.map((m) => (
              <li key={m.href}>
                <Link
                  href={m.href}
                  aria-current={isActive(m.href) ? "page" : undefined}
                  className={cn("block rounded-xl px-3 py-2.5 transition-colors hover:bg-surface", isActive(m.href) && "bg-brand-50")}
                >
                  <span className="block text-sm font-semibold text-navy-900">{m.label}</span>
                  <span className="block text-xs text-muted">{m.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export function Header() {
  const pathname = usePathname();
  const session = useSession();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  React.useEffect(() => setOpen(false), [pathname]);
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const account = session ? (
    <Link href="/mon-espace" className={buttonClasses({ variant: "ghost", size: "sm", className: "max-sm:hidden" })}>
      <Avatar name={`${session.firstName} ${session.lastName}`} size="sm" />
      Mon espace
    </Link>
  ) : (
    <Link href="/connexion" className={buttonClasses({ variant: "ghost", size: "sm", className: "max-sm:hidden" })}>
      <LogIn className="size-4.5" aria-hidden />
      Se connecter
    </Link>
  );

  return (
    <header className={cn("sticky top-0 z-40 transition-all duration-300", scrolled ? "border-b border-line/80 bg-white/90 backdrop-blur-lg" : "bg-white")}>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-lg focus:bg-navy-900 focus:px-3 focus:py-2 focus:text-white">
        Aller au contenu
      </a>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Accueil Campus One" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Navigation principale" className="hidden min-w-0 xl:block">
          <ul className="flex items-center gap-0.5">
            {primary.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "relative block whitespace-nowrap rounded-lg px-3 py-2 text-[14px] font-medium transition-colors",
                    isActive(item.href) ? "text-navy-900" : "text-muted hover:text-navy-900",
                  )}
                >
                  {item.label}
                  {isActive(item.href) && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-500" aria-hidden />}
                </Link>
              </li>
            ))}
            <MoreMenu isActive={isActive} />
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {session !== undefined && account}
          <Link href="/candidater" className={buttonClasses({ size: "sm", className: "max-sm:hidden" })}>
            Candidater
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <button
            className="rounded-lg p-2 text-navy-900 hover:bg-navy-50 xl:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="menu-mobile" className="fixed inset-x-0 top-18 bottom-0 z-40 overflow-y-auto bg-white xl:hidden">
          <nav aria-label="Navigation mobile" className="px-4 py-4 sm:px-6">
            <ul className="divide-y divide-line">
              {[{ href: "/", label: "Accueil" }, ...mainNav].map((item, i) => (
                <li key={item.href} className="animate-fade-up" style={{ animationDelay: `${i * 30}ms` }}>
                  <Link
                    href={item.href}
                    className={cn("flex items-center justify-between py-4 text-lg font-semibold", isActive(item.href) && item.href !== "/" ? "text-brand-600" : "text-navy-900")}
                  >
                    {item.label}
                    <ArrowRight className="size-4 text-slate-300" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-3">
              <Link href="/candidater" className={buttonClasses({ size: "lg" })}>Déposer ma candidature</Link>
              <Link href={session ? "/mon-espace" : "/connexion"} className={buttonClasses({ variant: "outline", size: "lg" })}>
                <CircleUserRound className="size-5" aria-hidden /> {session ? "Mon espace" : "Se connecter"}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
