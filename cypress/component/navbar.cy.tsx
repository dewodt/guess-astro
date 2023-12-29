import NavBar from "@/components/ui/navbar";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";

describe("Navigation bar component", () => {
  it.skip("Should successfully render the navigation bar", () => {
    // To do: Mock usePathname() hook
    // cy.stub(NavBar, usePathname as any).returns("/");
    cy.mount(
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="light">
          <NavBar navBarExpanded={true} setNavBarExpanded={() => {}} />
        </ThemeProvider>
      </SessionProvider>
    );
  });

  it.skip("Should show sign in button when user is not signed in", () => {});

  it.skip("Should show avatar icon when user is signed in", () => {});

  it.skip("Success fully sign out user when sign out button is clicked", () => {});
});
