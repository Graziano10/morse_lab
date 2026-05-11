import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-slate-700 text-slate-300 border-slate-600",
  success: "bg-emerald-900/50 text-emerald-300 border-emerald-700/50",
  warning: "bg-amber-900/50 text-amber-300 border-amber-700/50",
  danger: "bg-red-900/50 text-red-300 border-red-700/50",
  info: "bg-blue-900/50 text-blue-300 border-blue-700/50",
};

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
