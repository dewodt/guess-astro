import { testUserJwtMock } from "../fixtures/jwt";

describe("Sign In Page", () => {
  beforeEach(() => {
    cy.visit("/auth/sign-in");
  });

  it("Should render sign in page successfully", () => {
    cy.get('[data-cy="sign-in-title"]')
      .should("be.visible")
      .and("have.text", "Sign In");

    cy.get('[data-cy="sign-in-email-label"]').should("be.visible");
    cy.get('[data-cy="sign-in-email-input"]').should("be.visible");

    cy.get('[data-cy="sign-in-email-button"]')
      .should("be.visible")
      .and("have.text", "Continue with Email");

    cy.get('[data-cy="sign-in-separator"]').should("be.visible");

    cy.get('[data-cy="sign-in-google-button"]')
      .should("be.visible")
      .and("have.text", "Continue with Google");

    cy.get('[data-cy="sign-in-discord-button"]')
      .should("be.visible")
      .and("have.text", "Continue with Discord");
  });

  it("Should trigger required when using email sign in", () => {
    // Required email
    cy.get('[data-cy="sign-in-email-button"]').click();
    cy.get('[data-cy="sign-in-email-button"]').click();
    cy.get('[data-cy="sign-in-email-message"]').should("have.text", "Required");
  });

  it("Should trigger invalid email when using email sign in", () => {
    // Invalid email
    cy.get('[data-cy="sign-in-email-input"]').should(
      "not.have.attr",
      "disabled"
    );
    cy.get('[data-cy="sign-in-email-input"]').type("foo@s");
    cy.get('[data-cy="sign-in-email-button"]').click();
    cy.get('[data-cy="sign-in-email-message"]').should(
      "have.text",
      "Invalid email"
    );
  });

  it("Should input email successfully", () => {
    // Valid email
    cy.get('[data-cy="sign-in-email-input"]').should(
      "not.have.attr",
      "disabled"
    );
    cy.get('[data-cy="sign-in-email-input"]').type("testuserdewodt@gmail.com");
    cy.get('[data-cy="sign-in-email-button"]').click();
    cy.get(".toaster")
      .eq(0)
      .find("[data-title]")
      .and("have.text", "Loading...");
    cy.get('[data-cy="sign-in-email-button"]').should("be.disabled");
    cy.get('[data-cy="sign-in-google-button"]').should("be.disabled");
    cy.get('[data-cy="sign-in-discord-button"]').should("be.disabled");
    cy.url({ timeout: 30000 }).should("include", "/auth/verify-request");
    cy.get(".toaster", { timeout: 30000 })
      .eq(0)
      .find("[data-title]")
      .and("have.text", "Success");
  });

  it("Should redirect user to home when user is already signed in", () => {
    // Mock login
    cy.googleSignIn(testUserJwtMock);

    // Visit sign in page
    cy.visit("/auth/sign-in");

    // Redirected back to home
    cy.url().should("include", "/");
  });
});
