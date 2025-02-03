"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Eye, Settings, ListChecks, Wrench } from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useState } from "react";

type Company = {
  id: number;
  logo: string;
  name: string;
  domain: string;
  country: string;
  patients: string;
  type: string;
  status: boolean;
};

const companies: Company[] = [
  {
    id: 1,
    logo: "C",
    name: "Chubb",
    domain: "chubb.medismart.live",
    country: "Chile",
    patients: "1.305.458",
    type: "Aseguradora",
    status: true,
  },
  {
    id: 2,
    logo: "Z",
    name: "Zurich",
    domain: "zurich.medismart.live",
    country: "Colombia",
    patients: "600",
    type: "Aseguradora",
    status: true,
  },
];

export function CompanyTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: "name",
      header: "Empresa",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold">
            {row.original.logo}
          </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm text-muted-foreground">
              {row.original.domain}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "country",
      header: "País",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <img
            src={`https://flagcdn.com/w20/${
              row.original.country.toLowerCase() === "chile" ? "cl" : "co"
            }.png`}
            alt={row.original.country}
            className="w-5"
          />
          {row.original.country}
        </div>
      ),
    },
    {
      accessorKey: "patients",
      header: "CantPacientes",
    },
    {
      accessorKey: "type",
      header: "Tipo de industria",
    },
    {
      id: "actions",
      cell: () => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <ListChecks className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Wrench className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
    {
      id: "status",
      cell: ({ row }) => (
        <div className="text-right">
          <Switch checked={row.original.status} />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: companies,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No hay resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
