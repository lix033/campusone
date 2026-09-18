"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "./cn";

function useModal(open: boolean, onClose: () => void) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const first = ref.current?.querySelector<HTMLElement>("input, select, textarea, button:not([data-close])");
    (first ?? ref.current)?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [open, onClose]);
  return ref;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const ref = useModal(open, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 animate-[fade-up_0.2s_ease-out] bg-navy-950/40 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        tabIndex={-1}
        className={cn(
          "relative flex max-h-[92vh] w-full animate-toast-in flex-col rounded-t-3xl bg-white shadow-lift focus:outline-none sm:rounded-3xl",
          size === "sm" ? "sm:max-w-md" : size === "lg" ? "sm:max-w-3xl" : "sm:max-w-xl",
        )}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <div>
            <h2 id="dialog-title" className="text-lg font-bold text-navy-900">{title}</h2>
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
          <button data-close onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-navy-50 hover:text-navy-900" aria-label="Fermer">
            <X className="size-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex flex-col-reverse gap-2 border-t border-line px-6 py-4 sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>
  );
}

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  width = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  width?: "md" | "lg";
}) {
  const ref = useModal(open, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex justify-end">
      <div className="absolute inset-0 bg-navy-950/30" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        tabIndex={-1}
        className={cn(
          "relative flex h-full w-full animate-[drawer-in_0.3s_cubic-bezier(0.22,1,0.36,1)] flex-col bg-white shadow-lift focus:outline-none",
          width === "lg" ? "max-w-2xl" : "max-w-lg",
        )}
      >
        <style>{`@keyframes drawer-in{from{transform:translateX(24px);opacity:0}to{transform:none;opacity:1}}`}</style>
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <h2 id="drawer-title" className="text-lg font-bold text-navy-900">{title}</h2>
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
          <button data-close onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-navy-50 hover:text-navy-900" aria-label="Fermer">
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-line px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
