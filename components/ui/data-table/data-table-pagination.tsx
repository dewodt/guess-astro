import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex flex-col items-center gap-4 overflow-auto px-2 py-1 sm:flex-row sm:gap-6 lg:gap-8">
      <div className="flex items-center space-x-3">
        <p
          data-cy="history-table-rows-per-page-text"
          className="whitespace-nowrap text-sm font-medium"
        >
          Rows per page
        </p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger
            data-cy="history-table-rows-per-page-trigger"
            className="h-10 w-[70px]"
          >
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizeOptions.map((pageSize) => (
              <SelectItem
                data-cy={`history-table-rows-per-page-option-${pageSize}`}
                key={pageSize}
                value={`${pageSize}`}
              >
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div
        data-cy="history-table-page-of"
        className="flex w-[100px] items-center justify-center text-sm font-medium"
      >
        Page{" "}
        {table.getPageCount() === 0
          ? 0
          : table.getState().pagination.pageIndex + 1}{" "}
        of {table.getPageCount()}
      </div>
      <div className="flex items-center space-x-3">
        <Button
          data-cy="history-button-first-page"
          aria-label="Go to first page"
          variant="outline"
          size="icon"
          className="hidden lg:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
        </Button>
        <Button
          data-cy="history-button-previous-page"
          aria-label="Go to previous page"
          variant="outline"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </Button>
        <Button
          data-cy="history-button-next-page"
          aria-label="Go to next page"
          variant="outline"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </Button>
        <Button
          data-cy="history-button-last-page"
          aria-label="Go to last page"
          variant="outline"
          size="icon"
          className="hidden lg:flex"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
