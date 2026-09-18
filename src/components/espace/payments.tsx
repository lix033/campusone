"use client";

import * as React from "react";
import {
  Building2,
  Check,
  CircleCheck,
  Clock3,
  Copy,
  CreditCard,
  Download,
  FileImage,
  Landmark,
  MapPin,
  Smartphone,
  UploadCloud,
} from "lucide-react";
import { Badge, Button, Card, CardHeader, Progress, cn, useToast } from "@/components/ui";
import { bank, contact, formatFCFA, myPayments, paymentStatusLabel, type Payment } from "@/lib/mocks";

const tone = { non_paye: "danger", en_attente: "warning", paye: "success", exonere: "neutral" } as const;

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className="truncate font-mono text-sm font-semibold text-navy-900">{value}</p>
      </div>
      <button
        onClick={() => {
          navigator.clipboard?.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        }}
        className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-brand-600 hover:bg-brand-50"
        aria-label={`Copier ${label}`}
      >
        {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
        {copied ? "Copié" : "Copier"}
      </button>
    </div>
  );
}

export function Payments() {
  const toast = useToast();
  const [payments, setPayments] = React.useState<Payment[]>(myPayments);
  const due = payments.find((p) => p.status === "non_paye");
  const [method, setMethod] = React.useState<"agence" | "banque" | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [progress, setProgress] = React.useState<number | null>(null);
  const [error, setError] = React.useState("");

  function send() {
    if (!file) return setError("Ajoutez la photo ou le scan de votre bordereau.");
    setError("");
    setProgress(0);
    let p = 0;
    const t = setInterval(() => {
      p += 20;
      setProgress(p);
      if (p >= 100) {
        clearInterval(t);
        setPayments((l) => l.map((x) => (x.id === due!.id ? { ...x, status: "en_attente", method: "Dépôt bancaire", date: "18 septembre 2026" } : x)));
        setProgress(null);
        setMethod(null);
        setFile(null);
        toast({ title: "Bordereau reçu", description: "Un email de confirmation vous a été envoyé. Validation sous 48 h ouvrées." });
      }
    }, 200);
  }

  const methods = [
    { id: "agence" as const, icon: Building2, title: "Règlement en agence", text: "Espèces ou chèque, à nos horaires d'ouverture.", badge: null },
    { id: "banque" as const, icon: Landmark, title: "Dépôt bancaire", text: "Déposez le montant en banque puis envoyez le bordereau.", badge: "Recommandé à distance" },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-6">
        {due ? (
          <Card className="animate-fade-up overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-line bg-amber-50/60 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge tone="warning" dot>À régler avant le {due.due}</Badge>
                <p className="mt-2 text-lg font-bold text-navy-900">{due.label}</p>
                <p className="text-sm text-muted">Référence de paiement : <span className="font-mono font-semibold text-navy-900">{due.reference}</span></p>
              </div>
              <p className="text-3xl font-extrabold text-navy-900">{formatFCFA(due.amount)}</p>
            </div>
            <div className="p-5">
              <p className="font-semibold text-navy-900">Comment souhaitez-vous payer ?</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Mode de paiement">
                {methods.map((m) => (
                  <button
                    key={m.id}
                    role="radio"
                    aria-checked={method === m.id}
                    onClick={() => setMethod(m.id)}
                    className={cn(
                      "relative rounded-2xl border p-4 text-left transition-all",
                      method === m.id ? "border-brand-500 bg-brand-50/60 ring-4 ring-brand-100" : "border-line hover:border-brand-300",
                    )}
                  >
                    <m.icon className="size-6 text-brand-600" aria-hidden />
                    <p className="mt-3 font-semibold text-navy-900">{m.title}</p>
                    <p className="mt-1 text-sm text-muted">{m.text}</p>
                    {m.badge && <span className="mt-3 inline-block rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-semibold text-brand-800">{m.badge}</span>}
                  </button>
                ))}
                <div className="rounded-2xl border border-dashed border-line p-4 opacity-70" aria-disabled>
                  <div className="flex gap-1.5 text-navy-400"><CreditCard className="size-6" aria-hidden /><Smartphone className="size-6" aria-hidden /></div>
                  <p className="mt-3 font-semibold text-navy-900">Carte ou mobile money</p>
                  <p className="mt-1 text-sm text-muted">Paiement instantané en ligne.</p>
                  <span className="mt-3 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">Bientôt disponible</span>
                </div>
              </div>

              {method === "agence" && (
                <div className="mt-6 animate-fade-up rounded-2xl bg-surface p-5">
                  <p className="flex items-center gap-2 font-semibold text-navy-900"><MapPin className="size-4.5 text-brand-500" aria-hidden /> Agence Campus One</p>
                  <p className="mt-2 text-sm text-muted">{contact.address}<br />{contact.hours}</p>
                  <p className="mt-4 text-sm text-navy-800">Présentez la référence <span className="font-mono font-semibold">{due.reference}</span>. Votre paiement sera enregistré immédiatement et votre reçu disponible ici.</p>
                </div>
              )}

              {method === "banque" && (
                <div className="mt-6 animate-fade-up space-y-5">
                  <ol className="grid gap-3 sm:grid-cols-3">
                    {["Effectuez le dépôt en banque", "Indiquez la référence sur le bordereau", "Envoyez la photo du bordereau"].map((s, i) => (
                      <li key={s} className="flex items-center gap-3 rounded-xl border border-line p-3 text-sm">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white">{i + 1}</span>
                        <span className="text-navy-800">{s}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="grid gap-2 rounded-2xl bg-surface p-3 sm:grid-cols-2">
                    <CopyField label="Titulaire" value={bank.holder} />
                    <CopyField label="Banque" value={bank.bank} />
                    <CopyField label="IBAN" value={bank.iban} />
                    <CopyField label="BIC" value={bank.bic} />
                    <CopyField label="Montant exact" value={formatFCFA(due.amount)} />
                    <CopyField label="Référence à indiquer (obligatoire)" value={due.reference} />
                  </div>
                  <div>
                    <label
                      htmlFor="bordereau"
                      className={cn(
                        "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors",
                        file ? "border-emerald-300 bg-emerald-50/50" : error ? "border-rose-300" : "border-line hover:border-brand-300 hover:bg-brand-50/40",
                      )}
                    >
                      {file ? <FileImage className="size-8 text-emerald-600" aria-hidden /> : <UploadCloud className="size-8 text-brand-500" aria-hidden />}
                      <p className="mt-3 font-semibold text-navy-900">{file ? file.name : "Photo ou scan du bordereau"}</p>
                      <p className="mt-1 text-sm text-muted">{file ? "Cliquez pour changer de fichier" : "JPG, PNG ou PDF · 10 Mo maximum · montant, date et référence lisibles"}</p>
                    </label>
                    <input id="bordereau" type="file" accept="image/*,application/pdf" className="sr-only" onChange={(e) => { setFile(e.target.files?.[0] ?? null); setError(""); }} />
                    {error && <p className="mt-2 text-sm text-rose-600" role="alert">{error}</p>}
                  </div>
                  {progress !== null && <Progress value={progress} label="Envoi du bordereau" />}
                  <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button variant="outline" onClick={() => setMethod(null)}>Annuler</Button>
                    <Button onClick={send} loading={progress !== null}>Envoyer le bordereau</Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Card className="flex items-center gap-4 p-5">
            <CircleCheck className="size-8 text-emerald-500" aria-hidden />
            <div>
              <p className="font-semibold text-navy-900">Aucun paiement en attente</p>
              <p className="text-sm text-muted">Vous êtes à jour de vos règlements.</p>
            </div>
          </Card>
        )}

        <Card>
          <CardHeader title="Historique" />
          <ul className="divide-y divide-line">
            {payments.map((p) => (
              <li key={p.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy-900">{p.label}</p>
                  <p className="text-sm text-muted">{p.method ? `${p.method} · ${p.date}` : `Référence ${p.reference}`}</p>
                </div>
                <p className="font-semibold text-navy-900">{formatFCFA(p.amount)}</p>
                <Badge tone={tone[p.status]} dot>{paymentStatusLabel[p.status]}</Badge>
                {p.receipt ? (
                  <Button size="sm" variant="ghost" onClick={() => toast({ title: "Téléchargement du reçu", description: `${p.receipt}.pdf`, tone: "info" })}>
                    <Download className="size-4" aria-hidden /> Reçu
                  </Button>
                ) : p.status === "en_attente" ? (
                  <span className="flex items-center gap-1 text-xs text-amber-700"><Clock3 className="size-3.5" aria-hidden /> Vérification sous 48 h</span>
                ) : null}
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <aside>
        <Card className="p-5">
          <p className="font-semibold text-navy-900">Bon à savoir</p>
          <ul className="mt-3 space-y-3 text-sm text-muted">
            <li>Le dépôt bancaire est validé manuellement par notre service comptable, sous 48 heures ouvrées.</li>
            <li>Indiquez toujours la référence : elle permet de rattacher votre paiement à votre dossier.</li>
            <li>Un reçu officiel est généré automatiquement dès la validation.</li>
          </ul>
        </Card>
      </aside>
    </div>
  );
}
