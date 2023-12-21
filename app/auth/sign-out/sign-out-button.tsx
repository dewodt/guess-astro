"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export const SignOutButton = () => {
  return (
    <Button
      size="lg"
      onClick={() => signOut({ callbackUrl: "/?phState=reset" })}
    >
      Sign Out
    </Button>
  );
};
