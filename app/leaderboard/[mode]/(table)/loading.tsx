import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LeaderboardLoadingPage = () => {
  return (
    <main className="w-full">
      <Card className="h-fit w-full max-w-2xl shadow-lg">
        <CardHeader>
          <Skeleton className="h-8 w-64" />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              {/* Header */}
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-10 pr-6">
                    <Skeleton className="h-5 w-8" />
                  </TableHead>
                  <TableHead className="w-full px-6">
                    <Skeleton className="h-5 w-32" />
                  </TableHead>
                  <TableHead className="pl-6 pr-10">
                    <Skeleton className="h-5 w-10" />
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* Body */}
              <TableBody>
                {/* Create 3 skeleton rows */}
                {Array.from({ length: 10 }, (_, i) => i).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="pl-10 pr-6">
                      <Skeleton className="h-5 w-8" />
                    </TableCell>
                    <TableCell className="w-full px-6">
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell className="pl-6 pr-10">
                      <Skeleton className="h-5 w-10" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default LeaderboardLoadingPage;
