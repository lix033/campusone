"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Bell, BellOff, Copy, Eye, EyeOff, FileText, GripVertical, Plus, Save, Trash2, Undo2, Workflow } from "lucide-react";
import { Badge, Button, Card, CardHeader, Dialog, Field, Input, Timeline, cn, useToast } from "@campus-one/ui";
import { documentTypes, workflows } from "@campus-one/mocks";
import { Forbidden, PageHeader } from "./shell";
import { useRole } from "@/lib/permissions";

type Step = (typeof workflows)[number]["steps"][number];
type WF = { id: string; name: string; appliesTo: string[]; formations: number; steps: Step[] };

export function WorkflowEditor() {
  const toast = useToast();
  const { can } = useRole();
  const [all, setAll] = React.useState<WF[]>(workflows);
  const [activeId, setActiveId] = React.useState(workflows[0]!.id);
  const saved = all.find((w) => w.id === activeId)!;
  const [steps, setSteps] = React.useState<Step[]>(saved.steps);
  const [drag, setDrag] = React.useState<number | null>(null);
  const [over, setOver] = React.useState<number | null>(null);
  const [removing, setRemoving] = React.useState<Step | null>(null);
  const [docPicker, setDocPicker] = React.useState<Step | null>(null);
  const [focusId, setFocusId] = React.useState<string | null>(null);
  const [live, setLive] = React.useState("");
  const [pending, setPending] = React.useState<string | null>(null);

  React.useEffect(() => setSteps(all.find((w) => w.id === activeId)!.steps), [activeId, all]);
  React.useEffect(() => {
    if (focusId) document.getElementById(`step-${focusId}`)?.focus();
  }, [focusId]);

  const dirty = JSON.stringify(steps) !== JSON.stringify(saved.steps);

  if (!can("config.workflows")) return <Forbidden />;

  const update = (id: string, p: Partial<Step>) => setSteps((l) => l.map((s) => (s.id === id ? { ...s, ...p } : s)));
  const move = (from: number, to: number) => {
    if (to < 0 || to >= steps.length || from === to) return;
    setSteps((l) => {
      const c = [...l];
      const [x] = c.splice(from, 1);
      c.splice(to, 0, x!);
      return c;
    });
    setLive(`« ${steps[from]!.label} » déplacée en position ${to + 1}.`);
  };

  function switchTo(id: string) {
    if (id === activeId) return;
    if (dirty) return setPending(id);
    setActiveId(id);
  }

  return (
    <>
      <PageHeader
        title="Parcours d'étapes"
        description="Définissez, pour chaque filière, les étapes que suivra le dossier. Les changements s'appliquent aux nouveaux dossiers ; les dossiers en cours conservent leur étape actuelle."
      />
      <p className="sr-only" aria-live="polite">{live}</p>

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <div className="space-y-3">
          {all.map((w) => (
            <button
              key={w.id}
              onClick={() => switchTo(w.id)}
              aria-current={w.id === activeId}
              className={cn("w-full rounded-2xl border p-4 text-left transition-all", w.id === activeId ? "border-brand-400 bg-white shadow-soft ring-4 ring-brand-50" : "border-line bg-white/60 hover:bg-white")}
            >
              <div className="flex items-start gap-3">
                <Workflow className={cn("mt-0.5 size-5 shrink-0", w.id === activeId ? "text-brand-500" : "text-navy-300")} aria-hidden />
                <div>
                  <p className="font-semibold text-navy-900">{w.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{w.steps.length} étapes · {w.formations} formations</p>
                  <div className="mt-2 flex flex-wrap gap-1">{w.appliesTo.map((a) => <Badge key={a} tone="navy">{a}</Badge>)}</div>
                </div>
              </div>
            </button>
          ))}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              const id = `w${Date.now()}`;
              setAll((l) => [...l, { id, name: `${saved.name} (copie)`, appliesTo: [], formations: 0, steps: saved.steps.map((s) => ({ ...s, id: `${s.id}-${id}` })) }]);
              setActiveId(id);
              toast({ title: "Parcours dupliqué", description: "Renommez-le puis associez-le à des formations." });
            }}
          >
            <Copy className="size-4" aria-hidden /> Dupliquer ce parcours
          </Button>
        </div>

        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader
              title={saved.name}
              description="Glissez les étapes pour les réordonner, ou utilisez les flèches. Cliquez sur un intitulé pour le modifier."
              action={
                <div className="flex gap-2">
                  {dirty && <Button size="sm" variant="ghost" onClick={() => setSteps(saved.steps)}><Undo2 className="size-4" aria-hidden /> Annuler</Button>}
                  <Button
                    size="sm"
                    disabled={!dirty || steps.some((s) => !s.label.trim())}
                    onClick={() => {
                      setAll((l) => l.map((w) => (w.id === activeId ? { ...w, steps } : w)));
                      toast({ title: "Parcours enregistré", description: "Modification tracée dans le journal d'audit." });
                    }}
                  >
                    <Save className="size-4" aria-hidden /> Enregistrer
                  </Button>
                </div>
              }
            />
            {dirty && <p className="border-b border-line bg-amber-50 px-5 py-2 text-sm text-amber-900">Modifications non enregistrées.</p>}
            <ol className="space-y-2 p-4">
              {steps.map((s, i) => (
                <li
                  key={s.id}
                  draggable
                  onDragStart={() => setDrag(i)}
                  onDragOver={(e) => { e.preventDefault(); setOver(i); }}
                  onDragEnd={() => { setDrag(null); setOver(null); }}
                  onDrop={() => { if (drag !== null) move(drag, i); setDrag(null); setOver(null); }}
                  className={cn(
                    "group flex flex-col gap-3 rounded-xl border bg-white p-3 transition-all sm:flex-row sm:items-center",
                    drag === i ? "opacity-40" : "border-line",
                    over === i && drag !== null && drag !== i && "border-brand-400 ring-4 ring-brand-50",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="size-4 cursor-grab text-slate-300 group-hover:text-slate-500" aria-hidden />
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white">{i + 1}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <label htmlFor={`step-${s.id}`} className="sr-only">Intitulé de l'étape {i + 1}</label>
                    <input
                      id={`step-${s.id}`}
                      value={s.label}
                      onChange={(e) => update(s.id, { label: e.target.value })}
                      placeholder="Intitulé de l'étape"
                      className={cn("w-full rounded-lg border border-transparent px-2 py-1 font-semibold text-navy-900 hover:border-line focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100", !s.label.trim() && "border-rose-300")}
                    />
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 px-2">
                      {s.docs.map((d) => <span key={d} className="inline-flex items-center gap-1 rounded-md bg-navy-50 px-1.5 py-0.5 text-[11px] font-medium text-navy-700"><FileText className="size-3" aria-hidden />{d}</span>)}
                      <button onClick={() => setDocPicker(s)} className="rounded-md px-1.5 py-0.5 text-[11px] font-medium text-brand-600 hover:bg-brand-50">
                        {s.docs.length ? "Modifier les pièces" : "+ Pièces requises"}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => update(s.id, { visible: !s.visible })}
                      aria-pressed={s.visible}
                      title={s.visible ? "Visible par le candidat" : "Étape interne, masquée au candidat"}
                      className={cn("flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium", s.visible ? "text-navy-700 hover:bg-navy-50" : "bg-slate-100 text-slate-500")}
                    >
                      {s.visible ? <Eye className="size-4" aria-hidden /> : <EyeOff className="size-4" aria-hidden />}
                      <span className="hidden md:inline">{s.visible ? "Visible" : "Interne"}</span>
                    </button>
                    <button
                      onClick={() => update(s.id, { notify: !s.notify })}
                      aria-pressed={s.notify}
                      title={s.notify ? "Email envoyé au candidat à l'entrée dans l'étape" : "Aucun email"}
                      className={cn("flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium", s.notify ? "text-brand-700 hover:bg-brand-50" : "text-slate-500 hover:bg-slate-100")}
                    >
                      {s.notify ? <Bell className="size-4" aria-hidden /> : <BellOff className="size-4" aria-hidden />}
                      <span className="hidden md:inline">{s.notify ? "Email" : "Sans email"}</span>
                    </button>
                    <span className="mx-1 h-5 w-px bg-line" aria-hidden />
                    <button onClick={() => move(i, i - 1)} disabled={i === 0} className="rounded-lg p-1.5 text-navy-500 hover:bg-navy-50 disabled:opacity-30" aria-label={`Monter ${s.label}`}><ArrowUp className="size-4" /></button>
                    <button onClick={() => move(i, i + 1)} disabled={i === steps.length - 1} className="rounded-lg p-1.5 text-navy-500 hover:bg-navy-50 disabled:opacity-30" aria-label={`Descendre ${s.label}`}><ArrowDown className="size-4" /></button>
                    <button onClick={() => setRemoving(s)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label={`Supprimer ${s.label}`}><Trash2 className="size-4" /></button>
                  </div>
                </li>
              ))}
            </ol>
            <div className="border-t border-line p-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const id = `new-${Date.now()}`;
                  setSteps((l) => [...l, { id, label: "", visible: true, notify: true, docs: [] }]);
                  setFocusId(id);
                }}
              >
                <Plus className="size-4" aria-hidden /> Ajouter une étape
              </Button>
            </div>
          </Card>

          <Card>
            <CardHeader title="Aperçu côté candidat" description="Ce que verra le candidat dans son espace (étapes visibles uniquement)." />
            <div className="overflow-x-auto p-6">
              <Timeline
                className="mx-auto"
                steps={steps.filter((s) => s.visible).map((s, i) => ({ label: s.label || "Sans titre", status: i < 2 ? "done" : i === 2 ? "current" : "upcoming" }))}
              />
            </div>
          </Card>
        </div>
      </div>

      <Dialog
        open={!!pending}
        onClose={() => setPending(null)}
        size="sm"
        title="Quitter sans enregistrer ?"
        description="Les modifications apportées à ce parcours seront perdues."
        footer={<><Button variant="outline" onClick={() => setPending(null)}>Rester</Button><Button variant="danger" onClick={() => { setActiveId(pending!); setPending(null); }}>Abandonner les modifications</Button></>}
      />

      <Dialog
        open={!!removing}
        onClose={() => setRemoving(null)}
        size="sm"
        title={`Supprimer l'étape « ${removing?.label || "Sans titre"} » ?`}
        description="Les dossiers actuellement à cette étape seront à replacer manuellement. Vous pouvez encore annuler avant d'enregistrer."
        footer={<><Button variant="outline" onClick={() => setRemoving(null)}>Annuler</Button><Button variant="danger" onClick={() => { setSteps((l) => l.filter((x) => x.id !== removing!.id)); setRemoving(null); }}>Supprimer</Button></>}
      />

      <Dialog
        open={!!docPicker}
        onClose={() => setDocPicker(null)}
        title={`Pièces requises : ${docPicker?.label ?? ""}`}
        description="Ces pièces seront ajoutées à la checklist du candidat à l'entrée dans l'étape."
        footer={<Button onClick={() => setDocPicker(null)}>Terminer</Button>}
      >
        <ul className="space-y-2">
          {documentTypes.map((t) => {
            const current = steps.find((s) => s.id === docPicker?.id);
            const on = current?.docs.includes(t.name) ?? false;
            return (
              <li key={t.id}>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line p-3 hover:bg-surface">
                  <input type="checkbox" checked={on} onChange={() => current && update(current.id, { docs: on ? current.docs.filter((d) => d !== t.name) : [...current.docs, t.name] })} className="size-4 accent-brand-500" />
                  <span className="flex-1 text-sm text-navy-900">{t.name}</span>
                  {t.required && <Badge tone="navy">Obligatoire</Badge>}
                </label>
              </li>
            );
          })}
        </ul>
        <div className="mt-4"><Field label="Ou créer un nouveau type" htmlFor="new-type" hint="Disponible ensuite dans « Types de documents »."><Input id="new-type" placeholder="Ex. Attestation de bourse" /></Field></div>
      </Dialog>
    </>
  );
}
