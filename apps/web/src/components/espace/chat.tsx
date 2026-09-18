"use client";

import * as React from "react";
import { FileText, Info, Paperclip, SendHorizontal, X } from "lucide-react";
import { Avatar, Button, Card, cn } from "@campus-one/ui";
import { me, myMessages } from "@campus-one/mocks";

type Msg = { id: string; from: string; body: string; time: string; attachment?: string };

export function Chat() {
  const [msgs, setMsgs] = React.useState<Msg[]>(myMessages);
  const [text, setText] = React.useState("");
  const [file, setFile] = React.useState<string | null>(null);
  const [typing, setTyping] = React.useState(false);
  const end = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => end.current?.scrollIntoView({ behavior: "smooth", block: "end" }), [msgs, typing]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() && !file) return;
    setMsgs((l) => [...l, { id: String(Date.now()), from: "me", body: text.trim(), time: "Aujourd'hui · maintenant", attachment: file ?? undefined }]);
    setText("");
    setFile(null);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((l) => [...l, { id: String(Date.now() + 1), from: "advisor", body: "Bien reçu, merci ! Je regarde cela et je reviens vers vous rapidement.", time: "Aujourd'hui · maintenant" }]);
    }, 2200);
  }

  return (
    <Card className="flex h-[calc(100dvh-8.5rem)] flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-line px-5 py-4">
        <div className="relative">
          <Avatar name={me.advisor.name} />
          <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-white" aria-hidden />
        </div>
        <div className="flex-1">
          <h1 className="font-semibold text-navy-900">{me.advisor.name}</h1>
          <p className="text-xs text-muted">{me.advisor.role} · répond généralement en quelques heures</p>
        </div>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto bg-surface/60 px-4 py-6 sm:px-6" aria-live="polite">
        <p className="mx-auto flex w-fit items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs text-muted shadow-soft">
          <Info className="size-3.5" aria-hidden /> Les pièces officielles se déposent dans « Mes documents », pas ici.
        </p>
        {msgs.map((m) => {
          const mine = m.from === "me";
          return (
            <div key={m.id} className={cn("flex animate-fade-up gap-2.5", mine && "flex-row-reverse")}>
              {!mine && <Avatar name={me.advisor.name} size="sm" className="mt-auto" />}
              <div className={cn("max-w-[80%] sm:max-w-md", mine && "text-right")}>
                <div className={cn("inline-block rounded-2xl px-4 py-2.5 text-left text-sm leading-relaxed", mine ? "rounded-br-md bg-brand-500 text-white" : "rounded-bl-md bg-white text-navy-900 shadow-soft")}>
                  {m.body}
                  {m.attachment && (
                    <span className={cn("mt-2 flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium", mine ? "bg-white/15" : "bg-navy-50 text-navy-800")}>
                      <FileText className="size-4" aria-hidden /> {m.attachment}
                    </span>
                  )}
                </div>
                <p className="mt-1 px-1 text-[11px] text-muted">{m.time}</p>
              </div>
            </div>
          );
        })}
        {typing && (
          <div className="flex items-center gap-2.5">
            <Avatar name={me.advisor.name} size="sm" />
            <span className="flex gap-1 rounded-2xl bg-white px-4 py-3 shadow-soft" aria-label={`${me.advisor.name} écrit…`}>
              {[0, 1, 2].map((i) => <span key={i} className="size-1.5 animate-bounce rounded-full bg-navy-300" style={{ animationDelay: `${i * 120}ms` }} />)}
            </span>
          </div>
        )}
        <div ref={end} />
      </div>
      <form onSubmit={send} className="border-t border-line bg-white p-3 sm:p-4">
        {file && (
          <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-navy-50 px-2.5 py-1.5 text-xs font-medium text-navy-800">
            <FileText className="size-3.5" aria-hidden /> {file}
            <button type="button" onClick={() => setFile(null)} aria-label="Retirer la pièce jointe"><X className="size-3.5" /></button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <label className="cursor-pointer rounded-xl p-2.5 text-navy-500 hover:bg-navy-50 hover:text-navy-900" title="Joindre un fichier">
            <Paperclip className="size-5" aria-hidden />
            <span className="sr-only">Joindre un fichier</span>
            <input type="file" className="sr-only" onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)} />
          </label>
          <label htmlFor="chat-input" className="sr-only">Votre message</label>
          <textarea
            id="chat-input"
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                (e.currentTarget.form as HTMLFormElement).requestSubmit();
              }
            }}
            placeholder="Écrivez votre message…"
            className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-line px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100"
          />
          <Button type="submit" className="size-11 !px-0" aria-label="Envoyer" disabled={!text.trim() && !file}>
            <SendHorizontal className="size-5" aria-hidden />
          </Button>
        </div>
        <p className="mt-1.5 hidden text-[11px] text-muted sm:block">Entrée pour envoyer · Maj + Entrée pour aller à la ligne</p>
      </form>
    </Card>
  );
}
