"use client";

import { type Match } from "@/db/schema";
import type { DataTableFilterableColumn } from "@/types/data-table";
import { type ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { matchResults } from "@/lib/constants";
import { getFormattedDate } from "@/lib/utils";

export function fetchTasksTableColumnDefs(
  isPending: boolean,
  startTransition: React.TransitionStartFunction
): ColumnDef<Match, unknown>[] {
  return [
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => (
        <div>{getFormattedDate(row.getValue("createdAt"))}</div>
      ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "result",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Result" />
      ),
      cell: ({ row }) => {
        const result = matchResults.find(
          (result) => result === row.original.result
        );

        if (!result) return null;

        return (
          <div className="flex items-center">
            {result === "correct" ? (
              <Badge variant="green">Correct</Badge>
            ) : (
              <Badge variant="destructive">Incorrect</Badge>
            )}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value instanceof Array && value.includes(row.getValue(id));
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];
}

// For faceted filter only
export const filterableColumns: DataTableFilterableColumn<Match>[] = [
  {
    id: "createdAt",
    title: "Date",
  },
  {
    id: "result",
    title: "Result",
    options: matchResults.map((result) => ({
      label: result === "correct" ? "Correct" : "Incorrect",
      value: result,
    })),
  },
];
