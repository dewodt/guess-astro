import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableLoadingProps {
  columnCount: number;
  rowCount?: number;
}

export function DataTableLoading({
  columnCount,
  rowCount = 10,
}: DataTableLoadingProps) {
  return (
    <div className="w-full space-y-3 overflow-auto">
      <div className="flex w-full flex-1 flex-col gap-3 overflow-auto p-1 sm:flex-row sm:items-center">
        <Skeleton className="h-10 w-full sm:w-[250px]" />
        <Skeleton className="h-10 w-full border-dashed sm:w-[91px]" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {Array.from({ length: 1 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {Array.from({ length: columnCount }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-5 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {Array.from({ length: columnCount }).map((_, i) => (
                  <TableCell key={i}>
                    <Skeleton className="h-[22px] w-28" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-4 overflow-auto px-2 py-1 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-5 w-[100px]" />
          <Skeleton className="h-10 w-[70px]" />
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton className="hidden h-10 w-10 lg:block" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="hidden h-10 w-10 lg:block" />
        </div>
      </div>
    </div>
  );
}
