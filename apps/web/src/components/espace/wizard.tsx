"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheck,
  CloudCheck,
  FileText,
  Loader2,
  Pencil,
  TriangleAlert,
  UploadCloud,
  X,
} from "lucide-react";
import { Button, Card, Checkbox, Field, Input, Select, buttonClasses, cn, useToast } from "@campus-one/ui";
import { cities, formations, levels, me } from "@campus-one/mocks";

const steps = [
  { id: "perso", label: "Informations personnelles", short: "Identité" },
  { id: "academique", label: "Parcours académique", short: "Parcours" },
  { id: "projet", label: "Votre projet", short: "Projet" },
  { id: "documents", label: "Documents", short: "Documents" },
  { id: "validation", label: "Validation et envoi", short: "Envoi" },
];

type Data = Record<string, string>;

const required: Record<string, { key: string; label: string; test?: (v: string) => string | null }[]> = {
  perso: [
    { key: "lastName", label: "Nom" },
    { key: "firstName", label: "Prénom" },
    { key: "birthDate", label: "Date de naissance" },
    { key: "nationality", label: "Nationalité" },
    { key: "country", label: "Pays de résidence" },
    { key: "phone", label: "Téléphone", test: (v) => (v.replace(/\D/g, "").length < 8 ? "Numéro trop court : indiquez l'indicatif pays, par exemple +228 90 00 00 00." : null) },
    { key: "email", label: "Email", test: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : "Format attendu : nom@exemple.com") },
  ],
  academique: [
    { key: "lastDiploma", label: "Dernier diplôme" },
    { key: "institution", label: "Établissement" },
    { key: "year", label: "Année d'obtention", test: (v) => (/^(19|20)\d{2}$/.test(v) ? null : "Indiquez une année sur 4 chiffres, par exemple 2025.") },
    { key: "average", label: "Moyenne", test: (v) => { const n = Number(v.replace(",", ".")); return n >= 0 && n <= 20 ? null : "Indiquez une moyenne entre 0 et 20."; } },
    { key: "field", label: "Domaine" },
  ],
  projet: [
    { key: "level", label: "Niveau recherché" },
    { key: "formation", label: "Formation souhaitée" },
    { key: "city", label: "Ville" },
    { key: "intake", label: "Rentrée" },
  ],
};

const docList = [
  { key: "passport", label: "Passeport", required: true },
  { key: "cv", label: "Curriculum vitae", required: true },
  { key: "diplomas", label: "Diplômes", required: true },
  { key: "transcripts", label: "Relevés de notes", required: true },
  { key: "language", label: "Attestation de langue", required: false },
  { key: "letter", label: "Lettre de motivation", required: true },
];

const STORAGE = "co-draft-application";

export function ApplicationWizard() {
  const toast = useToast();
  const preset = useSearchParams().get("formation") ?? "";
  const [step, setStep] = React.useState(0);
  const [dir, setDir] = React.useState(1);
  const [data, setData] = React.useState<Data>({
    lastName: me.lastName,
    firstName: me.firstName,
    birthDate: me.birthDate,
    nationality: me.nationality,
    country: me.country,
    phone: me.phone,
    email: me.email,
    formation: preset,
    level: formations.find((f) => f.slug === preset)?.level ?? "",
    city: formations.find((f) => f.slug === preset)?.city ?? "",
  });
  const [docs, setDocs] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [save, setSave] = React.useState<"idle" | "saving" | "saved">("idle");
  const [consent, setConsent] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const first = React.useRef(true);

  // Brouillon local (démo) — remplacé par la sauvegarde API en production.
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw && !preset) {
        const d = JSON.parse(raw);
        setData((x) => ({ ...x, ...d.data }));
        setDocs(d.docs ?? {});
      }
    } catch {}
  }, [preset]);

  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setSave("saving");
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE, JSON.stringify({ data, docs }));
      } catch {}
      setSave("saved");
    }, 700);
    return () => clearTimeout(t);
  }, [data, docs]);

  const errorFor = (key: string): string | undefined => {
    const rule = Object.values(required).flat().find((r) => r.key === key);
    if (!rule) return;
    const v = (data[key] ?? "").trim();
    if (!v) return `${rule.label} : champ obligatoire.`;
    return rule.test?.(v) ?? undefined;
  };
  const shown = (key: string) => (touched[key] ? errorFor(key) : undefined);

  const bind = (key: string) => ({
    id: key,
    name: key,
    value: data[key] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setData((d) => ({ ...d, [key]: e.target.value })),
    onBlur: () => setTouched((t) => ({ ...t, [key]: true })),
    error: shown(key),
  });

  const stepId = steps[step]!.id;
  const stepErrors = (required[stepId] ?? []).filter((r) => errorFor(r.key));

  function next() {
    if (stepErrors.length) {
      setTouched((t) => ({ ...t, ...Object.fromEntries(stepErrors.map((r) => [r.key, true])) }));
      document.getElementById(stepErrors[0]!.key)?.focus();
      return;
    }
    setDir(1);
    setStep((s) => Math.min(steps.length - 1, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const back = () => {
    setDir(-1);
    setStep((s) => Math.max(0, s - 1));
  };
  const goTo = (i: number) => {
    setDir(i > step ? 1 : -1);
    setStep(i);
  };

  const selected = formations.find((f) => f.slug === data.formation);
  const missingDocs = docList.filter((d) => d.required && !docs[d.key]);

  if (sent)
    return (
      <div className="mx-auto max-w-xl py-10 text-center">
        <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CircleCheck className="size-10" aria-hidden />
        </motion.span>
        <h1 className="mt-6 text-3xl font-bold text-navy-900">Candidature envoyée</h1>
        <p className="mt-3 text-muted">Votre dossier <span className="font-mono font-semibold text-navy-900">CO-2027-0014</span> a été transmis à l'équipe Campus One. Un email de confirmation vient de vous être envoyé.</p>
        <Card className="mt-8 p-5 text-left">
          <p className="font-semibold text-navy-900">Et maintenant ?</p>
          <ol className="mt-3 space-y-3 text-sm text-muted">
            <li className="flex gap-3"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">1</span>Un conseiller vérifie votre dossier sous 72 heures ouvrées.</li>
            <li className="flex gap-3"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">2</span>Vous serez notifié par email si une pièce doit être corrigée.</li>
            <li className="flex gap-3"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">3</span>Suivez chaque étape en temps réel depuis votre tableau de bord.</li>
          </ol>
        </Card>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/mon-espace/candidatures" className={buttonClasses()}>Suivre ma candidature</Link>
          {missingDocs.length > 0 && <Link href="/mon-espace/documents" className={buttonClasses({ variant: "outline" })}>Compléter mes documents</Link>}
        </div>
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">Nouvelle candidature</h1>
          <p className="mt-1 text-sm text-muted">Campagne France 2027-2028</p>
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted" aria-live="polite">
          {save === "saving" ? <><Loader2 className="size-4 animate-spin" aria-hidden /> Enregistrement…</> : save === "saved" ? <><CloudCheck className="size-4 text-emerald-600" aria-hidden /> Brouillon enregistré</> : <><CloudCheck className="size-4" aria-hidden /> Sauvegarde automatique</>}
        </p>
      </div>

      {/* Stepper */}
      <nav aria-label="Étapes de la candidature" className="mb-6">
        <ol className="flex items-center">
          {steps.map((s, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <li key={s.id} className={cn("flex items-center", i < steps.length - 1 && "flex-1")}>
                <button
                  onClick={() => i < step && goTo(i)}
                  disabled={i > step}
                  aria-current={current ? "step" : undefined}
                  className="group flex items-center gap-2 disabled:cursor-default"
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all",
                      done && "bg-brand-500 text-white group-hover:bg-brand-600",
                      current && "bg-navy-900 text-white ring-4 ring-navy-100",
                      !done && !current && "border-2 border-line bg-white text-slate-400",
                    )}
                  >
                    {done ? <Check className="size-4" strokeWidth={3} aria-hidden /> : i + 1}
                  </span>
                  <span className={cn("hidden text-sm font-semibold md:block", current ? "text-navy-900" : done ? "text-navy-700" : "text-slate-400")}>{s.short}</span>
                  <span className="sr-only">{done ? "(terminée)" : current ? "(en cours)" : "(à venir)"}</span>
                </button>
                {i < steps.length - 1 && <span className={cn("mx-2 h-0.5 flex-1 rounded-full transition-colors md:mx-3", i < step ? "bg-brand-500" : "bg-line")} aria-hidden />}
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-sm text-muted md:hidden">Étape {step + 1} sur {steps.length} : <span className="font-semibold text-navy-900">{steps[step]!.label}</span></p>
      </nav>

      <Card className="overflow-hidden">
        <div className="border-b border-line px-6 py-5">
          <h2 className="text-lg font-bold text-navy-900">{steps[step]!.label}</h2>
          <p className="text-sm text-muted">Les champs marqués d'un astérisque (*) sont obligatoires.</p>
        </div>
        <div className="relative px-6 py-6">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div key={step} initial={{ opacity: 0, x: 24 * dir }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 * dir }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
              {stepId === "perso" && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Nom" htmlFor="lastName" required error={shown("lastName")}><Input {...bind("lastName")} autoComplete="family-name" /></Field>
                  <Field label="Prénom" htmlFor="firstName" required error={shown("firstName")}><Input {...bind("firstName")} autoComplete="given-name" /></Field>
                  <Field label="Date de naissance" htmlFor="birthDate" required error={shown("birthDate")}><Input {...bind("birthDate")} type="date" /></Field>
                  <Field label="Nationalité" htmlFor="nationality" required error={shown("nationality")}><Input {...bind("nationality")} /></Field>
                  <Field label="Pays de résidence" htmlFor="country" required error={shown("country")}>
                    <Select {...bind("country")}>
                      <option value="">Sélectionner</option>
                      {["Togo", "Bénin", "Côte d'Ivoire", "Sénégal", "Cameroun", "Mali", "Burkina Faso", "Gabon", "Autre"].map((c) => <option key={c}>{c}</option>)}
                    </Select>
                  </Field>
                  <Field label="Téléphone / WhatsApp" htmlFor="phone" required error={shown("phone")}><Input {...bind("phone")} type="tel" autoComplete="tel" /></Field>
                  <Field label="Email" htmlFor="email" required error={shown("email")} className="sm:col-span-2"><Input {...bind("email")} type="email" autoComplete="email" /></Field>
                </div>
              )}

              {stepId === "academique" && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Dernier diplôme obtenu" htmlFor="lastDiploma" required error={shown("lastDiploma")}>
                    <Select {...bind("lastDiploma")}>
                      <option value="">Sélectionner</option>
                      {["Baccalauréat", "BTS / DUT", "Licence", "Master 1", "Master 2"].map((c) => <option key={c}>{c}</option>)}
                    </Select>
                  </Field>
                  <Field label="Établissement" htmlFor="institution" required error={shown("institution")}><Input {...bind("institution")} placeholder="Ex. Université de Lomé" /></Field>
                  <Field label="Année d'obtention" htmlFor="year" required error={shown("year")}><Input {...bind("year")} inputMode="numeric" placeholder="2025" /></Field>
                  <Field label="Moyenne générale (sur 20)" htmlFor="average" required error={shown("average")} hint="Celle de votre dernière année."><Input {...bind("average")} inputMode="decimal" placeholder="13,5" /></Field>
                  <Field label="Domaine d'études" htmlFor="field" required error={shown("field")} className="sm:col-span-2"><Input {...bind("field")} placeholder="Ex. Gestion des entreprises" /></Field>
                </div>
              )}

              {stepId === "projet" && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Niveau recherché" htmlFor="level" required error={shown("level")}>
                    <Select {...bind("level")}>
                      <option value="">Sélectionner</option>
                      {levels.map((l) => <option key={l}>{l}</option>)}
                    </Select>
                  </Field>
                  <Field label="Rentrée" htmlFor="intake" required error={shown("intake")}>
                    <Select {...bind("intake")}>
                      <option value="">Sélectionner</option>
                      <option>Septembre 2027</option>
                      <option>Janvier 2028</option>
                    </Select>
                  </Field>
                  <Field label="Formation souhaitée" htmlFor="formation" required error={shown("formation")} className="sm:col-span-2">
                    <Select {...bind("formation")}>
                      <option value="">Sélectionner une formation</option>
                      {formations.filter((f) => !data.level || f.level === data.level).map((f) => <option key={f.slug} value={f.slug}>{f.title} — {f.city}</option>)}
                    </Select>
                  </Field>
                  {selected && (
                    <div className="flex items-center gap-4 rounded-2xl bg-surface p-4 sm:col-span-2">
                      <img src={selected.image} alt="" className="size-14 rounded-xl object-cover" />
                      <div className="text-sm">
                        <p className="font-semibold text-navy-900">{selected.title}</p>
                        <p className="text-muted">{selected.duration} · {selected.intake} · {selected.status}</p>
                      </div>
                    </div>
                  )}
                  <Field label="Ville / destination" htmlFor="city" required error={shown("city")}>
                    <Select {...bind("city")}>
                      <option value="">Sélectionner</option>
                      {cities.map((c) => <option key={c}>{c}</option>)}
                    </Select>
                  </Field>
                  <Field label="Deuxième choix de formation" htmlFor="second" optional>
                    <Select {...bind("second")}>
                      <option value="">Aucun</option>
                      {formations.filter((f) => f.slug !== data.formation).map((f) => <option key={f.slug} value={f.slug}>{f.title}</option>)}
                    </Select>
                  </Field>
                </div>
              )}

              {stepId === "documents" && (
                <div>
                  <p className="mb-4 text-sm text-muted">Format PDF uniquement, 10 Mo maximum par fichier. Vous pouvez aussi envoyer votre candidature et compléter vos documents plus tard.</p>
                  <ul className="space-y-3">
                    {docList.map((d) => (
                      <li key={d.key} className={cn("flex items-center gap-3 rounded-2xl border p-4 transition-colors", docs[d.key] ? "border-emerald-200 bg-emerald-50/40" : "border-line")}>
                        {docs[d.key] ? <CircleCheck className="size-5 shrink-0 text-emerald-600" aria-hidden /> : <FileText className="size-5 shrink-0 text-navy-300" aria-hidden />}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-navy-900">{d.label} {d.required ? <span className="text-rose-500" aria-label="obligatoire">*</span> : <span className="font-normal text-muted">(facultatif)</span>}</p>
                          {docs[d.key] && <p className="truncate text-xs text-muted">{docs[d.key]}</p>}
                        </div>
                        {docs[d.key] ? (
                          <button onClick={() => setDocs((x) => { const c = { ...x }; delete c[d.key]; return c; })} className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-rose-600" aria-label={`Retirer ${d.label}`}>
                            <X className="size-4" />
                          </button>
                        ) : (
                          <label className={buttonClasses({ variant: "outline", size: "sm", className: "cursor-pointer" })}>
                            <UploadCloud className="size-4" aria-hidden /> Ajouter
                            <input
                              type="file"
                              accept="application/pdf,.pdf"
                              className="sr-only"
                              aria-label={`Ajouter ${d.label}`}
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                if (!f.name.toLowerCase().endsWith(".pdf")) return toast({ title: "Format non accepté", description: "Seuls les fichiers PDF sont acceptés.", tone: "error" });
                                setDocs((x) => ({ ...x, [d.key]: f.name }));
                              }}
                            />
                          </label>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {stepId === "validation" && (
                <div className="space-y-4">
                  {[
                    { i: 0, title: "Identité", rows: [["Nom", `${data.firstName} ${data.lastName}`], ["Date de naissance", data.birthDate], ["Nationalité", data.nationality], ["Contact", `${data.email} · ${data.phone}`]] },
                    { i: 1, title: "Parcours", rows: [["Diplôme", `${data.lastDiploma} (${data.year})`], ["Établissement", data.institution], ["Moyenne", `${data.average}/20`], ["Domaine", data.field]] },
                    { i: 2, title: "Projet", rows: [["Formation", selected?.title ?? "—"], ["Niveau", data.level], ["Ville", data.city], ["Rentrée", data.intake]] },
                  ].map((b) => (
                    <div key={b.title} className="rounded-2xl border border-line">
                      <div className="flex items-center justify-between border-b border-line px-4 py-3">
                        <p className="text-sm font-semibold text-navy-900">{b.title}</p>
                        <button onClick={() => goTo(b.i)} className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"><Pencil className="size-3.5" aria-hidden /> Modifier</button>
                      </div>
                      <dl className="grid gap-x-6 gap-y-2 p-4 text-sm sm:grid-cols-2">
                        {b.rows.map(([k, v]) => (
                          <div key={k} className="flex justify-between gap-3 sm:block"><dt className="text-muted">{k}</dt><dd className="font-medium text-navy-900">{v || "—"}</dd></div>
                        ))}
                      </dl>
                    </div>
                  ))}
                  <div className={cn("flex gap-3 rounded-2xl p-4 text-sm", missingDocs.length ? "bg-amber-50 text-amber-900" : "bg-emerald-50 text-emerald-900")}>
                    {missingDocs.length ? <TriangleAlert className="size-5 shrink-0" aria-hidden /> : <CircleCheck className="size-5 shrink-0" aria-hidden />}
                    <p>
                      {missingDocs.length
                        ? <>Il manque {missingDocs.length} document{missingDocs.length > 1 ? "s" : ""} obligatoire{missingDocs.length > 1 ? "s" : ""} ({missingDocs.map((d) => d.label).join(", ")}). Vous pourrez les ajouter après l'envoi, mais votre dossier ne sera étudié qu'une fois complet.</>
                        : "Tous les documents obligatoires sont joints."}
                    </p>
                  </div>
                  <Checkbox id="consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} label="Je certifie l'exactitude des informations fournies et j'autorise Campus One à transmettre mon dossier aux établissements choisis." />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-line bg-surface/60 px-6 py-4">
          {step > 0 ? (
            <Button variant="ghost" onClick={back}><ArrowLeft className="size-4" aria-hidden /> Précédent</Button>
          ) : (
            <Link href="/mon-espace/candidatures" className={buttonClasses({ variant: "ghost" })}>Enregistrer et quitter</Link>
          )}
          {step < steps.length - 1 ? (
            <Button onClick={next}>Continuer <ArrowRight className="size-4" aria-hidden /></Button>
          ) : (
            <Button
              disabled={!consent}
              loading={sending}
              onClick={() => {
                setSending(true);
                setTimeout(() => {
                  try { localStorage.removeItem(STORAGE); } catch {}
                  setSent(true);
                  window.scrollTo({ top: 0 });
                }, 1100);
              }}
            >
              Envoyer ma candidature
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
