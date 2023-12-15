"use client";

import { TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";

export const LeaderboardRow = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => {
  // Get router
  const router = useRouter();

  return (
    <TableRow onClick={() => router.push(href)} className="cursor-pointer">
      {children}
    </TableRow>
  );
};
