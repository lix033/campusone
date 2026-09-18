"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CircleCheck,
  Download,
  Eye,
  FileArchive,
  FileText,
  Handshake,
  Lock,
  Mail,
  Phone,
  Plus,
  Send,
  ShieldCheck,
  StickyNote,
  UserRoundCog,
  X,
} from "lucide-react";
import { Avatar, Badge, Button, Card, CardHeader, Dialog, Field, Input, Progress, Select, Tabs, Textarea, cn, useToast } from "@campus-one/ui";
import { agents, auditLog, docStatusLabel, docStatusTone, formatFCFA, myDocuments, myMessages, pipelineSteps, type AdminDossier, type CandidateDocument } from "@campus-one/mocks";
import { Can, useRole } from "@/lib/permissions";
import { paymentLabel, paymentTone } from "@/lib/labels";

const rejectReasons = ["Document illisible", "Document incomplet", "Document expiré", "Mauvais document", "Traduction officielle manquante"];

export function DossierView({ dossier }: { dossier: AdminDossier }) {
  const toast = useToast();
  const { can, user } = useRole();
  const [d, setD] = React.useState(dossier);
  const [tab, setTab] = React.useState("documents");
  const [docs, setDocs] = React.useState<CandidateDocument[]>(
    myDocuments.map((x, i) => (i === 5 || i === 4 ? { ...x, status: i < 5 ? "en_verification" : "depose" } : x)),
  );
  const [reject, setReject] = React.useState<CandidateDocument | null>(null);
  const [reason, setReason] = React.useState("");
  const [reasonDetail, setReasonDetail] = React.useState("");
  const [stepDialog, setStepDialog] = React.useState(false);
  const [assign, setAssign] = React.useState(false);
  const [payDialog, setPayDialog] = React.useState(false);
  const [notes, setNotes] = React.useState([{ id: "n1", author: "Claire Mensah", date: "16/09/2026", body: "Candidate très motivée, bon dossier. Vérifier la cohérence du projet pro avant l'entretien Campus France." }]);
  const [remarks, setRemarks] = React.useState([{ id: "r1", date: "17/09/2026", body: "Le relevé du semestre 6 est manquant. Merci de fournir un seul PDF regroupant les semestres 3 à 6.", resolved: false }]);
  const [draft, setDraft] = React.useState("");

  const next = pipelineSteps[d.stepIndex + 1];
  const toReview = docs.filter((x) => x.status === "depose" || x.status === "en_verification");
  const required = docs.filter((x) => x.required);
  const completeness = Math.round((required.filter((x) => x.status === "valide").length / required.length) * 100);

  function setDocStatus(id: string, status: CandidateDocument["status"], motif?: string) {
    setDocs((l) => l.map((x) => (x.id === id ? { ...x, status, reason: motif } : x)));
  }

  return (
    <>
      <Link href="/dossiers" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy-900"><ArrowLeft className="size-4" aria-hidden /> Dossiers</Link>

      <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={d.candidate} size="lg" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-navy-900">{d.candidate}</h1>
              <Badge tone="navy">{d.campaign}</Badge>
              {d.priority === "haute" && <Badge tone="danger">Priorité haute</Badge>}
            </div>
            <p className="mt-0.5 text-sm text-muted"><span className="font-mono">{d.id}</span> · {d.formation} · {d.school}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Can perm="docs.download_zip">
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Archive ZIP en préparation", description: "Le téléchargement démarrera automatiquement.", tone: "info" })}><FileArchive className="size-4" aria-hidden /> Dossier ZIP</Button>
          </Can>
          <Button variant="outline" size="sm" onClick={() => toast({ title: "PDF récapitulatif généré", tone: "info" })}><Download className="size-4" aria-hidden /> Récapitulatif PDF</Button>
          <Can perm="dossiers.assign"><Button variant="outline" size="sm" onClick={() => setAssign(true)}><UserRoundCog className="size-4" aria-hidden /> Réaffecter</Button></Can>
          <Can perm="dossiers.complete">
            <Button variant="success" size="sm" disabled={completeness < 100} title={completeness < 100 ? "Toutes les pièces obligatoires doivent être validées" : undefined} onClick={() => toast({ title: "Dossier déclaré complet" })}>
              <ShieldCheck className="size-4" aria-hidden /> Valider la complétude
            </Button>
          </Can>
        </div>
      </div>

      {/* Étapes */}
      <Card className="mt-6 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <ol className="flex flex-1 items-center overflow-x-auto pb-1">
            {pipelineSteps.map((s, i) => (
              <li key={s} className={cn("flex items-center", i < pipelineSteps.length - 1 && "flex-1")}>
                <span className="flex min-w-max items-center gap-2">
                  <span className={cn("flex size-6 items-center justify-center rounded-full text-[11px] font-bold", i < d.stepIndex && "bg-brand-500 text-white", i === d.stepIndex && "bg-navy-900 text-white ring-4 ring-navy-100", i > d.stepIndex && "border-2 border-line text-slate-400")}>
                    {i < d.stepIndex ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : i + 1}
                  </span>
                  <span className={cn("text-xs font-medium", i === d.stepIndex ? "text-navy-900" : i < d.stepIndex ? "text-navy-700" : "text-slate-400")}>{s}</span>
                </span>
                {i < pipelineSteps.length - 1 && <span className={cn("mx-2 h-0.5 min-w-4 flex-1 rounded-full", i < d.stepIndex ? "bg-brand-500" : "bg-line")} aria-hidden />}
              </li>
            ))}
          </ol>
          <Can perm="dossiers.step">
            {next && <Button size="sm" onClick={() => setStepDialog(true)} className="shrink-0">Passer à « {next} »</Button>}
          </Can>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_320px]">
        <Card className="min-w-0">
          <Tabs
            className="px-2"
            value={tab}
            onChange={setTab}
            items={[
              { id: "documents", label: "Documents", count: toReview.length },
              { id: "remarques", label: "Remarques candidat", count: remarks.filter((r) => !r.resolved).length },
              { id: "notes", label: "Notes internes" },
              { id: "messages", label: "Messages" },
              { id: "paiements", label: "Paiements" },
              { id: "historique", label: "Historique" },
            ]}
          />

          {tab === "documents" && (
            <ul className="divide-y divide-line">
              {docs.map((x) => {
                const reviewable = can("docs.review") && (x.status === "depose" || x.status === "en_verification");
                return (
                  <li key={x.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                    <FileText className="size-5 shrink-0 text-navy-300" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-navy-900">{x.type}</p>
                        <Badge tone={docStatusTone[x.status]}>{docStatusLabel[x.status]}</Badge>
                        {!x.required && <span className="text-xs text-muted">Facultatif</span>}
                      </div>
                      <p className="truncate text-xs text-muted">{x.file ? `${x.file} · ${x.size} · v${x.version} · ${x.uploadedAt}` : "Non déposé"}</p>
                      {x.status === "a_corriger" && x.reason && <p className="mt-1 text-xs text-rose-700">Motif envoyé : {x.reason}</p>}
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      {x.file && <Button size="sm" variant="ghost" aria-label={`Consulter ${x.type}`} onClick={() => toast({ title: "Visionneuse PDF", description: "Consultation filigranée · accès journalisé.", tone: "info" })}><Eye className="size-4" aria-hidden /></Button>}
                      {reviewable && (
                        <>
                          <Button size="sm" variant="outline" className="text-rose-700" onClick={() => { setReject(x); setReason(""); setReasonDetail(""); }}><X className="size-4" aria-hidden /> Rejeter</Button>
                          <Button size="sm" variant="success" onClick={() => { setDocStatus(x.id, "valide"); toast({ title: `${x.type} validé`, description: "Le candidat a été notifié." }); }}><Check className="size-4" aria-hidden /> Valider</Button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
              <li className="px-5 py-3">
                <Button size="sm" variant="ghost" onClick={() => { setDocs((l) => [...l, { id: `x${l.length}`, type: "Attestation d'hébergement", required: false, status: "a_fournir", maxMb: 10 }]); toast({ title: "Pièce ajoutée à la checklist", description: "Le candidat la verra dans son espace." }); }}>
                  <Plus className="size-4" aria-hidden /> Demander un document supplémentaire
                </Button>
              </li>
            </ul>
          )}

          {tab === "remarques" && (
            <div className="space-y-4 p-5">
              <p className="rounded-xl bg-sky-50 p-3 text-sm text-sky-900">Les remarques sont visibles par le candidat, qui reçoit un email l'invitant à se connecter.{d.partner && " Le partenaire est en copie."}</p>
              {remarks.map((r) => (
                <div key={r.id} className="rounded-xl border border-line p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-muted">{r.date} · Claire Mensah</p>
                    {r.resolved ? <Badge tone="success">Résolue</Badge> : <Badge tone="warning">En attente du candidat</Badge>}
                  </div>
                  <p className="mt-2 text-sm text-navy-900">{r.body}</p>
                  {!r.resolved && <Button size="sm" variant="ghost" className="mt-2" onClick={() => setRemarks((l) => l.map((x) => (x.id === r.id ? { ...x, resolved: true } : x)))}><CircleCheck className="size-4" aria-hidden /> Marquer comme résolue</Button>}
                </div>
              ))}
              <Can perm="dossiers.edit">
                <div className="space-y-2">
                  <label htmlFor="remark" className="text-sm font-medium text-navy-900">Nouvelle remarque</label>
                  <Textarea id="remark" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Précisez l'action attendue du candidat…" />
                  <div className="flex justify-end">
                    <Button size="sm" disabled={!draft.trim()} onClick={() => { setRemarks((l) => [{ id: String(Date.now()), date: "18/09/2026", body: draft, resolved: false }, ...l]); setDraft(""); toast({ title: "Remarque envoyée", description: "Email de notification envoyé au candidat." }); }}>
                      <Send className="size-4" aria-hidden /> Envoyer au candidat
                    </Button>
                  </div>
                </div>
              </Can>
            </div>
          )}

          {tab === "notes" && (
            <div className="space-y-4 p-5">
              <p className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900"><Lock className="size-4" aria-hidden /> Notes internes : jamais visibles par le candidat.</p>
              {notes.map((n) => (
                <div key={n.id} className="flex gap-3 rounded-xl bg-surface p-4">
                  <StickyNote className="size-4 shrink-0 text-amber-500" aria-hidden />
                  <div><p className="text-sm text-navy-900">{n.body}</p><p className="mt-1 text-xs text-muted">{n.author} · {n.date}</p></div>
                </div>
              ))}
              <form
                className="space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const t = e.currentTarget.note.value.trim();
                  if (!t) return;
                  setNotes((l) => [{ id: String(Date.now()), author: user.name, date: "18/09/2026", body: t }, ...l]);
                  e.currentTarget.reset();
                }}
              >
                <label htmlFor="note" className="sr-only">Nouvelle note interne</label>
                <Textarea id="note" name="note" placeholder="Ajouter une note interne…" className="min-h-20" />
                <div className="flex justify-end"><Button size="sm" variant="secondary" type="submit">Ajouter la note</Button></div>
              </form>
            </div>
          )}

          {tab === "messages" && (
            <div className="space-y-3 bg-surface/50 p-5">
              {myMessages.map((m) => (
                <div key={m.id} className={cn("flex", m.from === "advisor" && "justify-end")}>
                  <div className={cn("max-w-md rounded-2xl px-4 py-2.5 text-sm", m.from === "advisor" ? "bg-navy-900 text-white" : "bg-white text-navy-900 shadow-soft")}>
                    {m.body}
                    <p className={cn("mt-1 text-[11px]", m.from === "advisor" ? "text-navy-200" : "text-muted")}>{m.time}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <label htmlFor="reply" className="sr-only">Répondre</label>
                <Input id="reply" placeholder="Répondre au candidat…" />
                <Button onClick={() => toast({ title: "Message envoyé" })} aria-label="Envoyer"><Send className="size-4" /></Button>
              </div>
            </div>
          )}

          {tab === "paiements" && (
            <div className="p-5">
              <ul className="divide-y divide-line rounded-xl border border-line">
                <li className="flex items-center justify-between gap-3 p-4 text-sm"><div><p className="font-medium text-navy-900">Frais de dossier</p><p className="text-xs text-muted">Agence · 03/06/2026 · REC-2026-0418 · enregistré par Didier Kpodar</p></div><span className="font-semibold">{formatFCFA(150000)}</span><Badge tone="success">Payé</Badge></li>
                <li className="flex items-center justify-between gap-3 p-4 text-sm"><div><p className="font-medium text-navy-900">Accompagnement Campus France & visa</p><p className="text-xs text-muted">Échéance 30/09/2026</p></div><span className="font-semibold">{formatFCFA(350000)}</span><Badge tone={paymentTone[d.payment]}>{paymentLabel[d.payment]}</Badge></li>
              </ul>
              <Can perm="payments.record">
                <Button size="sm" className="mt-4" onClick={() => setPayDialog(true)}><Plus className="size-4" aria-hidden /> Enregistrer un paiement hors ligne</Button>
              </Can>
              {!can("payments.record") && <p className="mt-4 text-xs text-muted">L'enregistrement des paiements est réservé au service comptable.</p>}
            </div>
          )}

          {tab === "historique" && (
            <ol className="space-y-4 p-5">
              {auditLog.slice(0, 6).map((l) => (
                <li key={l.id} className="flex gap-3 text-sm">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-navy-300" aria-hidden />
                  <p className="text-muted"><span className="font-medium text-navy-900">{l.actor}</span> {l.action} — {l.target}<span className="block text-xs">{l.at}</span></p>
                </li>
              ))}
            </ol>
          )}
        </Card>

        <aside className="space-y-4">
          <Card className="p-5">
            <p className="text-sm font-semibold text-navy-900">Complétude</p>
            <div className="mt-2 flex items-end justify-between"><p className="text-2xl font-extrabold tabular-nums">{completeness} %</p><p className="text-xs text-muted">pièces obligatoires validées</p></div>
            <Progress value={completeness} tone={completeness === 100 ? "success" : "brand"} className="mt-2" label="Complétude" />
          </Card>
          <Card>
            <CardHeader title="Candidat" />
            <dl className="space-y-3 p-5 text-sm">
              <div className="flex items-center gap-2"><Mail className="size-4 text-slate-400" aria-hidden /><dt className="sr-only">Email</dt><dd className="truncate">{d.email}</dd></div>
              <div className="flex items-center gap-2"><Phone className="size-4 text-slate-400" aria-hidden /><dt className="sr-only">Téléphone</dt><dd>{d.phone}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Pays</dt><dd>{d.country}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Conseiller</dt><dd className="font-medium">{d.agent}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Dernière activité</dt><dd>{d.updatedAt}</dd></div>
            </dl>
          </Card>
          {d.partner && (
            <Card className="p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-navy-900"><Handshake className="size-4 text-brand-500" aria-hidden /> Partenaire</p>
              <p className="mt-2 text-sm">Edu Conseil Lomé · <span className="font-mono text-xs">{d.partner}</span></p>
              <p className="mt-1 text-xs text-muted">Reçoit une copie de tous les emails adressés au candidat.</p>
            </Card>
          )}
        </aside>
      </div>

      <Dialog
        open={!!reject}
        onClose={() => setReject(null)}
        title={`Rejeter : ${reject?.type ?? ""}`}
        description="Le motif est obligatoire. Il sera affiché au candidat avec une demande de nouvelle version."
        footer={
          <>
            <Button variant="outline" onClick={() => setReject(null)}>Annuler</Button>
            <Button
              variant="danger"
              disabled={!reason}
              onClick={() => {
                setDocStatus(reject!.id, "a_corriger", [reason, reasonDetail].filter(Boolean).join(" — "));
                toast({ title: "Pièce rejetée", description: "Le candidat a reçu un email avec le motif." });
                setReject(null);
              }}
            >
              Rejeter et notifier
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <fieldset>
            <legend className="text-sm font-medium text-navy-900">Motif <span className="text-rose-500">*</span></legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {rejectReasons.map((r) => (
                <button key={r} type="button" aria-pressed={reason === r} onClick={() => setReason(r)} className={cn("rounded-full border px-3 py-1.5 text-sm transition-colors", reason === r ? "border-rose-400 bg-rose-50 text-rose-800" : "border-line hover:border-navy-200")}>{r}</button>
              ))}
            </div>
          </fieldset>
          <Field label="Précision pour le candidat" htmlFor="detail" optional>
            <Textarea id="detail" value={reasonDetail} onChange={(e) => setReasonDetail(e.target.value)} placeholder="Ex. le relevé du semestre 6 est manquant." className="min-h-20" />
          </Field>
        </div>
      </Dialog>

      <Dialog
        open={stepDialog}
        onClose={() => setStepDialog(false)}
        size="sm"
        title={`Passer à l'étape « ${next} » ?`}
        description="Le candidat recevra un email de notification. L'action sera tracée dans le journal d'audit."
        footer={
          <>
            <Button variant="outline" onClick={() => setStepDialog(false)}>Annuler</Button>
            <Button onClick={() => { setD((x) => ({ ...x, stepIndex: x.stepIndex + 1, step: next! })); setStepDialog(false); toast({ title: `Dossier passé à « ${next} »`, description: "Email envoyé au candidat." }); }}>Confirmer</Button>
          </>
        }
      >
        {toReview.length > 0 && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Attention : {toReview.length} pièce(s) restent à vérifier sur ce dossier.</p>}
      </Dialog>

      <Dialog
        open={assign}
        onClose={() => setAssign(false)}
        size="sm"
        title="Réaffecter le dossier"
        footer={<><Button variant="outline" onClick={() => setAssign(false)}>Annuler</Button><Button onClick={() => { const v = (document.getElementById("new-agent") as HTMLSelectElement).value; setD((x) => ({ ...x, agent: v })); setAssign(false); toast({ title: `Dossier réaffecté à ${v}` }); }}>Réaffecter</Button></>}
      >
        <Field label="Conseiller" htmlFor="new-agent">
          <Select id="new-agent" defaultValue={d.agent}>
            {agents.filter((a) => a.role === "Conseiller / Agent").map((a) => <option key={a.id}>{a.name}</option>)}
          </Select>
        </Field>
      </Dialog>

      <Dialog
        open={payDialog}
        onClose={() => setPayDialog(false)}
        title="Enregistrer un paiement hors ligne"
        footer={<><Button variant="outline" onClick={() => setPayDialog(false)}>Annuler</Button><Button onClick={() => { setD((x) => ({ ...x, payment: "paye" })); setPayDialog(false); toast({ title: "Paiement enregistré", description: "Reçu généré et envoyé par email au candidat." }); }}>Enregistrer</Button></>}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Objet" htmlFor="p-obj" className="sm:col-span-2"><Select id="p-obj"><option>Accompagnement Campus France & visa</option><option>Frais de dossier</option></Select></Field>
          <Field label="Montant (FCFA)" htmlFor="p-amount"><Input id="p-amount" defaultValue="350000" inputMode="numeric" /></Field>
          <Field label="Date" htmlFor="p-date"><Input id="p-date" type="date" defaultValue="2026-09-18" /></Field>
          <Field label="Mode" htmlFor="p-mode"><Select id="p-mode"><option>Espèces</option><option>Chèque</option><option>Virement</option></Select></Field>
          <Field label="Statut" htmlFor="p-status"><Select id="p-status"><option>Payé</option><option>Paiement partiel</option><option>Exonéré</option></Select></Field>
          <Field label="Référence du reçu" htmlFor="p-ref" className="sm:col-span-2"><Input id="p-ref" placeholder="REC-2026-…" /></Field>
        </div>
      </Dialog>
    </>
  );
}
