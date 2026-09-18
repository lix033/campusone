"use client";

import * as React from "react";
import { Pencil, Plus, Search } from "lucide-react";
import { Badge, Button, Card, Drawer, Field, Input, Select, Textarea, useToast } from "@/components/ui";
import { etablissements, formations, levels, schoolOf, type Formation } from "@/lib/mocks";
import { Forbidden, PageHeader } from "@/components/admin/shell";
import { useRole } from "@/lib/admin/permissions";

const tone = { Ouvert: "success", "Bientôt disponible": "warning", "Candidatures closes": "neutral" } as const;

export default function CatalogPage() {
  const toast = useToast();
  const { can } = useRole();
  const [list, setList] = React.useState(formations);
  const [q, setQ] = React.useState("");
  const [edit, setEdit] = React.useState<Formation | "new" | null>(null);
  if (!can("config.catalog")) return <Forbidden />;
  const rows = list.filter((f) => `${f.title} ${f.city} ${f.domain}`.toLowerCase().includes(q.toLowerCase()));
  const e = edit === "new" ? null : edit;

  return (
    <>
      <PageHeader title="Catalogue de formations" description={`${list.length} formations · publiées sur le site vitrine sans intervention technique`} actions={<Button size="sm" onClick={() => setEdit("new")}><Plus className="size-4" aria-hidden /> Nouvelle formation</Button>} />
      <Card>
        <div className="border-b border-line p-3">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <label htmlFor="cat-q" className="sr-only">Rechercher</label>
            <input id="cat-q" value={q} onChange={(ev) => setQ(ev.target.value)} placeholder="Rechercher une formation…" className="h-9 w-full rounded-lg border border-line pl-9 pr-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-100" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="border-b border-line bg-surface/60 text-left text-xs text-muted"><tr>{["Formation", "Établissement", "Niveau", "Ville", "Frais / an", "Places", "Statut", ""].map((h) => <th key={h} className="px-4 py-2.5 font-semibold">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-line">
              {rows.map((f) => (
                <tr key={f.slug} className="hover:bg-surface">
                  <td className="px-4 py-3"><p className="font-medium text-navy-900">{f.title}</p><p className="text-xs text-muted">{f.domain}</p></td>
                  <td className="px-4 py-3 text-navy-800">{schoolOf(f).name}</td>
                  <td className="px-4 py-3">{f.level}</td>
                  <td className="px-4 py-3">{f.city}</td>
                  <td className="px-4 py-3 tabular-nums">{f.fees.toLocaleString("fr-FR")} €</td>
                  <td className="px-4 py-3 tabular-nums">{f.seats}</td>
                  <td className="px-4 py-3"><Badge tone={tone[f.status]} dot>{f.status}</Badge></td>
                  <td className="px-4 py-3 text-right"><Button size="sm" variant="ghost" onClick={() => setEdit(f)} aria-label={`Modifier ${f.title}`}><Pencil className="size-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Drawer
        open={!!edit}
        onClose={() => setEdit(null)}
        width="lg"
        title={e ? "Modifier la formation" : "Nouvelle formation"}
        description={e ? e.title : "Les champs seront publiés sur la fiche formation du site."}
        footer={<><Button variant="outline" onClick={() => setEdit(null)}>Annuler</Button><Button onClick={() => { setEdit(null); toast({ title: e ? "Formation mise à jour" : "Formation créée", description: "Visible sur le site dans quelques instants." }); }}>{e ? "Enregistrer" : "Créer"}</Button></>}
      >
        <form className="grid gap-4 sm:grid-cols-2" key={e?.slug ?? "new"} onSubmit={(ev) => ev.preventDefault()}>
          <Field label="Intitulé" htmlFor="f-title" required className="sm:col-span-2"><Input id="f-title" defaultValue={e?.title} /></Field>
          <Field label="Établissement" htmlFor="f-school"><Select id="f-school" defaultValue={e?.school}>{etablissements.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}</Select></Field>
          <Field label="Niveau" htmlFor="f-level"><Select id="f-level" defaultValue={e?.level}>{levels.map((l) => <option key={l}>{l}</option>)}</Select></Field>
          <Field label="Domaine" htmlFor="f-domain"><Input id="f-domain" defaultValue={e?.domain} /></Field>
          <Field label="Ville / campus" htmlFor="f-city"><Input id="f-city" defaultValue={e?.city} /></Field>
          <Field label="Rentrée" htmlFor="f-intake"><Input id="f-intake" defaultValue={e?.intake} /></Field>
          <Field label="Durée" htmlFor="f-duration"><Input id="f-duration" defaultValue={e?.duration} /></Field>
          <Field label="Frais annuels (€)" htmlFor="f-fees"><Input id="f-fees" defaultValue={e?.fees} inputMode="numeric" /></Field>
          <Field label="Places disponibles" htmlFor="f-seats"><Input id="f-seats" defaultValue={e?.seats} inputMode="numeric" /></Field>
          <Field label="Statut" htmlFor="f-status" className="sm:col-span-2"><Select id="f-status" defaultValue={e?.status}><option>Ouvert</option><option>Bientôt disponible</option><option>Candidatures closes</option></Select></Field>
          <Field label="Présentation" htmlFor="f-summary" className="sm:col-span-2"><Textarea id="f-summary" defaultValue={e?.summary} /></Field>
          <Field label="Prérequis" htmlFor="f-req" className="sm:col-span-2"><Textarea id="f-req" defaultValue={e?.requirements.diploma} className="min-h-20" /></Field>
          <Field label="Débouchés (un par ligne)" htmlFor="f-careers" className="sm:col-span-2"><Textarea id="f-careers" defaultValue={e?.careers.join("\n")} className="min-h-20" /></Field>
        </form>
      </Drawer>
    </>
  );
}
