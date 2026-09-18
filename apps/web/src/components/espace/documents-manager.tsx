"use client";

import * as React from "react";
import {
  CircleAlert,
  CircleCheck,
  Clock3,
  Eye,
  FileText,
  FileUp,
  History,
  Info,
  Loader2,
  Plus,
  RefreshCw,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { Badge, Button, Card, Dialog, Field, Input, Progress, Tabs, cn, useToast } from "@campus-one/ui";
import { docStatusLabel, docStatusTone, myDocuments, type CandidateDocument } from "@campus-one/mocks";

type Doc = CandidateDocument & { uploading?: number; scanning?: boolean; error?: string };

const statusIcon = {
  a_fournir: FileUp,
  depose: Clock3,
  en_verification: Loader2,
  a_corriger: CircleAlert,
  valide: CircleCheck,
};

function formatSize(bytes: number) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} Mo` : `${Math.round(bytes / 1024)} Ko`;
}

export function DocumentsManager() {
  const toast = useToast();
  const [docs, setDocs] = React.useState<Doc[]>(myDocuments);
  const [tab, setTab] = React.useState("todo");
  const [history, setHistory] = React.useState<Doc | null>(null);
  const [adding, setAdding] = React.useState(false);
  const [dragOver, setDragOver] = React.useState<string | null>(null);
  const inputs = React.useRef<Record<string, HTMLInputElement | null>>({});

  const patch = (id: string, p: Partial<Doc>) => setDocs((l) => l.map((d) => (d.id === id ? { ...d, ...p } : d)));

  function upload(doc: Doc, file: File | undefined) {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      patch(doc.id, { error: `« ${file.name} » n'est pas un PDF. Convertissez votre fichier en PDF puis réessayez.` });
      return;
    }
    if (file.size > doc.maxMb * 1024 * 1024) {
      patch(doc.id, { error: `Le fichier fait ${formatSize(file.size)}, la limite est de ${doc.maxMb} Mo. Compressez-le puis réessayez.` });
      return;
    }
    patch(doc.id, { error: undefined, uploading: 0 });
    let p = 0;
    const t = setInterval(() => {
      p += 12 + Math.random() * 18;
      if (p >= 100) {
        clearInterval(t);
        patch(doc.id, { uploading: undefined, scanning: true });
        setTimeout(() => {
          patch(doc.id, {
            scanning: false,
            status: "depose",
            file: file.name,
            size: formatSize(file.size),
            uploadedAt: "18/09/2026",
            version: (doc.version ?? 0) + 1,
            reason: undefined,
          });
          toast({ title: "Document déposé", description: `${doc.type} sera vérifié par votre conseillère sous 48 h.` });
        }, 1400);
      } else patch(doc.id, { uploading: p });
    }, 180);
  }

  const todo = docs.filter((d) => d.status === "a_corriger" || d.status === "a_fournir");
  const pending = docs.filter((d) => d.status === "depose" || d.status === "en_verification");
  const done = docs.filter((d) => d.status === "valide");
  const list = tab === "todo" ? todo : tab === "pending" ? pending : tab === "done" ? done : docs;
  const required = docs.filter((d) => d.required);
  const validatedRequired = required.filter((d) => d.status === "valide").length;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
      <div className="min-w-0 space-y-4">
        <Card className="grid grid-cols-2 divide-line sm:grid-cols-4 sm:divide-x">
          {[
            { label: "À traiter", value: todo.length, cls: "text-rose-600" },
            { label: "En cours de vérification", value: pending.length, cls: "text-amber-600" },
            { label: "Validés", value: done.length, cls: "text-emerald-600" },
            { label: "Obligatoires validés", value: `${validatedRequired}/${required.length}`, cls: "text-navy-900" },
          ].map((s) => (
            <div key={s.label} className="p-4">
              <p className={cn("text-2xl font-extrabold", s.cls)}>{s.value}</p>
              <p className="text-xs text-muted">{s.label}</p>
            </div>
          ))}
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3 px-2 pr-4">
            <Tabs
              className="flex-1 border-b-0"
              value={tab}
              onChange={setTab}
              items={[
                { id: "todo", label: "À traiter", count: todo.length },
                { id: "pending", label: "En vérification", count: pending.length },
                { id: "done", label: "Validés", count: done.length },
                { id: "all", label: "Tous", count: docs.length },
              ]}
            />
            <Button size="sm" variant="ghost" onClick={() => setAdding(true)} className="max-sm:hidden">
              <Plus className="size-4" aria-hidden /> Ajouter un document
            </Button>
          </div>

          <ul className="divide-y divide-line border-t border-line">
            {list.length === 0 && (
              <li className="flex flex-col items-center px-6 py-12 text-center">
                <CircleCheck className="size-10 text-emerald-500" aria-hidden />
                <p className="mt-3 font-semibold text-navy-900">Rien à traiter ici</p>
                <p className="text-sm text-muted">Tous vos documents de cette catégorie sont à jour.</p>
              </li>
            )}
            {list.map((d) => {
              const Icon = statusIcon[d.status];
              const busy = d.uploading !== undefined || d.scanning;
              const canUpload = d.status === "a_fournir" || d.status === "a_corriger";
              return (
                <li
                  key={d.id}
                  className={cn("p-4 transition-colors sm:p-5", dragOver === d.id && "bg-brand-50")}
                  onDragOver={(e) => {
                    if (!canUpload) return;
                    e.preventDefault();
                    setDragOver(d.id);
                  }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(null);
                    if (canUpload) upload(d, e.dataTransfer.files[0]);
                  }}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <span
                      className={cn(
                        "flex size-11 shrink-0 items-center justify-center rounded-xl",
                        d.status === "valide" && "bg-emerald-50 text-emerald-600",
                        d.status === "a_corriger" && "bg-rose-50 text-rose-600",
                        (d.status === "depose" || d.status === "en_verification") && "bg-amber-50 text-amber-600",
                        d.status === "a_fournir" && "bg-navy-50 text-navy-500",
                      )}
                    >
                      <Icon className={cn("size-5", d.status === "en_verification" && "animate-spin [animation-duration:3s]")} aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-navy-900">{d.type}</p>
                        <Badge tone={docStatusTone[d.status]}>{docStatusLabel[d.status]}</Badge>
                        {!d.required && <span className="text-xs text-muted">Facultatif</span>}
                      </div>
                      {d.file ? (
                        <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted">
                          <FileText className="size-3.5" aria-hidden />
                          <span className="truncate">{d.file}</span> · {d.size} · déposé le {d.uploadedAt}
                          {d.version && d.version > 1 && <span>· version {d.version}</span>}
                        </p>
                      ) : (
                        <p className="mt-1 text-sm text-muted">PDF, {d.maxMb} Mo maximum</p>
                      )}
                      {d.status === "a_corriger" && d.reason && (
                        <div className="mt-3 flex gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-900">
                          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                          <p><span className="font-semibold">Motif : </span>{d.reason}</p>
                        </div>
                      )}
                      {d.status === "depose" && <p className="mt-2 text-sm text-amber-700">Votre conseillère vérifiera ce document sous 48 heures ouvrées.</p>}
                      {d.error && (
                        <p className="mt-3 flex gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700" role="alert">
                          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                          {d.error}
                        </p>
                      )}
                      {d.uploading !== undefined && (
                        <div className="mt-3" aria-live="polite">
                          <div className="mb-1 flex justify-between text-xs text-muted"><span>Envoi en cours…</span><span>{Math.round(d.uploading)} %</span></div>
                          <Progress value={d.uploading} label={`Envoi de ${d.type}`} />
                        </div>
                      )}
                      {d.scanning && (
                        <p className="mt-3 flex items-center gap-2 text-sm text-brand-700" aria-live="polite">
                          <ShieldCheck className="size-4" aria-hidden /> Analyse de sécurité du fichier…
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                      {d.file && !busy && (
                        <Button size="sm" variant="ghost" aria-label={`Aperçu de ${d.type}`} onClick={() => toast({ title: "Aperçu", description: "L'aperçu PDF s'ouvrira ici dans la version finale.", tone: "info" })}>
                          <Eye className="size-4" aria-hidden />
                        </Button>
                      )}
                      {d.version && d.version > 1 && (
                        <Button size="sm" variant="ghost" aria-label={`Historique des versions de ${d.type}`} onClick={() => setHistory(d)}>
                          <History className="size-4" aria-hidden />
                        </Button>
                      )}
                      {canUpload && (
                        <>
                          <input
                            ref={(el) => { inputs.current[d.id] = el; }}
                            type="file"
                            accept="application/pdf,.pdf"
                            className="sr-only"
                            id={`file-${d.id}`}
                            onChange={(e) => {
                              upload(d, e.target.files?.[0]);
                              e.target.value = "";
                            }}
                          />
                          <Button size="sm" variant={d.status === "a_corriger" ? "primary" : "outline"} disabled={busy} onClick={() => inputs.current[d.id]?.click()}>
                            {d.status === "a_corriger" ? <RefreshCw className="size-4" aria-hidden /> : <UploadCloud className="size-4" aria-hidden />}
                            {d.status === "a_corriger" ? "Remplacer" : "Déposer"}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  {canUpload && !busy && (
                    <label
                      htmlFor={`file-${d.id}`}
                      className={cn(
                        "mt-4 hidden cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed py-4 text-sm transition-colors sm:flex",
                        dragOver === d.id ? "border-brand-400 text-brand-700" : "border-line text-muted hover:border-brand-300 hover:text-navy-900",
                      )}
                    >
                      <UploadCloud className="size-4" aria-hidden /> Glissez votre PDF ici ou <span className="font-semibold text-brand-600">parcourez vos fichiers</span>
                    </label>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
        <Button variant="outline" className="w-full sm:hidden" onClick={() => setAdding(true)}><Plus className="size-4" aria-hidden /> Ajouter un document</Button>
      </div>

      <aside className="space-y-4">
        <Card className="p-5">
          <p className="flex items-center gap-2 font-semibold text-navy-900"><Info className="size-4.5 text-brand-500" aria-hidden /> Comment ça marche ?</p>
          <ol className="mt-4 space-y-4">
            {(["a_fournir", "depose", "en_verification", "a_corriger", "valide"] as const).map((s) => (
              <li key={s} className="flex gap-3 text-sm">
                <Badge tone={docStatusTone[s]} className="h-fit">{docStatusLabel[s]}</Badge>
                <span className="text-muted">
                  {{
                    a_fournir: "Pièce attendue.",
                    depose: "Bien reçue.",
                    en_verification: "Votre conseillère la contrôle.",
                    a_corriger: "Motif indiqué, nouvelle version demandée.",
                    valide: "Contrôlée et acceptée.",
                  }[s]}
                </span>
              </li>
            ))}
          </ol>
        </Card>
        <Card className="p-5">
          <p className="font-semibold text-navy-900">Conseils pour un PDF valide</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Scannez en couleur, toutes les pages lisibles.</li>
            <li>Un seul fichier par pièce (regroupez les pages).</li>
            <li>Documents non francophones : joignez la traduction officielle.</li>
          </ul>
        </Card>
        <p className="flex gap-2 px-1 text-xs text-muted"><ShieldCheck className="size-4 shrink-0 text-emerald-600" aria-hidden /> Vos fichiers sont analysés, chiffrés et accessibles uniquement à votre conseillère.</p>
      </aside>

      <Dialog open={!!history} onClose={() => setHistory(null)} title={`Historique — ${history?.type ?? ""}`} description="Les versions précédentes restent conservées dans votre dossier.">
        <ol className="space-y-3">
          {Array.from({ length: history?.version ?? 0 }).map((_, i) => {
            const v = (history?.version ?? 0) - i;
            return (
              <li key={v} className="flex items-center gap-3 rounded-xl border border-line p-3">
                <FileText className="size-5 text-navy-400" aria-hidden />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-navy-900">Version {v}{i === 0 && " (actuelle)"}</p>
                  <p className="text-xs text-muted">{i === 0 ? history?.uploadedAt : `0${9 - i}/09/2026`}</p>
                </div>
                <Badge tone={i === 0 ? docStatusTone[history!.status] : "neutral"}>{i === 0 ? docStatusLabel[history!.status] : "Remplacée"}</Badge>
              </li>
            );
          })}
        </ol>
      </Dialog>

      <Dialog
        open={adding}
        onClose={() => setAdding(false)}
        title="Ajouter un document"
        description="Pour une pièce demandée par votre conseillère qui ne figure pas dans la liste."
        footer={
          <>
            <Button variant="outline" onClick={() => setAdding(false)}>Annuler</Button>
            <Button
              onClick={() => {
                const name = (document.getElementById("new-doc") as HTMLInputElement | null)?.value.trim();
                if (!name) return;
                setDocs((l) => [...l, { id: `x${l.length}`, type: name, required: false, status: "a_fournir", maxMb: 10 }]);
                setAdding(false);
                setTab("todo");
                toast({ title: "Document ajouté à votre liste", description: "Vous pouvez maintenant déposer le fichier." });
              }}
            >
              Ajouter
            </Button>
          </>
        }
      >
        <Field label="Intitulé du document" htmlFor="new-doc" hint="Par exemple : attestation de stage, certificat de scolarité.">
          <Input id="new-doc" />
        </Field>
      </Dialog>
    </div>
  );
}
