"use client";

import * as React from "react";
import { Check, MapPin, Plus, Video, X } from "lucide-react";
import { Avatar, Badge, Button, Card, CardHeader, Dialog, Field, Input, Select, cn, useToast } from "@campus-one/ui";
import { appointmentRequests, weekAgenda } from "@campus-one/mocks";
import { PageHeader } from "@/components/shell";

export default function AppointmentsPage() {
  const toast = useToast();
  const [requests, setRequests] = React.useState(appointmentRequests);
  const [agenda, setAgenda] = React.useState(weekAgenda);
  const [validating, setValidating] = React.useState<(typeof appointmentRequests)[number] | null>(null);
  const [mode, setMode] = React.useState("meet");
  const [slotDialog, setSlotDialog] = React.useState(false);

  return (
    <>
      <PageHeader title="Rendez-vous" description="Semaine du 22 au 26 septembre 2026" actions={<Button size="sm" onClick={() => setSlotDialog(true)}><Plus className="size-4" aria-hidden /> Ouvrir des créneaux</Button>} />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="overflow-x-auto">
          <div className="grid min-w-[720px] grid-cols-5 divide-x divide-line">
            {agenda.map((d) => (
              <div key={d.day} className="min-h-80">
                <p className="border-b border-line bg-surface/60 px-3 py-2.5 text-sm font-semibold text-navy-900">{d.day}</p>
                <ul className="space-y-2 p-2">
                  {d.items.length === 0 && <li className="px-1 py-6 text-center text-xs text-slate-400">Aucun rendez-vous</li>}
                  {d.items.map((it) => (
                    <li key={it.time + it.who} className={cn("rounded-xl border-l-4 p-2.5 text-xs", it.pending ? "border-amber-400 bg-amber-50" : "border-brand-500 bg-brand-50")}>
                      <p className="font-semibold text-navy-900">{it.time} · {it.who}</p>
                      <p className="text-muted">{it.what}</p>
                      <p className="mt-1 flex items-center gap-1 text-navy-700">{it.mode === "Meet" ? <Video className="size-3" aria-hidden /> : <MapPin className="size-3" aria-hidden />}{it.mode}{it.pending && <span className="ml-auto text-amber-800">À confirmer</span>}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Demandes à traiter" description={`${requests.length} en attente`} />
          <ul className="divide-y divide-line">
            {requests.length === 0 && <li className="p-6 text-center text-sm text-muted">Toutes les demandes ont été traitées.</li>}
            {requests.map((r) => (
              <li key={r.id} className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar name={r.candidate} size="sm" />
                  <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-navy-900">{r.candidate}</p><p className="text-xs text-muted">{r.subject}</p></div>
                </div>
                <p className="mt-2 text-sm text-navy-800">{r.slot} · <span className="text-muted">{r.agent}</span></p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => { setRequests((l) => l.filter((x) => x.id !== r.id)); toast({ title: "Demande refusée", description: "Le candidat est invité à choisir un autre créneau." }); }}><X className="size-4" aria-hidden /> Refuser</Button>
                  <Button size="sm" className="flex-1" onClick={() => setValidating(r)}><Check className="size-4" aria-hidden /> Valider</Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Dialog
        open={!!validating}
        onClose={() => setValidating(null)}
        size="sm"
        title="Valider le rendez-vous"
        description={validating ? `${validating.candidate} · ${validating.slot}` : ""}
        footer={<><Button variant="outline" onClick={() => setValidating(null)}>Annuler</Button><Button onClick={() => {
          setRequests((l) => l.filter((x) => x.id !== validating!.id));
          setAgenda((a) => a.map((d) => ({ ...d, items: d.items.map((it) => (it.who === validating!.candidate ? { ...it, pending: false, mode: mode === "agence" ? "Agence" : "Meet" } : it)) })));
          toast({ title: "Rendez-vous confirmé", description: "Confirmation et modalités envoyées par email." });
          setValidating(null);
        }}>Confirmer</Button></>}
      >
        <fieldset>
          <legend className="text-sm font-medium text-navy-900">Modalité</legend>
          <div className="mt-2 grid gap-2">
            {[["meet", "Lien Google Meet envoyé par email", Video], ["agence", "Rendez-vous physique en agence", MapPin]].map(([v, l, Icon]) => {
              const I = Icon as typeof Video;
              return (
                <label key={v as string} className={cn("flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm", mode === v ? "border-brand-400 bg-brand-50" : "border-line")}>
                  <input type="radio" name="mode" checked={mode === v} onChange={() => setMode(v as string)} className="accent-brand-500" />
                  <I className="size-4 text-navy-500" aria-hidden /> {l as string}
                </label>
              );
            })}
            <label className="flex items-center gap-3 rounded-xl border border-dashed border-line p-3 text-sm text-muted"><input type="radio" disabled /> Visioconférence intégrée <Badge>Bientôt</Badge></label>
          </div>
        </fieldset>
      </Dialog>

      <Dialog open={slotDialog} onClose={() => setSlotDialog(false)} title="Ouvrir des créneaux" description="Les candidats pourront réserver ces créneaux depuis leur espace."
        footer={<><Button variant="outline" onClick={() => setSlotDialog(false)}>Annuler</Button><Button onClick={() => { setSlotDialog(false); toast({ title: "Créneaux ouverts", description: "6 créneaux de 45 minutes publiés." }); }}>Publier</Button></>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date" htmlFor="s-date"><Input id="s-date" type="date" defaultValue="2026-09-29" /></Field>
          <Field label="Durée" htmlFor="s-dur"><Select id="s-dur"><option>30 minutes</option><option>45 minutes</option><option>1 heure</option></Select></Field>
          <Field label="De" htmlFor="s-from"><Input id="s-from" type="time" defaultValue="09:00" /></Field>
          <Field label="À" htmlFor="s-to"><Input id="s-to" type="time" defaultValue="13:30" /></Field>
        </div>
      </Dialog>
    </>
  );
}
