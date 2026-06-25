"use client"

import { useState } from "react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon, PencilIcon, TrashIcon, XIcon, InboxIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Column<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  searchable?: boolean
  searchKeys?: (keyof T)[]
  pageSize?: number
}

export function DataTable<T extends object>({
  columns,
  data,
  onEdit,
  onDelete,
  searchable = true,
  searchKeys,
  pageSize = 10,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(0)

  const filtered = search && searchKeys
    ? data.filter((item) =>
        searchKeys.some((key) =>
          String(item[key]).toLowerCase().includes(search.toLowerCase())
        )
      )
    : data

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize)

  const getId = (item: T, idx: number) => {
    const id = (item as Record<string, unknown>).id ?? (item as Record<string, unknown>).id_user ?? (item as Record<string, unknown>).id_service ?? (item as Record<string, unknown>).id_pet
    return String(id ?? idx)
  }

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="relative max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            className="pl-9 pr-9 h-9"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setPage(0) }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {columns.map((col) => (
                <TableHead key={col.key} className="font-semibold text-xs uppercase tracking-wider text-muted-foreground/80">
                  {col.header}
                </TableHead>
              ))}
              {(onEdit || onDelete) && <TableHead className="w-20 text-right">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="h-48">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <InboxIcon className="h-10 w-10 text-muted-foreground/30" />
                    <p className="text-sm font-medium">No se encontraron registros</p>
                    {search && (
                      <p className="text-xs text-muted-foreground/70">
                        Intenta con otros términos de búsqueda
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((item, idx) => (
                <TableRow
                  key={getId(item, idx)}
                  className="transition-colors duration-150 hover:bg-muted/30 data-[state=selected]:bg-muted/50"
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className="py-3">
                      {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? "")}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell className="py-3">
                      <div className="flex items-center justify-end gap-1">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(item)}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                          >
                            <PencilIcon className="h-3.5 w-3.5" />
                            <span className="sr-only">Editar</span>
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(item)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          >
                            <TrashIcon className="h-3.5 w-3.5" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">{page * pageSize + 1}</span>
            {" "}-{" "}
            <span className="font-medium">{Math.min((page + 1) * pageSize, filtered.length)}</span>
            {" "}de{" "}
            <span className="font-medium">{filtered.length}</span> registros
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="h-8 w-8 p-0"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="sr-only">Anterior</span>
            </Button>
            {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
              const start = Math.max(0, Math.min(page - 2, pages - 5))
              const pageNum = start + i
              if (pageNum >= pages) return null
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                  className={cn(
                    "h-8 w-8 p-0 text-xs",
                    pageNum === page && "shadow-sm"
                  )}
                >
                  {pageNum + 1}
                </Button>
              )
            })}
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pages - 1}
              onClick={() => setPage(page + 1)}
              className="h-8 w-8 p-0"
            >
              <ChevronRightIcon className="h-4 w-4" />
              <span className="sr-only">Siguiente</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}