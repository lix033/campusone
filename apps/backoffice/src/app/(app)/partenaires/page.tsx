"use client";

import * as React from "react";
import { Copy, Mail, Plus } from "lucide-react";
import { Badge, Button, Card, Dialog, Field, Input, useToast } from "@campus-one/ui";
import { partners } from "@campus-one/mocks";
import { Forbidden, PageHeader } from "@/components/shell";
import { useRole } from "@/lib/permissions";

export default function PartnersPage() {
  const toast = useToast();
  const { can } = useRole();
  const [open, setOpen] = React.useState(false);
  if (!can("config.catalog")) return <Forbidden />;
  return (
    <>
      <PageHeader title="Partenaires" description="Les partenaires reçoivent automatiquement une copie des emails envoyés aux candidats qu'ils ont orientés." actions={<Button size="sm" onClick={() => setOpen(true)}><Plus className="size-4" aria-hidden /> Nouveau partenaire</Button>} />
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-line bg-surface/60 text-left text-xs text-muted"><tr>{["Partenaire", "Contact", "Code", "Candidats orientés", "Copie des emails", "Statut"].map((h) => <th key={h} className="px-4 py-2.5 font-semibold">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-line">
            {partners.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-navy-900">{p.name}</td>
                <td className="px-4 py-3"><p>{p.contact}</p><p className="flex items-center gap-1 text-xs text-muted"><Mail className="size-3" aria-hidden />{p.email}</p></td>
                <td className="px-4 py-3"><button onClick={() => { navigator.clipboard?.writeText(p.code); toast({ title: "Code copié", tone: "info" }); }} className="inline-flex items-center gap-1.5 rounded-md bg-navy-50 px-2 py-1 font-mono text-xs text-navy-800 hover:bg-navy-100">{p.code}<Copy className="size-3" aria-hidden /></button></td>
                <td className="px-4 py-3 tabular-nums">{p.candidates}</td>
                <td className="px-4 py-3"><Badge tone="success">Automatique</Badge></td>
                <td className="px-4 py-3">{p.active ? <Badge tone="success" dot>Actif</Badge> : <Badge dot>Inactif</Badge>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Dialog open={open} onClose={() => setOpen(false)} title="Nouveau partenaire" footer={<><Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button><Button onClick={() => { setOpen(false); toast({ title: "Partenaire créé", description: "Code généré : PART-NEW-12" }); }}>Créer</Button></>}>
        <div className="grid gap-4">
          <Field label="Nom de la structure" htmlFor="pa-name"><Input id="pa-name" /></Field>
          <Field label="Nom du contact" htmlFor="pa-contact"><Input id="pa-contact" /></Field>
          <Field label="Email de contact" htmlFor="pa-email" hint="Adresse qui recevra la copie des emails candidats."><Input id="pa-email" type="email" /></Field>
        </div>
      </Dialog>
    </>
  );
}
