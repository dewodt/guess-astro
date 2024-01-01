import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DataTableFilterableColumn } from "@/types/data-table";
import {
  flexRender,
  type ColumnDef,
  type Table as TanstackTable,
} from "@tanstack/react-table";
import * as React from "react";

interface DataTableProps<TData, TValue> {
  dataTable: TanstackTable<TData>;
  columns: ColumnDef<TData, TValue>[];
  filterableColumns?: DataTableFilterableColumn<TData>[];
}

export function DataTable<TData, TValue>({
  dataTable,
  columns,
  filterableColumns = [],
}: DataTableProps<TData, TValue>) {
  return (
    <div className="w-full items-center space-y-3 overflow-auto">
      <DataTableToolbar
        table={dataTable}
        filterableColumns={filterableColumns}
      />
      <div className="rounded-md border">
        <Table data-cy="history-table" className="table-fixed">
          <TableHeader>
            {dataTable.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, colIdx) => {
                  return (
                    <TableHead
                      data-cy={`history-table-header-${colIdx}`}
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {dataTable.getRowModel().rows?.length ? (
              dataTable.getRowModel().rows.map((row, rowIdx) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell, colIdx) => (
                    <TableCell
                      data-cy={`history-table-body-${rowIdx}-${colIdx}`}
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center">
        <DataTablePagination table={dataTable} />
      </div>
    </div>
  );
}
