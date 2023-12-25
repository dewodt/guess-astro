"use client";

import {
  fetchTasksTableColumnDefs,
  filterableColumns,
} from "./table-column-def";
import { DataTable } from "@/components/ui/data-table/data-table";
import { useDataTable } from "@/components/ui/data-table/use-data-table";
import { type Match } from "@/db/schema";
import { type ColumnDef } from "@tanstack/react-table";
import * as React from "react";

interface HistoryTableShellProps {
  data: Match[];
  pageCount: number;
}

export function HistoryTableShell({ data, pageCount }: HistoryTableShellProps) {
  const [isPending, startTransition] = React.useTransition();

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<Match, unknown>[]>(
    () => fetchTasksTableColumnDefs(isPending, startTransition),
    [isPending]
  );

  const { dataTable } = useDataTable({
    columns,
    data,
    pageCount,
    filterableColumns,
  });

  return (
    <DataTable
      dataTable={dataTable}
      columns={columns}
      filterableColumns={filterableColumns}
    />
  );
}
