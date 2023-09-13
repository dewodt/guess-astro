import { Skeleton } from "@/components/ui/skeleton";
import { TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SkeletonTable = () => {
  return (
    <>
      {/* Constellation Table */}
      <TabsContent value="constellation">
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
              {Array.from({ length: 3 }, (_, i) => i).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">
                    <Skeleton className="h-4 w-10" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      {/* Messier Table */}
      <TabsContent value="messier">
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
              {Array.from({ length: 3 }, (_, i) => i).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">
                    <Skeleton className="h-4 w-10" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </>
  );
};

export default SkeletonTable;
