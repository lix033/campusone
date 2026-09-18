"use client";

import * as React from "react";
import Link from "next/link";
import { Compass, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { Button, EmptyState, buttonClasses, cn } from "@/components/ui";
import { cities, domains, etablissements, formations, levels } from "@/lib/mocks";
import { Container } from "./section";
import { FormationCard } from "./formation-card";

type Filters = {
  q: string;
  niveau: string;
  domaine: string;
  ville: string;
  etablissement: string;
  budget: string;
  langue: string;
  rentree: string;
};

const budgets: Record<string, [number, number]> = {
  "Moins de 5 000 €": [0, 5000],
  "5 000 à 8 000 €": [5000, 8000],
  "8 000 à 12 000 €": [8000, 12000],
  "Plus de 12 000 €": [12000, 1e9],
};

const empty: Filters = { q: "", niveau: "", domaine: "", ville: "", etablissement: "", budget: "", langue: "", rentree: "" };

export function Catalogue({ initial }: { initial: Record<string, string | undefined> }) {
  const [f, setF] = React.useState<Filters>({ ...empty, niveau: initial.niveau ?? "", domaine: initial.domaine ?? "", ville: initial.ville ?? "", budget: initial.budget ?? "" });
  const [sort, setSort] = React.useState("pertinence");
  const [panel, setPanel] = React.useState(false);

  const set = (k: keyof Filters) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF((s) => ({ ...s, [k]: e.target.value }));

  const results = React.useMemo(() => {
    let r = formations.filter((x) => {
      if (f.q && !`${x.title} ${x.domain} ${x.city}`.toLowerCase().includes(f.q.toLowerCase())) return false;
      if (f.niveau && x.level !== f.niveau) return false;
      if (f.domaine && x.domain !== f.domaine) return false;
      if (f.ville && !(x.cities ?? [x.city]).includes(f.ville)) return false;
      if (f.etablissement && x.school !== f.etablissement) return false;
      if (f.langue && !x.language.includes(f.langue)) return false;
      if (f.rentree && !x.intake.startsWith(f.rentree)) return false;
      if (f.budget) {
        const [a, b] = budgets[f.budget]!;
        if (x.fees < a || x.fees >= b) return false;
      }
      return true;
    });
    if (sort === "prix-asc") r = [...r].sort((a, b) => a.fees - b.fees);
    if (sort === "prix-desc") r = [...r].sort((a, b) => b.fees - a.fees);
    if (sort === "pertinence") r = [...r].sort((a, b) => Number(b.status === "Ouvert") - Number(a.status === "Ouvert"));
    return r;
  }, [f, sort]);

  const active = (Object.keys(f) as (keyof Filters)[]).filter((k) => k !== "q" && f[k]);

  const filterFields = (
    <div className="space-y-5">
      {[
        { k: "niveau" as const, label: "Niveau d'études", opts: levels.map((l) => [l, l]) },
        { k: "domaine" as const, label: "Domaine", opts: domains.map((l) => [l, l]) },
        { k: "ville" as const, label: "Ville", opts: cities.map((l) => [l, l]) },
        { k: "etablissement" as const, label: "Établissement", opts: etablissements.map((e) => [e.slug, e.name]) },
        { k: "budget" as const, label: "Frais de scolarité / an", opts: Object.keys(budgets).map((l) => [l, l]) },
        { k: "langue" as const, label: "Langue d'enseignement", opts: [["Français", "Français"], ["Anglais", "Anglais"]] },
        { k: "rentree" as const, label: "Rentrée", opts: [["Septembre", "Septembre"], ["Octobre", "Octobre"], ["Janvier", "Janvier"]] },
      ].map((field) => (
        <div key={field.k}>
          <label htmlFor={`f-${field.k}`} className="text-sm font-semibold text-navy-900">{field.label}</label>
          <select
            id={`f-${field.k}`}
            value={f[field.k]}
            onChange={set(field.k)}
            className="mt-1.5 h-10 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100"
          >
            <option value="">Tous</option>
            {field.opts.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
      ))}
      <div>
        <p className="text-sm font-semibold text-navy-900">Pays de destination</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-navy-900 px-3 py-1 text-xs font-semibold text-white">France</span>
          {["Belgique", "Canada"].map((c) => (
            <span key={c} className="rounded-full border border-dashed border-line px-3 py-1 text-xs text-muted" title="Bientôt disponible">{c} · bientôt</span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <section className="border-b border-line bg-surface">
        <Container className="py-12 sm:py-16">
          <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
            <Link href="/" className="hover:text-navy-900">Accueil</Link> <span aria-hidden>/</span> <span className="text-navy-900">Formations</span>
          </nav>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">Trouvez la formation qui vous correspond</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted">Filtrez par niveau, domaine, ville ou budget. Chaque fiche détaille les conditions d'admission et les documents demandés.</p>
          <div className="relative mt-8 max-w-2xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" aria-hidden />
            <label htmlFor="q" className="sr-only">Rechercher une formation</label>
            <input
              id="q"
              value={f.q}
              onChange={set("q")}
              placeholder="Rechercher : marketing, data, Lyon…"
              className="h-14 w-full rounded-2xl border border-line bg-white pl-12 pr-4 text-base shadow-soft focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100"
            />
          </div>
        </Container>
      </section>

      <Container className="grid gap-10 py-10 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block" aria-label="Filtres">
          <div className="sticky top-24">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-bold text-navy-900">Filtres</p>
              {active.length > 0 && (
                <button onClick={() => setF({ ...empty, q: f.q })} className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
                  <RotateCcw className="size-3.5" aria-hidden /> Réinitialiser
                </button>
              )}
            </div>
            {filterFields}
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted" aria-live="polite">
              <span className="font-semibold text-navy-900">{results.length}</span> formation{results.length > 1 ? "s" : ""} trouvée{results.length > 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setPanel(true)}>
                <SlidersHorizontal className="size-4" aria-hidden /> Filtres {active.length > 0 && `(${active.length})`}
              </Button>
              <label htmlFor="sort" className="sr-only">Trier</label>
              <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)} className="h-9 rounded-lg border border-line bg-white px-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-100">
                <option value="pertinence">Trier : pertinence</option>
                <option value="prix-asc">Frais croissants</option>
                <option value="prix-desc">Frais décroissants</option>
              </select>
            </div>
          </div>

          {active.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {active.map((k) => (
                <button
                  key={k}
                  onClick={() => setF((s) => ({ ...s, [k]: "" }))}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100"
                  aria-label={`Retirer le filtre ${f[k]}`}
                >
                  {k === "etablissement" ? etablissements.find((e) => e.slug === f[k])?.name : f[k]}
                  <X className="size-3.5" aria-hidden />
                </button>
              ))}
            </div>
          )}

          {results.length ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((x, i) => (
                <div key={x.slug} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
                  <FormationCard f={x} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              className="mt-6 rounded-2xl border border-dashed border-line"
              icon={<Search className="size-5" />}
              title="Aucune formation ne correspond à ces critères"
              description="Élargissez vos filtres, ou laissez un conseiller vous proposer des formations adaptées à votre profil."
              action={
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button variant="outline" onClick={() => setF(empty)}>Réinitialiser les filtres</Button>
                  <Link href="/orientation" className={buttonClasses()}><Compass className="size-4" aria-hidden /> Être orienté</Link>
                </div>
              }
            />
          )}
        </div>
      </Container>

      {panel && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filtres">
          <div className="absolute inset-0 bg-navy-950/40" onClick={() => setPanel(false)} aria-hidden />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] animate-toast-in overflow-y-auto rounded-t-3xl bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-lg font-bold text-navy-900">Filtres</p>
              <button onClick={() => setPanel(false)} className="rounded-lg p-1.5 hover:bg-navy-50" aria-label="Fermer"><X className="size-5" /></button>
            </div>
            {filterFields}
            <div className="sticky bottom-0 mt-6 grid grid-cols-2 gap-3 bg-white pt-3">
              <Button variant="outline" onClick={() => setF({ ...empty, q: f.q })}>Réinitialiser</Button>
              <Button onClick={() => setPanel(false)}>Voir {results.length} résultat{results.length > 1 ? "s" : ""}</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
