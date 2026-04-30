import * as React from "react";
import { cn } from "@/components/ui/cn";

type BadgeVariant = "default" | "success" | "warning" | "danger";

const variantClassName: Record<BadgeVariant, string> = {
  default: "",
  success: "",
  warning: "",
  danger: "",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center rounded border px-2 py-0.5 text-xs", variantClassName[variant], className)}
      {...props}
    />
  );
}
