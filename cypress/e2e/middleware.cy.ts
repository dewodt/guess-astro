import { testUserJwtMock, unregisteredUserJwtMock } from "../fixtures/jwt";

describe("Middleware", () => {
  before(() => {
    // Non mutating page, once is enough
    cy.task("db:seed");
  });

  // List of routes to visit
  const neutralRoutes = [
    "/",
    "/play",
    "/leaderboard",
    "/leaderboard/constellation",
    "/leaderboard/messier",
    "/about",
    "/privacy-policy",
  ];
  const authenticatedRoutes = [
    "/history",
    "/history/constellation",
    "/history/messier",
    "/settings",
    "/settings/profile",
    "/play/constellation",
    "/play/messier",
    "/auth/register",
    "/auth/sign-out",
    "/statistics",
    "/statistics/constellation",
    "/statistics/messier",
  ];
  const unAuthenticatedRoutes = ["/auth/sign-in", "/auth/verify-request"];

  it("Should redirect user to sign in page if user is not authenticated and tries to access authenticated route only", () => {
    authenticatedRoutes.forEach((path) => {
      cy.visit(path);
      cy.url().should("include", "/auth/sign-in");
    });
  });

  it("Should redirect user to home page if user is authenticated and tries to access unathenticated route only", () => {
    cy.googleSignIn(testUserJwtMock);

    unAuthenticatedRoutes.forEach((path) => {
      cy.visit(path);
      cy.url().should("include", "/");
    });

    cy.signOut();
  });

  it("Should redirect user to register page if user is authenticated but not registered and tries to access other page", () => {
    cy.googleSignIn(unregisteredUserJwtMock);

    neutralRoutes.forEach((path) => {
      cy.visit(path);
      cy.url().should("include", "/auth/register");
    });

    authenticatedRoutes.forEach((path) => {
      cy.visit(path);
      cy.url().should("include", "/auth/register");
    });

    unAuthenticatedRoutes.forEach((path) => {
      cy.visit(path);
      cy.url().should("include", "/auth/register");
    });

    cy.signOut();
  });
});
