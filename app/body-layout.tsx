"use client";

import Footer from "@/components/ui/footer";
import NavBar from "@/components/ui/navbar";
import { Toaster } from "@/components/ui/sonner";
import {
  PHProvider,
  PostHogIdentifyOrReset,
  PostHogPageview,
} from "@/lib/posthog-client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

const BodyLayout = ({ children }: { children: React.ReactNode }) => {
  // Navbar State
  const [navBarExpanded, setNavBarExpanded] = useState(false);

  // Reset navbar everytime path changes
  const pathname = usePathname();
  useEffect(() => {
    setNavBarExpanded(false);
  }, [pathname]);

  return (
    <SessionProvider>
      <PHProvider>
        <Suspense>
          <PostHogPageview />
          <PostHogIdentifyOrReset />
        </Suspense>
        <ThemeProvider attribute="class" defaultTheme="light">
          <body
            className={`flex min-h-screen flex-col bg-background font-inter ${
              navBarExpanded && "overflow-hidden"
            }`}
          >
            <NavBar
              navBarExpanded={navBarExpanded}
              setNavBarExpanded={setNavBarExpanded}
            />
            {children}
            <Footer />
            <Toaster
              richColors={true}
              closeButton={true}
              position="top-center"
            />
          </body>
        </ThemeProvider>
      </PHProvider>
    </SessionProvider>
  );
};

export default BodyLayout;
