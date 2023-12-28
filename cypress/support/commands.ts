import "cypress-v10-preserve-cookie";

Cypress.Commands.add("googleLogin", () => {
  cy.log("Logging in to Google");

  return cy
    .request({
      method: "POST",
      url: "https://www.googleapis.com/oauth2/v4/token",
      body: {
        grant_type: "refresh_token",
        client_id: Cypress.env("GOOGLE_CLIENT_ID"),
        client_secret: Cypress.env("GOOGLE_CLIENT_SECRET"),
        refresh_token: Cypress.env("GOOGLE_REFRESH_TOKEN"),
      },
    })
    .then(({ body }) => {
      const { id_token } = body;

      cy.setCookie("next-auth.session-token", id_token, {
        path: "/",
        expiry: Math.floor(Date.now() / 1000) + 24 * 3600,
        httpOnly: true,
        sameSite: "lax",
      });
      cy.preserveCookieOnce("next-auth.session-token");

      // on visit, the cookie is cleared after the next-auth call
      // since we already have the cookie set, we can stub out the next-auth call
      cy.intercept("/api/auth/session", { status: 200 }).as("next-auth-stub");
      return cy.visit("/");
    });
});

Cypress.Commands.add("stubLogin", () => {
  cy.intercept("/api/auth/session", { fixture: "auth-session.json" }).as(
    "session"
  );

  cy.setCookie(
    "next-auth.session-token",
    "a valid cookie from your browser session"
  );

  cy.preserveCookieOnce("next-auth.session-token"); // works without this, for now
  cy.visit("/");
  cy.wait("@session");
});

declare global {
  namespace Cypress {
    interface Chainable {
      googleLogin(): Chainable<Cypress.AUTWindow>;
      stubLogin(): void;
    }
  }
}

/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
