"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, CircleCheck, CornerDownRight, MessageSquareReply } from "lucide-react";
import { Avatar, Badge, Button, Card, Tabs, Textarea, buttonClasses, cn, useToast } from "@campus-one/ui";
import { me, myRemarks } from "@campus-one/mocks";

export function Remarks() {
  const toast = useToast();
  const [items, setItems] = React.useState(myRemarks);
  const [tab, setTab] = React.useState("open");
  const [replying, setReplying] = React.useState<string | null>(null);
  const [text, setText] = React.useState("");
  const open = items.filter((r) => !r.resolved);
  const list = tab === "open" ? open : items.filter((r) => r.resolved);

  return (
    <div className="max-w-3xl">
      <Tabs value={tab} onChange={setTab} items={[{ id: "open", label: "À traiter", count: open.length }, { id: "done", label: "Résolues", count: items.length - open.length }]} />
      <ul className="mt-6 space-y-4">
        {list.length === 0 && (
          <li className="rounded-2xl border border-dashed border-line p-10 text-center">
            <CircleCheck className="mx-auto size-10 text-emerald-500" aria-hidden />
            <p className="mt-3 font-semibold text-navy-900">Aucune remarque en attente</p>
            <p className="text-sm text-muted">Votre conseillère vous préviendra par email en cas de nouvelle demande.</p>
          </li>
        )}
        {list.map((r) => (
          <li key={r.id} className="animate-fade-up">
            <Card className={cn("overflow-hidden", !r.resolved && "border-l-4 border-l-amber-400")}>
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <Avatar name={r.author} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-navy-900">{r.title}</p>
                      {r.resolved ? <Badge tone="success">Résolue</Badge> : <Badge tone="warning" dot>Action attendue</Badge>}
                    </div>
                    <p className="text-xs text-muted">{r.author} · {r.date}</p>
                    <p className="mt-3 text-navy-800">{r.body}</p>
                  </div>
                </div>
                {r.replies.map((rep) => (
                  <div key={rep.date} className="mt-4 ml-12 flex gap-2 rounded-xl bg-surface p-3">
                    <CornerDownRight className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden />
                    <div>
                      <p className="text-sm text-navy-800">{rep.body}</p>
                      <p className="mt-1 text-xs text-muted">Vous · {rep.date}</p>
                    </div>
                  </div>
                ))}
                {replying === r.id && (
                  <div className="mt-4 ml-12 space-y-2">
                    <label htmlFor={`reply-${r.id}`} className="sr-only">Votre réponse</label>
                    <Textarea id={`reply-${r.id}`} autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder="Expliquez ce que vous avez fait ou posez une question…" className="min-h-20" />
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setReplying(null)}>Annuler</Button>
                      <Button
                        size="sm"
                        disabled={!text.trim()}
                        onClick={() => {
                          setItems((l) => l.map((x) => (x.id === r.id ? { ...x, replies: [...x.replies, { author: me.firstName, body: text, date: "18 sept. 2026" }] } : x)));
                          setText("");
                          setReplying(null);
                          toast({ title: "Réponse envoyée", description: "Votre conseillère a été notifiée." });
                        }}
                      >
                        Envoyer
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              {!r.resolved && (
                <div className="flex flex-col gap-2 border-t border-line bg-surface/60 px-5 py-3 sm:flex-row sm:items-center sm:justify-end">
                  <Button size="sm" variant="ghost" onClick={() => { setReplying(r.id); setText(""); }}>
                    <MessageSquareReply className="size-4" aria-hidden /> Répondre
                  </Button>
                  <Link href={r.action.href} className={buttonClasses({ size: "sm" })}>
                    {r.action.label} <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              )}
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
