"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ScrollText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LeaderboardSidebar = () => {
  const pathname = usePathname();

  const modes = [
    {
      path: "/leaderboard/constellation",
      title: "Constellation",
    },
    {
      path: "/leaderboard/messier",
      title: "Messier",
    },
  ];

  return (
    <aside className="w-full md:max-w-[240px]">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-row items-center gap-2">
            <ScrollText className="h-6 w-6 stroke-primary" />
            <h1 className="text-2xl font-bold text-primary">Leaderboard</h1>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2">
            {modes.map((mode) => {
              return (
                <li key={mode.path}>
                  <Link
                    href={mode.path}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md p-3 duration-300 ease-in-out",
                      pathname.startsWith(mode.path)
                        ? "bg-muted font-semibold text-foreground"
                        : "bg-background font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {mode.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </aside>
  );
};

export default LeaderboardSidebar;
