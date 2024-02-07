"use client";

import { TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";

export const LeaderboardRow = ({
  children,
  href,
  ...props
}: {
  children: React.ReactNode;
  href: string;
}) => {
  // Get router
  const router = useRouter();

  return (
    <TableRow
      // Click mouse navigation
      onClick={() => router.push(href)}
      // Handle keyboard navigation
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(href);
      }}
      className="cursor-pointer"
      {...props}
    >
      {children}
    </TableRow>
  );
};
