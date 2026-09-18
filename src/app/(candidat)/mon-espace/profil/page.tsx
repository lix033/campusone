"use client";

import * as React from "react";
import { KeyRound, ShieldCheck, Trash2 } from "lucide-react";
import { Avatar, Button, Card, CardHeader, Checkbox, Field, Input, Select, useToast } from "@/components/ui";
import { me } from "@/lib/mocks";
import { PageTitle } from "@/components/espace/shell";

export default function ProfilePage() {
  const toast = useToast();
  const [saving, setSaving] = React.useState(false);
  return (
    <>
      <PageTitle title="Mon profil" description="Vos informations personnelles et vos préférences de sécurité." />
      <div className="grid max-w-5xl gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader title="Informations personnelles" />
          <form
            className="grid gap-5 p-5 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              setSaving(true);
              setTimeout(() => { setSaving(false); toast({ title: "Profil mis à jour" }); }, 700);
            }}
          >
            <div className="flex items-center gap-4 sm:col-span-2">
              <Avatar name={`${me.firstName} ${me.lastName}`} size="lg" />
              <div>
                <p className="font-semibold text-navy-900">{me.firstName} {me.lastName}</p>
                <p className="text-sm text-muted">Compte vérifié · code partenaire {me.partnerCode}</p>
              </div>
            </div>
            <Field label="Prénom" htmlFor="fn"><Input id="fn" defaultValue={me.firstName} autoComplete="given-name" /></Field>
            <Field label="Nom" htmlFor="ln"><Input id="ln" defaultValue={me.lastName} autoComplete="family-name" /></Field>
            <Field label="Date de naissance" htmlFor="bd"><Input id="bd" type="date" defaultValue={me.birthDate} /></Field>
            <Field label="Nationalité" htmlFor="nat"><Input id="nat" defaultValue={me.nationality} /></Field>
            <Field label="Pays de résidence" htmlFor="country">
              <Select id="country" defaultValue={me.country}>
                {["Togo", "Bénin", "Côte d'Ivoire", "Sénégal", "Cameroun", "Mali", "Burkina Faso", "Gabon"].map((c) => <option key={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Ville" htmlFor="city"><Input id="city" defaultValue={me.city} /></Field>
            <Field label="Email" htmlFor="em" hint="Utilisé pour la connexion et les notifications."><Input id="em" type="email" defaultValue={me.email} /></Field>
            <Field label="Téléphone / WhatsApp" htmlFor="ph"><Input id="ph" type="tel" defaultValue={me.phone} /></Field>
            <div className="flex justify-end sm:col-span-2"><Button type="submit" loading={saving}>Enregistrer les modifications</Button></div>
          </form>
        </Card>
        <div className="space-y-6">
          <Card className="p-5">
            <p className="flex items-center gap-2 font-semibold text-navy-900"><ShieldCheck className="size-4.5 text-emerald-600" aria-hidden /> Sécurité</p>
            <p className="mt-2 text-sm text-muted">Double authentification par email activée à chaque connexion.</p>
            <Button variant="outline" size="sm" className="mt-4 w-full"><KeyRound className="size-4" aria-hidden /> Changer mon mot de passe</Button>
          </Card>
          <Card className="space-y-3 p-5">
            <p className="font-semibold text-navy-900">Notifications par email</p>
            <Checkbox id="n1" defaultChecked label="Changement d'étape du dossier" />
            <Checkbox id="n2" defaultChecked label="Nouveau message ou remarque" />
            <Checkbox id="n3" defaultChecked label="Rappels de rendez-vous" />
            <Checkbox id="n4" label="Conseils et actualités" />
          </Card>
          <Card className="p-5">
            <p className="font-semibold text-navy-900">Mes données</p>
            <p className="mt-1 text-sm text-muted">Vous pouvez demander l'export ou la suppression de vos données personnelles.</p>
            <div className="mt-4 grid gap-2">
              <Button variant="outline" size="sm" onClick={() => toast({ title: "Demande enregistrée", description: "Vous recevrez l'export par email sous 30 jours.", tone: "info" })}>Exporter mes données</Button>
              <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50"><Trash2 className="size-4" aria-hidden /> Demander la suppression</Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
