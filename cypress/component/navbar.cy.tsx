import { testUserJwtMock } from "../fixtures/jwt";
import NavBarTest from "../lib/navbar-test";
import NavBar from "@/components/ui/navbar";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

describe("Navigation bar component", () => {
  beforeEach(() => {
    // Stub usePathname
    cy.stub(NavBar, "usePathname").returns("/play");

    // Intercept image (to prevent image not found)
    cy.intercept("GET", "_next/image*", {
      fixture: "images/guess-astro-logo.png",
    }).as("loadImage");
  });

  it("Should successfully render navigation bar when user is unathenticated", () => {
    // Mount
    cy.mount(
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="light">
          <NavBarTest />
        </ThemeProvider>
      </SessionProvider>
    );

    /* NOT EXPANDED */
    // Check image
    cy.get('[data-cy="navbar-logo"]')
      .should("be.visible")
      .and("have.attr", "href", "/");
    cy.get('[data-cy="navbar-logo"]')
      .find("img")
      .should("be.visible")
      .and("have.attr", "src");

    // Check menu button
    cy.get('[data-cy="navbar-menu"]')
      .should("be.visible")
      .and("not.be.disabled");
    cy.get('[data-cy="navbar-menu"]').find("svg").should("be.visible");

    // Sidebar
    cy.get('[data-cy="navbar-expanded"]').should("not.be.visible");
    // Opaque background
    cy.get('[data-cy="navbar-opaque"]').should("not.exist");

    /* EXPANDED */
    cy.get('[data-cy="navbar-menu"]').click();
    // Sidebar
    cy.get('[data-cy="navbar-expanded"]').should("be.visible");
    // Opaque background
    cy.get('[data-cy="navbar-opaque"]').should("exist");

    // Theme button
    cy.get('[data-cy="navbar-theme"]')
      .should("be.visible")
      .and("not.be.disabled");
    cy.get('[data-cy="navbar-theme"]').find("svg").should("be.visible");
    // Defaults to white
    cy.get("body").should("have.css", "background-color", "rgb(255, 255, 255)");
    // Click to change to dark
    cy.get('[data-cy="navbar-theme"]').click();
    cy.get("body").should("have.css", "background-color", "rgb(2, 8, 23)");
    // Reset
    cy.get('[data-cy="navbar-theme"]').click();
    cy.get("body").should("have.css", "background-color", "rgb(255, 255, 255)");

    // Check links
    // Play
    cy.get('[data-cy="navbar-link-play"]')
      .should("be.visible")
      .should("have.attr", "href", "/play")
      .should("have.text", "Play")
      .and("have.class", "font-semibold text-foreground");
    // Leaderboard
    cy.get('[data-cy="navbar-link-leaderboard"]')
      .should("be.visible")
      .should("have.attr", "href", "/leaderboard")
      .should("have.text", "Leaderboard")
      .and(
        "have.class",
        "font-medium text-muted-foreground lg:hover:text-foreground"
      );

    // Sign In Button
    cy.get('[data-cy="navbar-sign-in-mobile"]')
      .should("be.visible")
      .should("have.attr", "href", "/auth/sign-in")
      .and("have.text", "Sign In");

    // Avatar & dropdown
    cy.get('[data-cy="navbar-dropdown-trigger"]').should("not.exist");
    cy.get('[data-cy="navbar-dropdown-title"]').should("not.exist");
    cy.get('[data-cy="navbar-dropdown-settings"]').should("not.exist");
    cy.get('[data-cy="navbar-dropdown-statistics"]').should("not.exist");
    cy.get('[data-cy="navbar-dropdown-history"]').should("not.exist");
    cy.get('[data-cy="navbar-dropdown-sign-out"]').should("not.exist");

    // Close button
    cy.get('[data-cy="navbar-close"]')
      .should("be.visible")
      .should("not.be.disabled");
    cy.get('[data-cy="navbar-close"]').find("svg").should("be.visible");
    cy.get('[data-cy="navbar-close"]').click();
    // Sidebar
    cy.get('[data-cy="navbar-expanded"]').should("not.be.visible");
    // Opaque background
    cy.get('[data-cy="navbar-opaque"]').should("not.exist");

    // Test opaque background closes sidebar
    cy.get('[data-cy="navbar-menu"]').click();
    // Sidebar
    cy.get('[data-cy="navbar-expanded"]').should("be.visible");
    // Opaque background
    cy.get('[data-cy="navbar-opaque"]').should("exist");
    // Close by clicking opaque background
    cy.get('[data-cy="navbar-opaque"]').click();
    // Sidebar
    cy.get('[data-cy="navbar-expanded"]').should("not.be.visible");
    // Opaque background
    cy.get('[data-cy="navbar-opaque"]').should("not.exist");
  });

  it("Should successfully render navigation bar when user authenticated", () => {
    // Stub useSession
    cy.stub(NavBar, "useSession").returns({ data: testUserJwtMock });

    // Mount
    cy.mount(
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="light">
          <NavBarTest />
        </ThemeProvider>
      </SessionProvider>
    );

    /* NOT EXPANDED */
    // Check image
    cy.get('[data-cy="navbar-logo"]')
      .should("be.visible")
      .and("have.attr", "href", "/");
    cy.get('[data-cy="navbar-logo"]')
      .find("img")
      .should("be.visible")
      .and("have.attr", "src");

    // Check menu button
    cy.get('[data-cy="navbar-menu"]')
      .should("be.visible")
      .and("not.be.disabled");
    cy.get('[data-cy="navbar-menu"]').find("svg").should("be.visible");

    // Sidebar
    cy.get('[data-cy="navbar-expanded"]').should("not.be.visible");
    // Opaque background
    cy.get('[data-cy="navbar-opaque"]').should("not.exist");

    /* EXPANDED */
    cy.get('[data-cy="navbar-menu"]').click();
    // Sidebar
    cy.get('[data-cy="navbar-expanded"]').should("be.visible");
    // Opaque background
    cy.get('[data-cy="navbar-opaque"]').should("exist");

    // Theme button
    cy.get('[data-cy="navbar-theme"]')
      .should("be.visible")
      .and("not.be.disabled");
    cy.get('[data-cy="navbar-theme"]').find("svg").should("be.visible");
    // Defaults to white
    cy.get("body").should("have.css", "background-color", "rgb(255, 255, 255)");
    // Click to change to dark
    cy.get('[data-cy="navbar-theme"]').click();
    cy.get("body").should("have.css", "background-color", "rgb(2, 8, 23)");
    // Reset
    cy.get('[data-cy="navbar-theme"]').click();
    cy.get("body").should("have.css", "background-color", "rgb(255, 255, 255)");

    // Check links
    // Play
    cy.get('[data-cy="navbar-link-play"]')
      .should("be.visible")
      .should("have.attr", "href", "/play")
      .should("have.text", "Play")
      .and("have.class", "font-semibold text-foreground");
    // Leaderboard
    cy.get('[data-cy="navbar-link-leaderboard"]')
      .should("be.visible")
      .should("have.attr", "href", "/leaderboard")
      .should("have.text", "Leaderboard")
      .and(
        "have.class",
        "font-medium text-muted-foreground lg:hover:text-foreground"
      );

    // Sign In Button
    cy.get('[data-cy="navbar-sign-in-mobile"]').should("not.exist");

    // Avatar & dropdown
    cy.get('[data-cy="navbar-dropdown-trigger"]').should("be.visible");
    cy.get('[data-cy="navbar-dropdown-trigger"]').click();
    cy.get('[data-cy="navbar-dropdown-title"]')
      .should("be.visible")
      .and("have.text", "My Account");
    cy.get('[data-cy="navbar-dropdown-settings"]')
      .should("be.visible")
      .should("have.text", "Settings")
      .and("have.attr", "href", "/settings");
    cy.get('[data-cy="navbar-dropdown-statistics"]')
      .should("be.visible")
      .should("have.text", "Statistics")
      .and("have.attr", "href", "/statistics");
    cy.get('[data-cy="navbar-dropdown-history"]')
      .should("be.visible")
      .should("have.text", "History")
      .and("have.attr", "href", "/history");
    cy.get('[data-cy="navbar-dropdown-sign-out"]')
      .should("be.visible")
      .and("have.text", "Sign Out");
    // Close dropdown
    cy.get('[data-cy="navbar-dropdown-trigger"]').click({ force: true });

    // Close button
    cy.get('[data-cy="navbar-close"]')
      .should("be.visible")
      .should("not.be.disabled");
    cy.get('[data-cy="navbar-close"]').find("svg").should("be.visible");
    cy.get('[data-cy="navbar-close"]').click();
    // Sidebar
    cy.get('[data-cy="navbar-expanded"]').should("not.be.visible");
    // Opaque background
    cy.get('[data-cy="navbar-opaque"]').should("not.exist");

    // Test opaque background closes sidebar
    cy.get('[data-cy="navbar-menu"]').click();
    // Sidebar
    cy.get('[data-cy="navbar-expanded"]').should("be.visible");
    // Opaque background
    cy.get('[data-cy="navbar-opaque"]').should("exist");
    // Close by clicking opaque background
    cy.get('[data-cy="navbar-opaque"]').click();
    // Sidebar
    cy.get('[data-cy="navbar-expanded"]').should("not.be.visible");
    // Opaque background
    cy.get('[data-cy="navbar-opaque"]').should("not.exist");
  });
});
