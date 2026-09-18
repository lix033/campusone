"use client";

import * as React from "react";
import { Archive, CalendarRange, Copy, Lock, Plus, Unlock } from "lucide-react";
import { Badge, Button, Card, Dialog, Field, Input, Select, useToast } from "@/components/ui";
import { campaigns } from "@/lib/mocks";
import { Forbidden, PageHeader } from "@/components/admin/shell";
import { useRole } from "@/lib/admin/permissions";

const statusMeta = {
  ouverte: { tone: "success", label: "Ouverte" },
  brouillon: { tone: "neutral", label: "Brouillon" },
  fermee: { tone: "warning", label: "Fermée" },
  archivee: { tone: "navy", label: "Archivée" },
} as const;

type Campaign = Omit<(typeof campaigns)[number], "status"> & { status: keyof typeof statusMeta };

export default function CampaignsPage() {
  const toast = useToast();
  const { can } = useRole();
  const [list, setList] = React.useState<Campaign[]>(campaigns);
  const [dup, setDup] = React.useState<Campaign | null>(null);
  const [creating, setCreating] = React.useState(false);
  if (!can("config.campaigns")) return <Forbidden />;

  const set = (id: string, status: Campaign["status"], msg: string) => {
    setList((l) => l.map((c) => (c.id === id ? { ...c, status } : c)));
    toast({ title: msg });
  };

  return (
    <>
      <PageHeader title="Campagnes" description="Chaque campagne isole ses dossiers et ses statistiques. Un étudiant peut avoir des dossiers sur plusieurs campagnes." actions={<Button size="sm" onClick={() => setCreating(true)}><Plus className="size-4" aria-hidden /> Nouvelle campagne</Button>} />
      <div className="grid gap-4 lg:grid-cols-2">
        {list.map((c) => {
          const m = statusMeta[c.status];
          return (
            <Card key={c.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-navy-900">{c.name}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted"><CalendarRange className="size-4" aria-hidden /> Du {c.opens} au {c.closes}</p>
                </div>
                <Badge tone={m.tone} dot>{m.label}</Badge>
              </div>
              <dl className="mt-5 grid grid-cols-3 gap-3 rounded-xl bg-surface p-3 text-center">
                <div><dt className="text-xs text-muted">Dossiers</dt><dd className="text-lg font-bold tabular-nums">{c.dossiers}</dd></div>
                <div><dt className="text-xs text-muted">Formations</dt><dd className="text-lg font-bold tabular-nums">{c.formations}</dd></div>
                <div><dt className="text-xs text-muted">Admis</dt><dd className="text-lg font-bold tabular-nums">{c.admitted}</dd></div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => setDup(c)}><Copy className="size-4" aria-hidden /> Dupliquer vers l'année suivante</Button>
                {c.status === "brouillon" && <Button size="sm" variant="success" onClick={() => set(c.id, "ouverte", "Campagne ouverte aux candidatures")}><Unlock className="size-4" aria-hidden /> Ouvrir</Button>}
                {c.status === "ouverte" && <Button size="sm" variant="outline" onClick={() => set(c.id, "fermee", "Campagne fermée")}><Lock className="size-4" aria-hidden /> Fermer</Button>}
                {c.status === "fermee" && <Button size="sm" variant="ghost" onClick={() => set(c.id, "archivee", "Campagne archivée")}><Archive className="size-4" aria-hidden /> Archiver</Button>}
              </div>
            </Card>
          );
        })}
      </div>
      <Dialog open={!!dup} onClose={() => setDup(null)} title={`Dupliquer « ${dup?.name ?? ""} »`} description="La configuration est copiée : formations, parcours d'étapes, checklists et montants. Aucun dossier n'est copié."
        footer={<><Button variant="outline" onClick={() => setDup(null)}>Annuler</Button><Button onClick={() => { setList((l) => [{ ...dup!, id: `c${Date.now()}`, name: dup!.name.replace(/(\d{4})-(\d{4})/, (_, a, b) => `${+a + 1}-${+b + 1}`), status: "brouillon", dossiers: 0, admitted: 0 }, ...l]); setDup(null); toast({ title: "Campagne dupliquée en brouillon" }); }}>Dupliquer</Button></>}>
        <ul className="space-y-2 text-sm text-navy-800">
          {["Catalogue de formations associé", "Parcours d'étapes par filière", "Checklists documentaires", "Montants des frais"].map((x) => <li key={x} className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-brand-500" aria-hidden />{x}</li>)}
        </ul>
      </Dialog>
      <Dialog open={creating} onClose={() => setCreating(false)} title="Nouvelle campagne"
        footer={<><Button variant="outline" onClick={() => setCreating(false)}>Annuler</Button><Button onClick={() => { setCreating(false); toast({ title: "Campagne créée en brouillon" }); }}>Créer</Button></>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom" htmlFor="c-name" className="sm:col-span-2"><Input id="c-name" placeholder="France 2028-2029" /></Field>
          <Field label="Destination" htmlFor="c-dest"><Select id="c-dest"><option>France</option><option disabled>Canada (bientôt)</option></Select></Field>
          <Field label="Frais de dossier (FCFA)" htmlFor="c-fee"><Input id="c-fee" defaultValue="150000" /></Field>
          <Field label="Ouverture" htmlFor="c-open"><Input id="c-open" type="date" /></Field>
          <Field label="Clôture" htmlFor="c-close"><Input id="c-close" type="date" /></Field>
        </div>
      </Dialog>
    </>
  );
}
