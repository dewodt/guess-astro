"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect } from "react";
import type { SetStateAction, Dispatch } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, X, Sun, MoonStar } from "lucide-react";
import { Button } from "./ui/button";

const NavBar = ({
  navBarExpanded,
  setNavBarExpanded,
}: {
  navBarExpanded: boolean;
  setNavBarExpanded: Dispatch<SetStateAction<boolean>>;
}) => {
  // List of paths
  const paths = [
    {
      name: "Constellation",
      url: "/constellation",
    },
    {
      name: "Messier",
      url: "/messier",
    },
    {
      name: "Leaderboard",
      url: "/leaderboard",
    },
  ];

  // Get current theme
  const { theme, setTheme } = useTheme();

  // Get pathname
  const pathname = usePathname();

  // Side Bar background ref
  const sideBarBgRef = useRef<HTMLDivElement>(null);

  // Close Navbar when user clicks on black background stuffs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // If Userclick is in the black background stuff
      if (
        sideBarBgRef.current &&
        sideBarBgRef.current.contains(event.target as Node)
      ) {
        setNavBarExpanded(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setNavBarExpanded]);

  return (
    <nav className="sticky left-0 right-0 top-0 z-40 flex h-20 w-full flex-row items-center justify-between border-b-2 border-b-border bg-background px-5 lg:px-16 xl:h-[90px]">
      {/* Logo Icon */}
      <Link href="/">
        <Image
          width={40}
          height={40}
          src="/guess-astro.png"
          alt="Guess Astro Logo"
        />
      </Link>

      {/* Menu Icon Button */}
      <button
        aria-label="Menu"
        className="block w-fit lg:hidden"
        onClick={() => setNavBarExpanded(!navBarExpanded)}
      >
        <Menu size={36} className="stroke-foreground" />
      </button>

      <div
        className={`fixed right-0 top-0 z-10 flex h-full w-[230px] flex-col gap-6 border-l-2 border-l-border bg-background p-5 font-inter text-base duration-300 ease-in-out lg:static lg:h-auto lg:w-auto lg:translate-x-0 lg:flex-row-reverse lg:items-center lg:gap-12 lg:border-none lg:bg-transparent lg:p-0 lg:dark:bg-transparent xl:text-lg ${
          navBarExpanded ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-row items-center justify-between">
          {/* Toggle Light/Dark mode */}
          <Button
            variant="outline"
            size="icon"
            aria-label="Toggle Light/Dark Mode"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <MoonStar size={30} className="stroke-primary" />
            ) : (
              <Sun size={30} className="stroke-primary" />
            )}
          </Button>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close NavBar"
            className="xl:hidden"
            onClick={() => setNavBarExpanded(!navBarExpanded)}
          >
            <X size={36} className="stroke-foreground" />
          </Button>
        </div>

        {/* Path lists */}
        <ul className="flex flex-col lg:flex-row lg:gap-12">
          {paths.map((path, index) => {
            return (
              <Link key={index} href={path.url}>
                <li
                  className={`py-2 ${
                    pathname.startsWith(path.url)
                      ? "font-semibold text-foreground"
                      : "font-medium text-muted-foreground xl:hover:text-foreground"
                  }`}
                >
                  {path.name}
                </li>
              </Link>
            );
          })}
        </ul>

        <div className="flex items-center justify-center">
          {/* Profile */}
          {/* {session ? (
            <></>
          ) : (
            <Button
              variant="default"
              size="lg"
              onClick={() => signIn()}
              className="font-semibold"
            >
              Sign In
            </Button>
          )} */}
        </div>
      </div>

      {/* Side bar opaque background */}
      {navBarExpanded && (
        <div
          ref={sideBarBgRef}
          className="fixed inset-0 z-0 h-full w-full bg-opacity-80 backdrop-blur-sm lg:hidden"
        />
      )}
    </nav>
  );
};

export default NavBar;
