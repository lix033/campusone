"use client";

import * as React from "react";
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react";
import { cn } from "./cn";

type ToastTone = "success" | "info" | "warning" | "error";
type ToastItem = { id: number; title: string; description?: string; tone: ToastTone };
type ToastFn = (t: { title: string; description?: string; tone?: ToastTone }) => void;

const ToastContext = React.createContext<ToastFn>(() => {});

const icons = {
  success: <CheckCircle2 className="size-5 text-emerald-500" aria-hidden />,
  info: <Info className="size-5 text-brand-500" aria-hidden />,
  warning: <TriangleAlert className="size-5 text-amber-500" aria-hidden />,
  error: <XCircle className="size-5 text-rose-500" aria-hidden />,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const dismiss = React.useCallback((id: number) => setItems((l) => l.filter((t) => t.id !== id)), []);
  const push = React.useCallback<ToastFn>(
    ({ title, description, tone = "success" }) => {
      const id = Date.now() + Math.random();
      setItems((l) => [...l.slice(-3), { id, title, description, tone }]);
      setTimeout(() => dismiss(id), 4200);
    },
    [dismiss],
  );
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
        aria-live="polite"
        role="status"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-2xl border border-line bg-white p-4 shadow-lift"
          >
            {icons[t.tone]}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-navy-900">{t.title}</p>
              {t.description && <p className="mt-0.5 text-sm text-muted">{t.description}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} className="rounded-md p-0.5 text-slate-400 hover:text-navy-900" aria-label="Fermer la notification">
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return React.useContext(ToastContext);
}
