import * as React from "react";
import { cn } from "@/components/ui/cn";

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  mode?: "date" | "datetime-local";
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, mode = "date", ...props }, ref) => (
    <input
      ref={ref}
      type={mode}
      className={cn("w-full rounded border px-3 py-2 text-sm", className)}
      {...props}
    />
  ),
);
DatePicker.displayName = "DatePicker";
