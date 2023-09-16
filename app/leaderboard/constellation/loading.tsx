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

const ConstellationLeaderboardLoadingPage = () => {
  return (
    <main className="w-full">
      <Card className="h-fit w-full max-w-2xl">
        <CardHeader>
          <h2 className="text-2xl font-bold text-primary">
            Constellation Leaderboard
          </h2>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              {/* Header */}
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Score</TableHead>
                </TableRow>
              </TableHeader>

              {/* Body */}
              <TableBody>
                {/* Create 3 skeleton rows */}
                {Array.from({ length: 10 }, (_, i) => i).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">
                      <Skeleton className="h-5 w-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-12" />
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

export default ConstellationLeaderboardLoadingPage;
