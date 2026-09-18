"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDownUp, ChevronLeft, ChevronRight, Download, FileSearch, Filter, RotateCcw, Search, UserRoundCog, Workflow, X } from "lucide-react";
import { Avatar, Badge, Button, Card, Dialog, EmptyState, Field, Select, cn, useToast } from "@campus-one/ui";
import { agents, dossiers, pipelineSteps, type AdminDossier } from "@campus-one/mocks";
import { PageHeader } from "./shell";
import { Can, useRole } from "@/lib/permissions";
import { paymentLabel, paymentTone, priorityTone } from "@/lib/labels";

type Filters = { q: string; agent: string; step: string; payment: string; campaign: string; view: string };
const empty: Filters = { q: "", agent: "", step: "", payment: "", campaign: "", view: "all" };
const STORE = "co-bo-dossier-filters";
const PAGE = 12;
const ME = "Claire Mensah";

const views = [
  { id: "all", label: "Tous" },
  { id: "documents", label: "Pièces à vérifier" },
  { id: "echeances", label: "Échéances proches" },
  { id: "impayes", label: "Non payés" },
  { id: "haute", label: "Priorité haute" },
];

export function DossiersTable() {
  const toast = useToast();
  const router = useRouter();
  const sp = useSearchParams();
  const { can } = useRole();
  const scoped = !can("dossiers.read_all");
  const [rows, setRows] = React.useState<AdminDossier[]>(dossiers);
  const [f, setF] = React.useState<Filters>(empty);
  const [sort, setSort] = React.useState<{ key: keyof AdminDossier; dir: 1 | -1 }>({ key: "updatedAt", dir: -1 });
  const [page, setPage] = React.useState(0);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [bulk, setBulk] = React.useState<"assign" | "step" | null>(null);
  const [bulkValue, setBulkValue] = React.useState("");
  const [cursor, setCursor] = React.useState(-1);

  // Filtres persistants entre les sessions (démo : stockage local).
  React.useEffect(() => {
    const filtre = sp.get("filtre");
    try {
      const saved = localStorage.getItem(STORE);
      const base = saved ? { ...empty, ...JSON.parse(saved) } : empty;
      setF(filtre ? { ...base, view: filtre } : base);
    } catch {
      if (filtre) setF({ ...empty, view: filtre });
    }
  }, [sp]);
  React.useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify(f));
    } catch {}
    setPage(0);
  }, [f]);

  const filtered = React.useMemo(() => {
    let r = rows.filter((d) => {
      if (scoped && d.agent !== ME) return false;
      if (f.q && !`${d.candidate} ${d.id} ${d.email} ${d.phone} ${d.formation}`.toLowerCase().includes(f.q.toLowerCase())) return false;
      if (f.agent && d.agent !== f.agent) return false;
      if (f.step && d.step !== f.step) return false;
      if (f.payment && d.payment !== f.payment) return false;
      if (f.campaign && d.campaign !== f.campaign) return false;
      if (f.view === "documents" && !d.docsToReview) return false;
      if (f.view === "echeances" && !d.deadline) return false;
      if (f.view === "impayes" && d.payment !== "non_paye") return false;
      if (f.view === "haute" && d.priority !== "haute") return false;
      return true;
    });
    r = [...r].sort((a, b) => {
      const x = a[sort.key] ?? "";
      const y = b[sort.key] ?? "";
      return (x > y ? 1 : x < y ? -1 : 0) * sort.dir;
    });
    return r;
  }, [rows, f, sort, scoped]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const visible = filtered.slice(page * PAGE, page * PAGE + PAGE);
  const allChecked = visible.length > 0 && visible.every((d) => selected.has(d.id));
  const activeCount = (["agent", "step", "payment", "campaign"] as const).filter((k) => f[k]).length;

  // Navigation clavier : j / k pour se déplacer, Entrée pour ouvrir, x pour sélectionner.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement).tagName)) return;
      if (e.key === "j") setCursor((c) => Math.min(visible.length - 1, c + 1));
      if (e.key === "k") setCursor((c) => Math.max(0, c - 1));
      if (e.key === "Enter" && visible[cursor]) router.push(`/dossiers/${visible[cursor]!.id}`);
      if (e.key === "x" && visible[cursor]) toggle(visible[cursor]!.id);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  function toggle(id: string) {
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  const th = (key: keyof AdminDossier, label: string, cls = "") => (
    <th scope="col" className={cn("px-3 py-2.5 text-left text-xs font-semibold text-muted", cls)} aria-sort={sort.key === key ? (sort.dir === 1 ? "ascending" : "descending") : undefined}>
      <button onClick={() => setSort((s) => ({ key, dir: s.key === key ? (s.dir === 1 ? -1 : 1) : 1 }))} className="inline-flex items-center gap-1 hover:text-navy-900">
        {label}
        <ArrowDownUp className={cn("size-3", sort.key === key ? "text-brand-600" : "text-slate-300")} aria-hidden />
      </button>
    </th>
  );

  const select = (key: keyof Filters, label: string, opts: [string, string][]) => (
    <label className="text-xs">
      <span className="sr-only">{label}</span>
      <select
        value={f[key]}
        onChange={(e) => setF((s) => ({ ...s, [key]: e.target.value }))}
        className={cn("h-9 rounded-lg border bg-white px-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-brand-100", f[key] ? "border-brand-300 text-brand-800" : "border-line text-navy-800")}
      >
        <option value="">{label} : tous</option>
        {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );

  return (
    <>
      <PageHeader
        title="Dossiers"
        description={scoped ? `Vos dossiers affectés (${ME}) · votre profil ne donne pas accès aux dossiers des autres conseillers.` : `${filtered.length} dossiers correspondant aux filtres`}
        actions={
          <Can perm="reports.export">
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Export lancé", description: `${filtered.length} dossiers · vous recevrez le fichier Excel par email.`, tone: "info" })}>
              <Download className="size-4" aria-hidden /> Exporter
            </Button>
          </Can>
        }
      />

      <div className="mb-3 flex gap-1 overflow-x-auto" role="tablist" aria-label="Vues rapides">
        {views.map((v) => (
          <button
            key={v.id}
            role="tab"
            aria-selected={f.view === v.id}
            onClick={() => setF((s) => ({ ...s, view: v.id }))}
            className={cn("whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors", f.view === v.id ? "bg-navy-900 text-white" : "text-muted hover:bg-white hover:text-navy-900")}
          >
            {v.label}
          </button>
        ))}
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
          <div className="relative min-w-56 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <label htmlFor="table-search" className="sr-only">Filtrer le tableau</label>
            <input
              id="table-search"
              value={f.q}
              onChange={(e) => setF((s) => ({ ...s, q: e.target.value }))}
              placeholder="Filtrer par nom, n°, formation…"
              className="h-9 w-full rounded-lg border border-line pl-9 pr-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100"
            />
          </div>
          <Filter className="size-4 text-slate-400" aria-hidden />
          {!scoped && select("agent", "Conseiller", agents.filter((a) => a.load > 0).map((a) => [a.name, a.name]))}
          {select("step", "Étape", pipelineSteps.map((s) => [s, s]))}
          {select("payment", "Paiement", Object.entries(paymentLabel))}
          {select("campaign", "Campagne", [["France 2026-2027", "France 2026-2027"], ["France 2027-2028", "France 2027-2028"]])}
          {(activeCount > 0 || f.q || f.view !== "all") && (
            <Button variant="ghost" size="sm" onClick={() => setF(empty)}><RotateCcw className="size-3.5" aria-hidden /> Réinitialiser</Button>
          )}
        </div>

        {selected.size > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-line bg-brand-50 px-4 py-2.5 text-sm animate-fade-up">
            <span className="font-semibold text-navy-900">{selected.size} sélectionné{selected.size > 1 ? "s" : ""}</span>
            <span className="mx-1 h-4 w-px bg-brand-200" aria-hidden />
            <Can perm="dossiers.assign"><Button size="sm" variant="outline" onClick={() => setBulk("assign")}><UserRoundCog className="size-4" aria-hidden /> Réaffecter</Button></Can>
            <Can perm="dossiers.step"><Button size="sm" variant="outline" onClick={() => setBulk("step")}><Workflow className="size-4" aria-hidden /> Changer d'étape</Button></Can>
            <Can perm="reports.export"><Button size="sm" variant="outline" onClick={() => toast({ title: "Export de la sélection lancé", tone: "info" })}><Download className="size-4" aria-hidden /> Exporter</Button></Can>
            <button onClick={() => setSelected(new Set())} className="ml-auto flex items-center gap-1 text-muted hover:text-navy-900"><X className="size-4" aria-hidden /> Désélectionner</button>
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyState icon={<FileSearch className="size-5" />} title="Aucun dossier ne correspond" description="Modifiez ou réinitialisez vos filtres." action={<Button variant="outline" onClick={() => setF(empty)}>Réinitialiser les filtres</Button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="border-b border-line bg-surface/60">
                <tr>
                  <th scope="col" className="w-10 px-3">
                    <input
                      type="checkbox"
                      aria-label="Tout sélectionner sur cette page"
                      checked={allChecked}
                      onChange={() => setSelected((s) => { const n = new Set(s); visible.forEach((d) => (allChecked ? n.delete(d.id) : n.add(d.id))); return n; })}
                      className="size-4 accent-brand-500"
                    />
                  </th>
                  {th("candidate", "Candidat")}
                  {th("formation", "Formation")}
                  {th("stepIndex", "Étape")}
                  {th("completeness", "Complétude")}
                  {th("payment", "Paiement")}
                  {th("agent", "Conseiller")}
                  {th("updatedAt", "Mis à jour", "text-right")}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {visible.map((d, i) => (
                  <tr
                    key={d.id}
                    onClick={() => router.push(`/dossiers/${d.id}`)}
                    className={cn("cursor-pointer transition-colors hover:bg-surface", selected.has(d.id) && "bg-brand-50/50", cursor === i && "outline outline-2 -outline-offset-2 outline-brand-300")}
                  >
                    <td className="px-3" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" aria-label={`Sélectionner ${d.candidate}`} checked={selected.has(d.id)} onChange={() => toggle(d.id)} className="size-4 accent-brand-500" />
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={d.candidate} size="sm" />
                        <div className="min-w-0">
                          <Link href={`/dossiers/${d.id}`} onClick={(e) => e.stopPropagation()} className="font-semibold text-navy-900 hover:text-brand-700">{d.candidate}</Link>
                          <p className="font-mono text-xs text-muted">{d.id}</p>
                        </div>
                        {d.priority === "haute" && <Badge tone={priorityTone.haute} className="ml-1">Priorité</Badge>}
                      </div>
                    </td>
                    <td className="max-w-56 px-3 py-2.5">
                      <p className="truncate text-navy-900">{d.formation}</p>
                      <p className="truncate text-xs text-muted">{d.school}</p>
                    </td>
                    <td className="px-3 py-2.5">
                      <p className="text-navy-900">{d.step}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        {d.docsToReview > 0 && <span className="text-xs font-medium text-brand-700">{d.docsToReview} pièce{d.docsToReview > 1 ? "s" : ""} à vérifier</span>}
                        {d.deadline && <span className="text-xs text-rose-600">Échéance {d.deadline}</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-16 overflow-hidden rounded-full bg-navy-50"><span className={cn("block h-full rounded-full", d.completeness === 100 ? "bg-emerald-500" : d.completeness < 40 ? "bg-amber-400" : "bg-brand-500")} style={{ width: `${d.completeness}%` }} /></span>
                        <span className="tabular-nums text-xs text-muted">{d.completeness} %</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5"><Badge tone={paymentTone[d.payment]} dot>{paymentLabel[d.payment]}</Badge></td>
                    <td className="px-3 py-2.5 text-navy-800">{d.agent}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-muted">{d.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-line px-4 py-3 text-sm">
          <p className="text-muted">
            {filtered.length ? `${page * PAGE + 1}–${Math.min(filtered.length, (page + 1) * PAGE)} sur ${filtered.length}` : "0 résultat"}
            <span className="ml-3 hidden text-xs lg:inline">Astuce : j / k pour naviguer, x pour sélectionner, Entrée pour ouvrir</span>
          </p>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" disabled={page === 0} onClick={() => setPage((p) => p - 1)} aria-label="Page précédente"><ChevronLeft className="size-4" /></Button>
            <Button size="sm" variant="ghost" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)} aria-label="Page suivante"><ChevronRight className="size-4" /></Button>
          </div>
        </div>
      </Card>

      <Dialog
        open={!!bulk}
        onClose={() => setBulk(null)}
        size="sm"
        title={bulk === "assign" ? `Réaffecter ${selected.size} dossier${selected.size > 1 ? "s" : ""}` : `Changer l'étape de ${selected.size} dossier${selected.size > 1 ? "s" : ""}`}
        description={bulk === "step" ? "Le candidat sera notifié par email du changement d'étape." : "Le nouveau conseiller sera notifié."}
        footer={
          <>
            <Button variant="outline" onClick={() => setBulk(null)}>Annuler</Button>
            <Button
              disabled={!bulkValue}
              onClick={() => {
                setRows((l) => l.map((d) => (selected.has(d.id) ? (bulk === "assign" ? { ...d, agent: bulkValue } : { ...d, step: bulkValue, stepIndex: pipelineSteps.indexOf(bulkValue) }) : d)));
                toast({ title: bulk === "assign" ? "Dossiers réaffectés" : "Étape mise à jour", description: `${selected.size} dossier(s) · action enregistrée dans le journal d'audit.` });
                setSelected(new Set());
                setBulk(null);
                setBulkValue("");
              }}
            >
              Confirmer
            </Button>
          </>
        }
      >
        <Field label={bulk === "assign" ? "Nouveau conseiller" : "Nouvelle étape"} htmlFor="bulk-value">
          <Select id="bulk-value" value={bulkValue} onChange={(e) => setBulkValue(e.target.value)}>
            <option value="">Sélectionner</option>
            {(bulk === "assign" ? agents.filter((a) => a.role === "Conseiller / Agent").map((a) => a.name) : pipelineSteps).map((v) => <option key={v}>{v}</option>)}
          </Select>
        </Field>
      </Dialog>
    </>
  );
}
