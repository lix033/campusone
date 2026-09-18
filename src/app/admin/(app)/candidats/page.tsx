"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Avatar, Badge, Card } from "@/components/ui";
import { dossiers } from "@/lib/mocks";
import { PageHeader } from "@/components/admin/shell";

export default function CandidatesPage() {
  const [q, setQ] = React.useState("");
  const rows = dossiers.filter((d) => `${d.candidate} ${d.email} ${d.phone}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader title="Candidats" description="Un compte unique par étudiant, pouvant porter plusieurs dossiers sur plusieurs campagnes." />
      <Card>
        <div className="border-b border-line p-3">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <label htmlFor="cand-q" className="sr-only">Rechercher</label>
            <input id="cand-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nom, email, téléphone…" className="h-9 w-full rounded-lg border border-line pl-9 pr-3 text-sm focus:outline-none focus:ring-4 focus:ring-brand-100" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-line bg-surface/60 text-left text-xs text-muted"><tr>{["Candidat", "Contact", "Pays", "Dossiers", "Partenaire", "Compte"].map((h) => <th key={h} className="px-4 py-2.5 font-semibold">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-line">
              {rows.map((d, i) => (
                <tr key={d.id} className="hover:bg-surface">
                  <td className="px-4 py-3"><div className="flex items-center gap-2.5"><Avatar name={d.candidate} size="sm" /><Link href={`/admin/dossiers/${d.id}`} className="font-medium text-navy-900 hover:text-brand-700">{d.candidate}</Link></div></td>
                  <td className="px-4 py-3"><p>{d.email}</p><p className="text-xs text-muted">{d.phone}</p></td>
                  <td className="px-4 py-3">{d.country}</td>
                  <td className="px-4 py-3"><Link href={`/admin/dossiers/${d.id}`} className="font-mono text-xs text-brand-600 hover:underline">{d.id}</Link>{i % 7 === 0 && <span className="ml-1 text-xs text-muted">+1</span>}</td>
                  <td className="px-4 py-3">{d.partner ? <span className="font-mono text-xs">{d.partner}</span> : <span className="text-muted">—</span>}</td>
                  <td className="px-4 py-3">{i % 11 === 10 ? <Badge tone="warning" dot>À valider</Badge> : <Badge tone="success" dot>Actif</Badge>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
