import { jwtObjectMock } from "../fixtures/jwt";
import "cypress-v10-preserve-cookie";
import { encode } from "next-auth/jwt";

Cypress.Commands.add("googleSignIn", () => {
  cy.session("74607127-c007-4a95-bb74-857e931a205f", async () => {
    // Decode jwt object to string
    const jwtStr = await encode({
      token: jwtObjectMock,
      secret: Cypress.env("NEXTAUTH_SECRET"),
    });

    // Set cookie
    cy.setCookie("next-auth.session-token", jwtStr, {
      path: "/",
      expiry: Math.floor(Date.now() / 1000) + 24 * 3600,
      httpOnly: true,
      sameSite: "lax",
    });
    cy.preserveCookieOnce("next-auth.session-token");

    // on visit, the cookie is cleared after the next-auth call
    // since we already have the cookie set, we can stub out the next-auth call
    // cy.intercept("/api/auth/session", { status: 200 }).as("next-auth-stub");
    cy.visit("/");
  });
});

Cypress.Commands.add("signOut", () => {
  cy.clearCookie("next-auth.session-token");
});

declare global {
  namespace Cypress {
    interface Chainable {
      googleSignIn(): void;
      signOut(): void;
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
