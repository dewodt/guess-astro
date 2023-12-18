import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTableLoading } from "@/components/ui/data-table/data-table-loading";
import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryLoadingPage() {
  return (
    <main className="w-full">
      <Card className="h-fit w-full max-w-2xl shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-bold text-primary">
            <Skeleton className="h-8 w-64" />
          </h2>
        </CardHeader>
        <CardContent>
          <DataTableLoading columnCount={2} />
        </CardContent>
      </Card>
    </main>
  );
}
