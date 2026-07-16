"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = {
  placeholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  children?: React.ReactNode;
};

export function DataTableToolbar({ placeholder = "Buscar...", searchValue, onSearchChange, children }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="pl-9 h-9 text-sm bg-background"
        />
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
