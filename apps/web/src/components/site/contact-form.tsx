"use client";

import * as React from "react";
import { CalendarCheck, Send, Video } from "lucide-react";
import { Button, Checkbox, Field, Input, Select, Tabs, Textarea, cn, useToast } from "@campus-one/ui";
import { availableSlots } from "@campus-one/mocks";

export function ContactForm() {
  const toast = useToast();
  const [tab, setTab] = React.useState("message");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [slot, setSlot] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (window.location.hash === "#rendez-vous") setTab("rdv");
  }, []);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const err: Record<string, string> = {};
    if (!d.name?.trim()) err.name = "Indiquez votre nom complet.";
    if (!/^\S+@\S+\.\S+$/.test(d.email ?? "")) err.email = "Saisissez une adresse email valide, par exemple nom@exemple.com.";
    if (tab === "message" && (d.message?.trim().length ?? 0) < 10) err.message = "Votre message doit contenir au moins 10 caractères.";
    if (tab === "rdv" && !slot) err.slot = "Choisissez un créneau.";
    if (!d.consent) err.consent = "Votre accord est nécessaire pour que nous puissions vous répondre.";
    setErrors(err);
    if (Object.keys(err).length) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      (e.target as HTMLFormElement).reset();
      setSlot(null);
      toast({
        title: tab === "rdv" ? "Demande de rendez-vous envoyée" : "Message envoyé",
        description: tab === "rdv" ? "Vous recevrez une confirmation par email avec le lien de visioconférence." : "Un conseiller vous répond sous 24 heures ouvrées.",
      });
    }, 900);
  }

  return (
    <div id="rendez-vous" className="scroll-mt-24 rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8">
      <Tabs
        value={tab}
        onChange={(v) => { setTab(v); setErrors({}); }}
        items={[
          { id: "message", label: "Envoyer un message", icon: <Send className="size-4" aria-hidden /> },
          { id: "rdv", label: "Prendre rendez-vous", icon: <CalendarCheck className="size-4" aria-hidden /> },
        ]}
      />
      <form onSubmit={submit} noValidate className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Nom complet" htmlFor="name" required error={errors.name}>
          <Input id="name" name="name" autoComplete="name" error={errors.name} />
        </Field>
        <Field label="Email" htmlFor="email" required error={errors.email}>
          <Input id="email" name="email" type="email" autoComplete="email" error={errors.email} />
        </Field>
        <Field label="Téléphone / WhatsApp" htmlFor="phone" optional>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+228 90 00 00 00" />
        </Field>
        <Field label="Vous êtes" htmlFor="profile">
          <Select id="profile" name="profile" defaultValue="etudiant">
            <option value="etudiant">Étudiant(e)</option>
            <option value="parent">Parent</option>
            <option value="etablissement">Établissement</option>
            <option value="partenaire">Partenaire</option>
          </Select>
        </Field>

        {tab === "message" ? (
          <Field label="Votre message" htmlFor="message" required error={errors.message} className="sm:col-span-2">
            <Textarea id="message" name="message" rows={5} placeholder="Décrivez votre projet : niveau actuel, formation souhaitée, rentrée visée…" error={errors.message} />
          </Field>
        ) : (
          <fieldset className="sm:col-span-2">
            <legend className="text-sm font-medium text-navy-900">Choisissez un créneau <span className="text-rose-500">*</span></legend>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted"><Video className="size-4" aria-hidden /> Entretien de 30 minutes en visioconférence (Google Meet)</p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {availableSlots.map((d) => (
                <div key={d.day}>
                  <p className="mb-2 text-xs font-semibold text-navy-900">{d.day}</p>
                  <div className="space-y-1.5">
                    {d.slots.length === 0 && <p className="text-xs text-slate-400">Complet</p>}
                    {d.slots.map((s) => {
                      const id = `${d.day} ${s}`;
                      return (
                        <button
                          type="button"
                          key={id}
                          onClick={() => setSlot(id)}
                          aria-pressed={slot === id}
                          className={cn(
                            "w-full rounded-lg border py-2 text-sm font-medium transition-colors",
                            slot === id ? "border-brand-500 bg-brand-500 text-white" : "border-line text-navy-800 hover:border-brand-300 hover:bg-brand-50",
                          )}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {errors.slot && <p className="mt-2 text-sm text-rose-600" role="alert">{errors.slot}</p>}
          </fieldset>
        )}

        <div className="sm:col-span-2">
          <Checkbox id="consent" name="consent" label="J'accepte que Campus One utilise ces informations pour me recontacter." description="Vos données ne sont jamais revendues. Voir notre politique de confidentialité." />
          {errors.consent && <p className="mt-2 text-sm text-rose-600" role="alert">{errors.consent}</p>}
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" size="lg" loading={loading} className="w-full sm:w-auto">
            {tab === "rdv" ? "Demander ce rendez-vous" : "Envoyer le message"}
          </Button>
        </div>
      </form>
    </div>
  );
}
