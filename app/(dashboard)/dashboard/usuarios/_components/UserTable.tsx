"use client";

import { useEffect, useState } from "react";
import { SquarePen, Trash } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import UserFormDialog from "./UserFormDialog";

import { User, UserRequest } from "@/types/user";

const tipoLabel = (t: User["type"]) => (t === "ADMIN" ? "Administrador" : "Trabajador");

type Props = {
  users: User[];
  onEdit: (id: number, user: UserRequest) => void;
  onDelete: (id: number) => void;
};

const PAGE_SIZE = 8;

const UserTable = ({ users, onEdit, onDelete }: Props) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const paginated = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages);
  }, [totalPages, page]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginated.map((user) => (
          <TableRow key={user.id_user}>
            <TableCell className="font-medium">{user.id_user}</TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  user.type === "ADMIN"
                    ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {tipoLabel(user.type)}
              </span>
            </TableCell>
            <TableCell className="flex justify-between gap-2">
              <UserFormDialog
                icon={SquarePen}
                mode="edit"
                buttonColor="alert"
                data={user}
                onSubmit={(payload) => onEdit(user.id_user, payload)}
              />
              <Button
                variant="destructive"
                onClick={() => {
                  const ok = window.confirm(
                    `¿Seguro que deseas eliminar al usuario "${user.username}"?`,
                  );
                  if (!ok) return;
                  onDelete(user.id_user);
                }}
              >
                <Trash />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {totalPages > 1 && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="py-3">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink isActive={p === page} onClick={() => setPage(p)}>
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
};

export default UserTable;
