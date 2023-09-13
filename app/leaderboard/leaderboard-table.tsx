import { LeaderboardResponse } from "@/types/api";
import { getBaseUrl } from "@/lib/utils";
import { TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LeaderboardTable = async () => {
  // Fetch leaderboard data
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/user/`, {
    method: "GET",
    cache: "no-store",
  });
  const data = (await res.json()) as LeaderboardResponse;

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
              {data.leaderboardConstellation.map((user, idx) => {
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{idx + 1}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.scoreConstellation}</TableCell>
                  </TableRow>
                );
              })}
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
              {data.leaderboardMessier.map((user, idx) => {
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{idx + 1}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.scoreMessier}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </>
  );
};

export default LeaderboardTable;
