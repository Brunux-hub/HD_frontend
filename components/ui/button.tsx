import * as React from "react";
import { cn } from "@/components/ui/cn";

type ButtonVariant = "default" | "outline" | "destructive" | "ghost";
type ButtonSize = "default" | "sm" | "lg";

const variantClassName: Record<ButtonVariant, string> = {
  default:
    "bg-slate-950 text-white border border-slate-950 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:border-slate-100 dark:hover:bg-slate-200",
  outline:
    "border border-slate-300 bg-white text-slate-950 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800",
  destructive:
    "bg-red-600 text-white border border-red-600 hover:bg-red-700",
  ghost:
    "bg-transparent text-slate-950 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800",
};

const sizeClassName: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2 text-sm",
  sm: "h-8 px-3 text-sm",
  lg: "h-12 px-5 text-base",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded border px-3 py-2 text-sm",
          variantClassName[variant],
          sizeClassName[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
