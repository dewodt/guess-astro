"use client";

import * as React from "react";
import type { DataTableFilterableColumn, Option } from "@/types/data-table";
import { X } from "lucide-react";
import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DatePickerWithRange } from "./date-picker-range";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterableColumns?: DataTableFilterableColumn<TData>[];
}

export function DataTableToolbar<TData>({
  table,
  filterableColumns = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [isPending, startTransition] = React.useTransition();

  return (
    <div className="flex w-full flex-1 flex-col gap-3 overflow-auto sm:flex-row sm:items-center">
      {/* Filters */}
      {filterableColumns.length > 0 &&
        filterableColumns.map((column) => {
          const columnId = column.id ? String(column.id) : "";

          if (!table.getColumn(columnId)) return;

          if (columnId === "createdAt") {
            // Calendar
            return (
              <DatePickerWithRange
                key={columnId}
                column={table.getColumn(columnId)}
              />
            );
          } else {
            // Faceted filter
            return (
              <DataTableFacetedFilter
                key={columnId}
                column={table.getColumn(columnId)}
                title={column.title}
                options={column.options as Option[]}
              />
            );
          }
        })}

      {/* Reset button */}
      {isFiltered && (
        <Button
          aria-label="Reset filters"
          variant="secondary"
          className="px-3"
          onClick={() => table.resetColumnFilters()}
        >
          Reset
          <X className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
