"use client";

import * as React from "react";
import { CalendarCheck, CalendarDays, Clock, MapPin, Video } from "lucide-react";
import { Badge, Button, Card, CardHeader, Dialog, Field, Select, Textarea, cn, useToast } from "@campus-one/ui";
import { availableSlots, me, myAppointments } from "@campus-one/mocks";

export function Appointments() {
  const toast = useToast();
  const [items, setItems] = React.useState(myAppointments.map((a) => ({ ...a, status: a.status as "confirme" | "passe" | "en_attente" })));
  const [slot, setSlot] = React.useState<{ day: string; time: string } | null>(null);
  const [confirm, setConfirm] = React.useState(false);
  const [subject, setSubject] = React.useState("Préparation Campus France");

  const upcoming = items.filter((a) => a.status !== "passe");
  const past = items.filter((a) => a.status === "passe");

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <Card>
        <CardHeader title="Réserver un créneau" description={`Avec ${me.advisor.name} · 45 minutes`} />
        <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-5">
          {availableSlots.map((d) => (
            <div key={d.day}>
              <p className="mb-2 text-center text-sm font-semibold text-navy-900">{d.day}</p>
              <div className="space-y-2">
                {d.slots.length === 0 && <p className="rounded-lg bg-surface py-2 text-center text-xs text-slate-400">Aucun créneau</p>}
                {d.slots.map((t) => {
                  const on = slot?.day === d.day && slot.time === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setSlot({ day: d.day, time: t })}
                      aria-pressed={on}
                      className={cn("w-full rounded-xl border py-2.5 text-sm font-semibold transition-all", on ? "border-brand-500 bg-brand-500 text-white shadow-soft" : "border-line text-navy-800 hover:border-brand-300 hover:bg-brand-50")}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 border-t border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">{slot ? <>Créneau choisi : <span className="font-semibold text-navy-900">{slot.day} à {slot.time}</span></> : "Sélectionnez un créneau pour continuer."}</p>
          <Button disabled={!slot} onClick={() => setConfirm(true)}>Continuer</Button>
        </div>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader title="À venir" />
          <ul className="divide-y divide-line">
            {upcoming.map((a) => (
              <li key={a.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-navy-900">{a.title}</p>
                  {a.status === "confirme" ? <Badge tone="success" dot>Confirmé</Badge> : <Badge tone="warning" dot>En attente</Badge>}
                </div>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted"><CalendarDays className="size-4" aria-hidden /> {a.date}</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted"><Clock className="size-4" aria-hidden /> {a.time}</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted">{a.mode === "En agence" ? <MapPin className="size-4" aria-hidden /> : <Video className="size-4" aria-hidden />} {a.mode}</p>
                {a.status === "confirme" && a.mode === "Google Meet" && (
                  <Button variant="secondary" size="sm" className="mt-4 w-full"><Video className="size-4" aria-hidden /> Rejoindre la visioconférence</Button>
                )}
                {a.status === "en_attente" && <p className="mt-3 text-xs text-amber-700">Votre conseillère doit valider ce créneau. Vous recevrez la confirmation par email.</p>}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Passés" />
          <ul className="divide-y divide-line">
            {past.map((a) => (
              <li key={a.id} className="px-5 py-4 text-sm">
                <p className="font-medium text-navy-900">{a.title}</p>
                <p className="text-muted">{a.date} · {a.mode}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Dialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Confirmer la demande"
        description={slot ? `${slot.day} à ${slot.time} avec ${me.advisor.name}` : ""}
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirm(false)}>Modifier</Button>
            <Button
              onClick={() => {
                setItems((l) => [{ id: String(Date.now()), title: subject, date: slot!.day, time: slot!.time, mode: "Modalité à confirmer", status: "en_attente", with: me.advisor.name }, ...l]);
                setConfirm(false);
                setSlot(null);
                toast({ title: "Demande envoyée", description: "Vous recevrez la confirmation et les modalités par email." });
              }}
            >
              <CalendarCheck className="size-4" aria-hidden /> Envoyer la demande
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Objet du rendez-vous" htmlFor="subject">
            <Select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option>Préparation Campus France</option>
              <option>Point sur mon dossier</option>
              <option>Questions sur le visa</option>
              <option>Logement et installation</option>
            </Select>
          </Field>
          <Field label="Précisions" htmlFor="notes" optional>
            <Textarea id="notes" placeholder="Ce que vous souhaitez aborder…" className="min-h-20" />
          </Field>
          <p className="rounded-xl bg-surface p-3 text-sm text-muted">La modalité (agence ou visioconférence) est choisie par votre conseillère et indiquée dans l'email de confirmation.</p>
        </div>
      </Dialog>
    </div>
  );
}
