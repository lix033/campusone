"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Clock3, Download, FileImage, Plus, X } from "lucide-react";
import { Badge, Button, Card, CardHeader, Dialog, Field, Select, Tabs, Textarea, cn, useToast } from "@campus-one/ui";
import { bordereaux, formatFCFA, recentPayments } from "@campus-one/mocks";
import { Forbidden, PageHeader } from "@/components/shell";
import { Can, useRole } from "@/lib/permissions";

export default function PaymentsPage() {
  const toast = useToast();
  const { can } = useRole();
  const [queue, setQueue] = React.useState(bordereaux);
  const [tab, setTab] = React.useState("bordereaux");
  const [current, setCurrent] = React.useState<(typeof bordereaux)[number] | null>(null);
  const [rejecting, setRejecting] = React.useState(false);
  const [checks, setChecks] = React.useState({ amount: false, ref: false, date: false });
  const [motif, setMotif] = React.useState("");

  if (!can("payments.read")) return <Forbidden />;
  const allChecked = checks.amount && checks.ref && checks.date;

  const close = () => { setCurrent(null); setRejecting(false); setChecks({ amount: false, ref: false, date: false }); setMotif(""); };

  return (
    <>
      <PageHeader title="Paiements" description="Validation des bordereaux de dépôt bancaire et suivi des règlements." actions={<Can perm="reports.export"><Button variant="outline" size="sm"><Download className="size-4" aria-hidden /> Export comptable</Button></Can>} />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { l: "Encaissé ce mois", v: formatFCFA(4_650_000) },
          { l: "En attente de validation", v: formatFCFA(queue.reduce((a, b) => a + b.amount, 0)) },
          { l: "Dossiers non payés", v: "37" },
        ].map((k) => <Card key={k.l} className="p-5"><p className="text-sm text-muted">{k.l}</p><p className="mt-1 text-2xl font-bold tabular-nums text-navy-900">{k.v}</p></Card>)}
      </div>
      <Card>
        <Tabs className="px-2" value={tab} onChange={setTab} items={[{ id: "bordereaux", label: "Bordereaux à valider", count: queue.length }, { id: "historique", label: "Paiements enregistrés" }]} />
        {tab === "bordereaux" ? (
          queue.length ? (
            <ul className="divide-y divide-line">
              {queue.map((b) => (
                <li key={b.id} className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-500"><FileImage className="size-5" aria-hidden /></span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-navy-900">{b.candidate} <Link href={`/dossiers/${b.dossier}`} className="ml-1 font-mono text-xs font-normal text-brand-600 hover:underline">{b.dossier}</Link></p>
                    <p className="text-sm text-muted">Réf. <span className="font-mono">{b.reference}</span> · déposé le {b.declared}</p>
                  </div>
                  <p className="font-semibold tabular-nums">{formatFCFA(b.amount)}</p>
                  <span className={cn("flex items-center gap-1 text-xs", b.sinceHours > 48 ? "font-semibold text-rose-600" : "text-muted")}><Clock3 className="size-3.5" aria-hidden /> il y a {b.sinceHours} h</span>
                  <Can perm="payments.validate" fallback={<Badge tone="warning">En attente</Badge>}>
                    <Button size="sm" onClick={() => setCurrent(b)}>Examiner</Button>
                  </Can>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-10 text-center text-sm text-muted">Aucun bordereau en attente. Beau travail.</p>
          )
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="border-b border-line bg-surface/60 text-left text-xs text-muted"><tr>{["Candidat", "Objet", "Mode", "Montant", "Date", "Enregistré par", "Reçu"].map((h) => <th key={h} className="px-4 py-2.5 font-semibold">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-line">
                {recentPayments.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-medium text-navy-900">{p.candidate}</td>
                    <td className="px-4 py-3">{p.label}</td>
                    <td className="px-4 py-3"><Badge tone={p.method === "Agence" ? "navy" : "info"}>{p.method}</Badge></td>
                    <td className="px-4 py-3 tabular-nums">{formatFCFA(p.amount)}</td>
                    <td className="px-4 py-3 text-muted">{p.date}</td>
                    <td className="px-4 py-3 text-muted">{p.by}</td>
                    <td className="px-4 py-3"><button className="font-mono text-xs text-brand-600 hover:underline">{p.receipt}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Can perm="payments.record"><div className="border-t border-line p-4"><Button size="sm" variant="outline"><Plus className="size-4" aria-hidden /> Enregistrer un paiement en agence</Button></div></Can>
          </div>
        )}
      </Card>

      <Dialog
        open={!!current}
        onClose={close}
        size="lg"
        title={`Bordereau — ${current?.candidate ?? ""}`}
        description="Rapprochez le bordereau du relevé bancaire avant de valider."
        footer={
          rejecting ? (
            <>
              <Button variant="outline" onClick={() => setRejecting(false)}>Retour</Button>
              <Button variant="danger" disabled={!motif} onClick={() => { setQueue((q) => q.filter((x) => x.id !== current!.id)); toast({ title: "Bordereau rejeté", description: "Remarque envoyée au candidat par email." }); close(); }}>Rejeter et notifier</Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="text-rose-700" onClick={() => setRejecting(true)}><X className="size-4" aria-hidden /> Rejeter</Button>
              <Button variant="success" disabled={!allChecked} onClick={() => { setQueue((q) => q.filter((x) => x.id !== current!.id)); toast({ title: "Paiement validé", description: "Reçu généré et envoyé, dossier avancé à l'étape suivante." }); close(); }}>
                <Check className="size-4" aria-hidden /> Valider le paiement
              </Button>
            </>
          )
        }
      >
        {current && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex aspect-[3/4] flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface text-center">
              <FileImage className="size-10 text-navy-300" aria-hidden />
              <p className="mt-2 text-sm font-medium text-navy-800">{current.file}</p>
              <p className="text-xs text-muted">Aperçu du bordereau</p>
            </div>
            {rejecting ? (
              <div className="space-y-4">
                <Field label="Motif du rejet" htmlFor="motif" required>
                  <Select id="motif" value={motif} onChange={(e) => setMotif(e.target.value)}>
                    <option value="">Sélectionner</option>
                    <option>Montant différent du montant attendu</option>
                    <option>Référence absente ou erronée</option>
                    <option>Dépôt introuvable sur le relevé</option>
                    <option>Bordereau illisible</option>
                  </Select>
                </Field>
                <Field label="Message au candidat" htmlFor="msg" optional><Textarea id="msg" className="min-h-24" /></Field>
              </div>
            ) : (
              <div className="space-y-4">
                <dl className="space-y-2 rounded-2xl bg-surface p-4 text-sm">
                  <div className="flex justify-between"><dt className="text-muted">Montant attendu</dt><dd className="font-semibold">{formatFCFA(current.amount)}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted">Référence attendue</dt><dd className="font-mono font-semibold">{current.reference}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted">Date déclarée</dt><dd>{current.declared}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted">Banque</dt><dd>{current.bank}</dd></div>
                </dl>
                <fieldset className="space-y-2">
                  <legend className="mb-2 text-sm font-semibold text-navy-900">Rapprochement avec le relevé</legend>
                  {([["amount", "Le montant correspond"], ["ref", "La référence correspond au dossier"], ["date", "Le dépôt apparaît sur le relevé bancaire"]] as const).map(([k, l]) => (
                    <label key={k} className="flex cursor-pointer items-center gap-3 rounded-xl border border-line p-3 text-sm hover:bg-surface">
                      <input type="checkbox" checked={checks[k]} onChange={() => setChecks((c) => ({ ...c, [k]: !c[k] }))} className="size-4 accent-emerald-600" />
                      {l}
                    </label>
                  ))}
                </fieldset>
                {!allChecked && <p className="text-xs text-muted">Cochez les trois vérifications pour pouvoir valider.</p>}
              </div>
            )}
          </div>
        )}
      </Dialog>
    </>
  );
}
