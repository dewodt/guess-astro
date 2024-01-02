"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { History } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HistorySidebar = () => {
  const pathname = usePathname();

  const modes = [
    {
      path: "/history/constellation",
      title: "Constellation",
    },
    {
      path: "/history/messier",
      title: "Messier",
    },
  ];

  return (
    <aside className="w-full lg:max-w-[240px]">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-row items-center gap-2">
            <History className="h-6 w-6 stroke-primary" />
            <h1
              data-cy="history-sidebar-title"
              className="text-2xl font-bold text-primary"
            >
              History
            </h1>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2">
            {modes.map((mode) => {
              return (
                <li key={mode.path}>
                  <Link
                    href={mode.path}
                    data-cy={`history-sidebar-${mode.title.toLowerCase()}`}
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

export default HistorySidebar;
