import * as React from "react";
import { cn } from "@/components/ui/cn";

export const Form = React.forwardRef<HTMLFormElement, React.FormHTMLAttributes<HTMLFormElement>>(
  ({ className, ...props }, ref) => (
    <form ref={ref} className={cn("space-y-4", className)} {...props} />
  ),
);
Form.displayName = "Form";

interface FormFieldRenderArgs {
  name: string;
  id: string;
}

interface FormFieldProps {
  name: string;
  render: (field: FormFieldRenderArgs) => React.ReactNode;
}

export function FormField({ name, render }: FormFieldProps) {
  const id = React.useId();
  return <>{render({ name, id })}</>;
}

export const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("space-y-2", className)} {...props} />,
);
FormItem.displayName = "FormItem";

export const FormLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn("text-sm font-medium", className)} {...props} />
  ),
);
FormLabel.displayName = "FormLabel";

export const FormControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn(className)} {...props} />,
);
FormControl.displayName = "FormControl";
