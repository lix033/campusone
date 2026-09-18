"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Badge, Button, Card, Dialog, Field, Input, Select, useToast } from "@/components/ui";
import { documentTypes } from "@/lib/mocks";
import { Forbidden, PageHeader } from "@/components/admin/shell";
import { useRole } from "@/lib/admin/permissions";

export default function DocTypesPage() {
  const toast = useToast();
  const { can } = useRole();
  const [list, setList] = React.useState(documentTypes);
  const [open, setOpen] = React.useState(false);
  if (!can("config.catalog")) return <Forbidden />;
  return (
    <>
      <PageHeader title="Types de documents" description="Les checklists des candidats sont générées à partir de ces types, selon le profil et la procédure. Format accepté : PDF." actions={<Button size="sm" onClick={() => setOpen(true)}><Plus className="size-4" aria-hidden /> Nouveau type</Button>} />
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-line bg-surface/60 text-left text-xs text-muted"><tr>{["Type de document", "Caractère", "Taille max.", "Profils concernés", "Utilisé dans", "Actif"].map((h) => <th key={h} className="px-4 py-2.5 font-semibold">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-line">
            {list.map((t) => (
              <tr key={t.id}>
                <td className="px-4 py-3 font-medium text-navy-900">{t.name}</td>
                <td className="px-4 py-3">{t.required ? <Badge tone="navy">Obligatoire</Badge> : <Badge>Facultatif</Badge>}</td>
                <td className="px-4 py-3 tabular-nums">{t.maxMb} Mo</td>
                <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{t.profiles.map((p) => <Badge key={p} tone="brand">{p}</Badge>)}</div></td>
                <td className="px-4 py-3 tabular-nums text-muted">{t.usage} dossiers</td>
                <td className="px-4 py-3"><input type="checkbox" defaultChecked aria-label={`Activer ${t.name}`} className="size-4 accent-brand-500" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Dialog open={open} onClose={() => setOpen(false)} title="Nouveau type de document"
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button><Button onClick={() => { const n = (document.getElementById("t-name") as HTMLInputElement).value.trim(); if (!n) return; setList((l) => [...l, { id: `t${l.length + 1}`, name: n, required: false, maxMb: 10, profiles: ["Tous"], usage: 0 }]); setOpen(false); toast({ title: "Type de document créé" }); }}>Créer</Button></>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Intitulé" htmlFor="t-name" className="sm:col-span-2"><Input id="t-name" placeholder="Ex. Attestation de bourse" /></Field>
          <Field label="Caractère" htmlFor="t-req"><Select id="t-req"><option>Facultatif</option><option>Obligatoire</option></Select></Field>
          <Field label="Taille maximale" htmlFor="t-max"><Select id="t-max"><option>10 Mo</option><option>20 Mo</option></Select></Field>
        </div>
      </Dialog>
    </>
  );
}
