"use client";

import * as React from "react";
import { Lock, Plus, ShieldCheck, UserPlus } from "lucide-react";
import { Avatar, Badge, Button, Card, CardHeader, Dialog, Field, Input, Select, Tabs, Textarea, cn, useToast } from "@/components/ui";
import { agents, permissionGroups, roles } from "@/lib/mocks";
import { Forbidden, PageHeader } from "@/components/admin/shell";
import { useRole } from "@/lib/admin/permissions";

type Role = { id: string; name: string; system: boolean; users: number; description: string; permissions: string[] };

export default function RolesPage() {
  const toast = useToast();
  const { can } = useRole();
  const [tab, setTab] = React.useState("roles");
  const [list, setList] = React.useState<Role[]>(roles);
  const [activeId, setActiveId] = React.useState("gestionnaire");
  const [creating, setCreating] = React.useState(false);
  const [inviting, setInviting] = React.useState(false);
  if (!can("config.roles")) return <Forbidden />;
  const active = list.find((r) => r.id === activeId)!;
  const locked = active.id === "admin";

  const toggle = (perm: string) =>
    setList((l) => l.map((r) => (r.id === activeId ? { ...r, permissions: r.permissions.includes(perm) ? r.permissions.filter((p) => p !== perm) : [...r.permissions, perm] } : r)));

  return (
    <>
      <PageHeader title="Utilisateurs et rôles" description="Créez des profils sur mesure sans intervention technique. L'interface masque automatiquement les actions non autorisées." />
      <Tabs className="mb-6" value={tab} onChange={setTab} items={[{ id: "roles", label: "Rôles et permissions", count: list.length }, { id: "users", label: "Utilisateurs", count: agents.length }]} />

      {tab === "roles" ? (
        <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
          <div className="space-y-2">
            {list.map((r) => (
              <button key={r.id} onClick={() => setActiveId(r.id)} aria-current={r.id === activeId} className={cn("w-full rounded-2xl border p-4 text-left transition-all", r.id === activeId ? "border-brand-400 bg-white shadow-soft ring-4 ring-brand-50" : "border-line bg-white/60 hover:bg-white")}>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-navy-900">{r.name}</p>
                  {r.system && <Badge tone="navy">Prédéfini</Badge>}
                </div>
                <p className="mt-1 text-xs text-muted">{r.description}</p>
                <p className="mt-2 text-xs text-muted">{r.users} utilisateur{r.users > 1 ? "s" : ""} · {r.permissions.length} permissions</p>
              </button>
            ))}
            <Button variant="outline" className="w-full" onClick={() => setCreating(true)}><Plus className="size-4" aria-hidden /> Créer un rôle</Button>
          </div>
          <Card>
            <CardHeader
              title={`Permissions : ${active.name}`}
              description={locked ? "Le rôle Administrateur dispose de toutes les permissions et ne peut pas être modifié." : "Les changements s'appliquent immédiatement aux utilisateurs de ce rôle."}
              action={!locked && <Button size="sm" onClick={() => toast({ title: "Rôle enregistré", description: "Modification tracée dans le journal d'audit." })}>Enregistrer</Button>}
            />
            <div className="divide-y divide-line">
              {permissionGroups.map((g) => (
                <fieldset key={g.group} className="p-5">
                  <legend className="sr-only">{g.group}</legend>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">{g.group}</p>
                  <div className="grid gap-2 md:grid-cols-2">
                    {g.items.map((p) => {
                      const on = active.permissions.includes(p.id);
                      return (
                        <label key={p.id} className={cn("flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm", on ? "border-brand-200 bg-brand-50/40" : "border-line", locked ? "cursor-not-allowed" : "cursor-pointer")}>
                          <span className="text-navy-900">{p.label}</span>
                          <span className="relative inline-flex">
                            <input type="checkbox" role="switch" checked={on} disabled={locked} onChange={() => toggle(p.id)} className="peer sr-only" />
                            <span className="h-5 w-9 rounded-full bg-slate-200 transition-colors peer-checked:bg-brand-500 peer-focus-visible:ring-4 peer-focus-visible:ring-brand-100 peer-disabled:opacity-60" aria-hidden />
                            <span className="absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" aria-hidden />
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
            {locked && <p className="flex items-center gap-2 border-t border-line px-5 py-3 text-sm text-muted"><Lock className="size-4" aria-hidden /> Rôle système verrouillé.</p>}
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader title="Collaborateurs" description="MFA (application d'authentification) obligatoire pour tous les comptes internes." action={<Button size="sm" onClick={() => setInviting(true)}><UserPlus className="size-4" aria-hidden /> Inviter</Button>} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="border-b border-line bg-surface/60 text-left text-xs text-muted"><tr>{["Utilisateur", "Rôle", "Dossiers affectés", "MFA", "Statut"].map((h) => <th key={h} className="px-4 py-2.5 font-semibold">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-line">
                {agents.map((a) => (
                  <tr key={a.id}>
                    <td className="px-4 py-3"><div className="flex items-center gap-2.5"><Avatar name={a.name} size="sm" /><div><p className="font-medium text-navy-900">{a.name}</p><p className="text-xs text-muted">{a.email}</p></div></div></td>
                    <td className="px-4 py-3"><Select aria-label={`Rôle de ${a.name}`} defaultValue={a.role} className="h-9 w-48 text-sm"><option>{a.role}</option>{list.filter((r) => r.name !== a.role).map((r) => <option key={r.id}>{r.name}</option>)}</Select></td>
                    <td className="px-4 py-3 tabular-nums">{a.load || "—"}</td>
                    <td className="px-4 py-3"><Badge tone="success"><ShieldCheck className="size-3" aria-hidden /> Activée</Badge></td>
                    <td className="px-4 py-3">{a.active ? <Badge tone="success" dot>Actif</Badge> : <Badge dot>Désactivé</Badge>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Dialog open={creating} onClose={() => setCreating(false)} title="Créer un rôle" description="Partez d'un rôle existant puis ajustez ses permissions."
        footer={<><Button variant="outline" onClick={() => setCreating(false)}>Annuler</Button><Button onClick={() => {
          const name = (document.getElementById("r-name") as HTMLInputElement).value.trim();
          const base = (document.getElementById("r-base") as HTMLSelectElement).value;
          if (!name) return;
          const id = `r${Date.now()}`;
          setList((l) => [...l, { id, name, system: false, users: 0, description: (document.getElementById("r-desc") as HTMLTextAreaElement).value || "Profil personnalisé.", permissions: [...(l.find((r) => r.id === base)?.permissions ?? [])] }]);
          setActiveId(id);
          setCreating(false);
          toast({ title: `Rôle « ${name} » créé` });
        }}>Créer</Button></>}>
        <div className="grid gap-4">
          <Field label="Nom du rôle" htmlFor="r-name" required><Input id="r-name" placeholder="Ex. Responsable admissions" /></Field>
          <Field label="Description" htmlFor="r-desc" optional><Textarea id="r-desc" className="min-h-20" /></Field>
          <Field label="Copier les permissions de" htmlFor="r-base"><Select id="r-base" defaultValue="gestionnaire">{list.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</Select></Field>
        </div>
      </Dialog>
      <Dialog open={inviting} onClose={() => setInviting(false)} size="sm" title="Inviter un collaborateur"
        footer={<><Button variant="outline" onClick={() => setInviting(false)}>Annuler</Button><Button onClick={() => { setInviting(false); toast({ title: "Invitation envoyée", description: "Le collaborateur devra configurer la MFA à sa première connexion." }); }}>Envoyer l'invitation</Button></>}>
        <div className="grid gap-4">
          <Field label="Email professionnel" htmlFor="i-email"><Input id="i-email" type="email" /></Field>
          <Field label="Rôle" htmlFor="i-role"><Select id="i-role">{list.map((r) => <option key={r.id}>{r.name}</option>)}</Select></Field>
        </div>
      </Dialog>
    </>
  );
}
