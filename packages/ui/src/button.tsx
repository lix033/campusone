import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "./cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "white";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-500 text-white shadow-[0_6px_16px_-6px_rgb(62_134_245/0.6)] hover:bg-brand-600",
  secondary: "bg-navy-900 text-white hover:bg-navy-800",
  outline: "border border-line bg-white text-navy-900 hover:border-navy-200 hover:bg-navy-50",
  ghost: "text-navy-700 hover:bg-navy-50",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
  success: "bg-emerald-600 text-white hover:bg-emerald-700",
  white: "bg-white text-navy-900 hover:bg-brand-50",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 rounded-lg px-3.5 text-sm",
  md: "h-11 rounded-xl px-5 text-sm",
  lg: "h-13 rounded-xl px-7 text-base",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export function Button({ variant, size, loading, className, children, disabled, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
