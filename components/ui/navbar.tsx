"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./dropdown-menu";
import {
  Menu,
  X,
  Sun,
  MoonStar,
  LogOut,
  UserCircle2,
  Settings,
  BarChart3,
  History,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect } from "react";
import type { SetStateAction, Dispatch } from "react";

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
      name: "Play",
      url: "/play",
    },
    {
      name: "Leaderboard",
      url: "/leaderboard",
    },
  ];

  // Get current theme
  const { theme, setTheme } = useTheme();

  // Get session
  const { data: session } = NavBar.useSession();

  // Get pathname (NavBar.usePathname is for mocking in component tests)
  const pathname = NavBar.usePathname();

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
    <header className="sticky left-0 right-0 top-0 z-40 flex h-[90px] w-full flex-row items-center justify-between border-b-2 border-b-border bg-background px-8 lg:px-16">
      {/* Logo Icon */}
      <Link data-cy="navbar-logo" href="/">
        <Image
          width={40}
          height={40}
          src="/guess-astro-logo.png"
          alt="Guess Astro Logo"
        />
      </Link>

      {/* Menu Icon Button */}
      <Button
        data-cy="navbar-menu"
        variant="ghost"
        size="icon"
        aria-label="Menu"
        className="lg:hidden"
        onClick={() => setNavBarExpanded(true)}
      >
        <Menu size={36} className="stroke-foreground" />
      </Button>

      <div
        data-cy="navbar-expanded"
        className={`fixed right-0 top-0 z-10 flex h-full w-[230px] flex-col gap-6 border-l-2 border-l-border bg-background p-5 font-inter text-base duration-300 ease-in-out lg:static lg:h-auto lg:w-auto lg:translate-x-0 lg:flex-row-reverse lg:items-center lg:gap-12 lg:border-none lg:bg-transparent lg:p-0 lg:dark:bg-transparent xl:text-lg ${
          navBarExpanded ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-6">
            {/* Toggle Light/Dark mode */}
            <Button
              data-cy="navbar-theme"
              variant="outline"
              size="icon"
              aria-label="Toggle Light/Dark Mode"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <MoonStar className="h-6 w-6 stroke-primary" />
              ) : (
                <Sun className="h-6 w-6 stroke-primary" />
              )}
            </Button>

            {/* Profile dropdown when there's session */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  data-cy="navbar-dropdown-trigger"
                  className="h-11 w-11 rounded-full border-4 border-transparent hover:border-border data-[state=open]:border-4 data-[state=open]:border-border"
                >
                  {/* Avatar */}
                  <Avatar className="h-full w-full">
                    <AvatarImage
                      src={session.image!}
                      alt="Avatar Image"
                      className="object-cover object-center"
                    />
                    <AvatarFallback>
                      <UserCircle2 className="h-full w-full stroke-gray-500 stroke-1" />
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {/* Title */}
                  <DropdownMenuLabel data-cy="navbar-dropdown-title">
                    My Account
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  {/* Settings */}
                  <Link data-cy="navbar-dropdown-settings" href="/settings">
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                  </Link>

                  {/* Statistics */}
                  <Link data-cy="navbar-dropdown-statistics" href="/statistics">
                    <DropdownMenuItem>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Statistics
                    </DropdownMenuItem>
                  </Link>

                  {/* History */}
                  <Link data-cy="navbar-dropdown-history" href="/history">
                    <DropdownMenuItem>
                      <History className="mr-2 h-4 w-4" />
                      History
                    </DropdownMenuItem>
                  </Link>

                  {/* Sign Out */}
                  <DropdownMenuItem
                    data-cy="navbar-dropdown-sign-out"
                    className="text-destructive focus:text-destructive"
                    onClick={() => signOut({ callbackUrl: "/?phState=reset" })}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                data-cy="navbar-sign-in-desktop"
                href="/auth/sign-in"
                aria-label="Sign In"
              >
                <Button
                  variant="default"
                  size="lg"
                  className="hidden font-semibold lg:flex"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Close Button */}
          <Button
            data-cy="navbar-close"
            variant="ghost"
            size="icon"
            aria-label="Close NavBar"
            className="lg:hidden"
            onClick={() => setNavBarExpanded(false)}
          >
            <X size={36} className="stroke-foreground" />
          </Button>
        </div>

        {/* Path lists */}
        <nav>
          <ul className="flex flex-col lg:flex-row lg:gap-12">
            {paths.map((path, index) => {
              return (
                <li key={index} className="py-2">
                  <Link
                    data-cy={`navbar-link-${path.name.toLowerCase()}`}
                    href={path.url}
                    className={`${
                      pathname.startsWith(path.url)
                        ? "font-semibold text-foreground"
                        : "font-medium text-muted-foreground lg:hover:text-foreground"
                    }`}
                  >
                    {path.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sign In button when there's no session */}
        {!session && (
          <Link
            data-cy="navbar-sign-in-mobile"
            href="/auth/sign-in"
            className="self-center"
            aria-label="Sign In"
          >
            <Button
              variant="default"
              size="lg"
              className="font-semibold lg:hidden"
            >
              Sign In
            </Button>
          </Link>
        )}
      </div>

      {/* Side bar opaque background */}
      {navBarExpanded && (
        <div
          data-cy="navbar-opaque"
          ref={sideBarBgRef}
          className="fixed inset-0 z-0 h-full w-full bg-opacity-80 backdrop-blur-sm lg:hidden"
        />
      )}
    </header>
  );
};

// For mocking usePathname() hook in component tests
NavBar.usePathname = usePathname;
NavBar.useSession = useSession;

export default NavBar;
