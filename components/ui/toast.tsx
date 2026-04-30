import * as React from "react";
import { cn } from "@/components/ui/cn";

export type ToastVariant = "default" | "success" | "error";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastProps {
  item: ToastItem;
  onClose: (id: string) => void;
}

export function Toast({ item, onClose }: ToastProps) {
  return (
    <article className={cn("rounded border bg-white p-3 shadow")}
    >
      <header className="flex items-start justify-between gap-3">
        <strong className="text-sm">{item.title}</strong>
        <button type="button" onClick={() => onClose(item.id)} aria-label="Cerrar notificacion">
          x
        </button>
      </header>
      {item.description ? <p className="mt-1 text-sm">{item.description}</p> : null}
    </article>
  );
}

interface ToastViewportProps {
  items: ToastItem[];
  onClose: (id: string) => void;
}

export function ToastViewport({ items, onClose }: ToastViewportProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2" aria-live="polite">
      {items.map((item) => (
        <Toast key={item.id} item={item} onClose={onClose} />
      ))}
    </div>
  );
}
