"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Settings, User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const SettingsSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-full md:max-w-[240px]">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-row items-center gap-2">
            <Settings className="h-6 w-6 stroke-primary" />
            <h1 className="text-2xl font-bold text-primary">Settings</h1>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2">
            {/* Profile */}
            <li>
              <Link
                href="/settings/profile"
                className={cn(
                  "flex w-full items-center gap-2 rounded-md p-3 duration-300 ease-in-out",
                  pathname.startsWith("/settings/profile")
                    ? "bg-muted font-semibold text-foreground"
                    : "bg-background font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <User className="h-5 w-5" />
                Profile
              </Link>
            </li>

            {/* Sign Out */}
            <li
              onClick={() => signOut({ callbackUrl: "/?phState=reset" })}
              className="flex w-full cursor-pointer flex-row items-center gap-2 rounded-md p-3 font-medium text-destructive duration-300 ease-in-out hover:bg-muted"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </li>
          </ul>
        </CardContent>
      </Card>
    </aside>
  );
};

export default SettingsSidebar;
