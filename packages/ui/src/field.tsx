import * as React from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "./cn";

const control =
  "w-full rounded-xl border bg-white px-3.5 text-[15px] text-ink placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-4 disabled:bg-slate-50 disabled:text-slate-500";

function state(error?: string) {
  return error
    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
    : "border-line hover:border-navy-200 focus:border-brand-400 focus:ring-brand-100";
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  optional,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="flex items-center gap-1 text-sm font-medium text-navy-900">
        {label}
        {required && <span className="text-rose-500" aria-hidden>*</span>}
        {optional && <span className="font-normal text-muted">(facultatif)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="flex items-center gap-1.5 text-sm text-rose-600" role="alert">
          <AlertCircle className="size-4 shrink-0" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-sm text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ className, error, icon, id, ...props }: InputProps) {
  return (
    <div className="relative">
      {icon && <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
      <input
        id={id}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(control, "h-11", state(error), icon && "pl-10", className)}
        {...props}
      />
    </div>
  );
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export function Select({ className, error, children, id, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        id={id}
        aria-invalid={!!error || undefined}
        className={cn(control, "h-11 appearance-none pr-10", state(error), className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
    </div>
  );
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export function Textarea({ className, error, ...props }: TextareaProps) {
  return <textarea className={cn(control, "min-h-28 py-3", state(error), className)} {...props} />;
}

export function Checkbox({
  id,
  label,
  description,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: React.ReactNode; description?: React.ReactNode }) {
  return (
    <label htmlFor={id} className={cn("flex cursor-pointer items-start gap-3", className)}>
      <input
        id={id}
        type="checkbox"
        className="mt-0.5 size-4.5 shrink-0 cursor-pointer rounded border-line accent-brand-500"
        {...props}
      />
      <span className="text-sm">
        <span className="text-navy-900">{label}</span>
        {description && <span className="mt-0.5 block text-muted">{description}</span>}
      </span>
    </label>
  );
}
