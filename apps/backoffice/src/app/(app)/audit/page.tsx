"use client";

import * as React from "react";
import { Download, FileText, FolderKanban, KeyRound, Settings2, Wallet } from "lucide-react";
import { Avatar, Button, Card, cn } from "@campus-one/ui";
import { auditLog } from "@campus-one/mocks";
import { Forbidden, PageHeader } from "@/components/shell";
import { useRole } from "@/lib/permissions";

const kinds = {
  document: { label: "Documents", icon: FileText },
  dossier: { label: "Dossiers", icon: FolderKanban },
  payment: { label: "Paiements", icon: Wallet },
  config: { label: "Configuration", icon: Settings2 },
  auth: { label: "Connexions", icon: KeyRound },
} as const;

export default function AuditPage() {
  const { can } = useRole();
  const [kind, setKind] = React.useState<string>("");
  if (!can("audit.read")) return <Forbidden />;
  const rows = auditLog.filter((l) => !kind || l.kind === kind);
  return (
    <>
      <PageHeader title="Journal d'audit" description="Toutes les actions sensibles sont tracées : qui, quoi, quand, depuis où. Lecture seule." actions={<Button variant="outline" size="sm"><Download className="size-4" aria-hidden /> Exporter</Button>} />
      <div className="mb-4 flex flex-wrap gap-1.5">
        <button onClick={() => setKind("")} className={cn("rounded-lg px-3 py-1.5 text-sm font-medium", !kind ? "bg-navy-900 text-white" : "text-muted hover:bg-white")}>Tout</button>
        {Object.entries(kinds).map(([k, v]) => (
          <button key={k} onClick={() => setKind(k)} className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium", kind === k ? "bg-navy-900 text-white" : "text-muted hover:bg-white")}>
            <v.icon className="size-4" aria-hidden /> {v.label}
          </button>
        ))}
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-line bg-surface/60 text-left text-xs text-muted"><tr>{["Date", "Utilisateur", "Action", "Cible", "Catégorie", "Adresse IP"].map((h) => <th key={h} className="px-4 py-2.5 font-semibold">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-line">
            {rows.map((l) => {
              const K = kinds[l.kind as keyof typeof kinds];
              return (
                <tr key={l.id}>
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums text-muted">{l.at}</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><Avatar name={l.actor} size="sm" /><span className="text-navy-900">{l.actor}</span></div></td>
                  <td className="px-4 py-3 text-navy-800">{l.action}</td>
                  <td className="px-4 py-3 text-navy-900">{l.target}</td>
                  <td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 text-muted"><K.icon className="size-4" aria-hidden />{K.label}</span></td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{l.ip}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </>
  );
}
