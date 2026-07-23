"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export function DataTablePagination({ currentPage, totalPages, totalItems, pageSize, onPageChange }: Props) {
  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-1 py-2 text-sm text-muted-foreground">
      <span>
        {from}–{to} de {totalItems}
      </span>
      <div className="flex items-center gap-0.5">
        <Button variant="ghost" size="icon-sm" className="h-7 w-7"
          disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
          .map((p, idx, arr) => (
            <span key={p} className="flex items-center">
              {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1 text-xs text-muted-foreground">···</span>}
              <Button variant={p === currentPage ? "default" : "ghost"} size="icon-sm" className="h-7 w-7 text-xs"
                onClick={() => onPageChange(p)}>
                {p}
              </Button>
            </span>
          ))}
        <Button variant="ghost" size="icon-sm" className="h-7 w-7"
          disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
