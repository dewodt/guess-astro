"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { useState, useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";
import NavBar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { PHProvider, PostHogPageview } from "@/lib/posthog-client";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  // Navbar State
  const [navBarExpanded, setNavBarExpanded] = useState(false);

  // Reset navbar everytime path changes
  const pathname = usePathname();
  useEffect(() => {
    setNavBarExpanded(false);
  }, [pathname]);

  return (
    <html lang="en" className={`${inter.variable}`}>
      <Suspense>
        <PostHogPageview />
      </Suspense>
      <PHProvider>
        <SessionProvider>
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
              <Toaster />
            </body>
          </ThemeProvider>
        </SessionProvider>
      </PHProvider>
    </html>
  );
};

export default RootLayout;
