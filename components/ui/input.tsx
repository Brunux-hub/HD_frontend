import * as React from "react";
import { cn } from "@/components/ui/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn("w-full rounded border px-3 py-2 text-sm", className)}
      {...props}
    />
  ),
);
Input.displayName = "Input";
