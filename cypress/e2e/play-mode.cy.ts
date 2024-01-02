import { modes } from "../../lib/constants";
import { testUserJwtMock } from "../fixtures/jwt";

describe("Play Mode Page", () => {
  beforeEach(() => {
    // Mutating, Seed DB and Sign in to google every tests to prevent conflict
    cy.task("db:seed");
    cy.googleSignIn(testUserJwtMock);
  });

  it("Should render the play mode page successfully", () => {
    modes.forEach((mode) => {
      // Visit the page`
      cy.visit(`/play/${mode}`);

      // Title
      cy.get('[data-cy="play-mode-title"]')
        .should("be.visible")
        .and("have.text", `Guess the ${mode} object!`);

      // Description
      cy.get('[data-cy="play-mode-description"]')
        .should("be.visible")
        .and("have.text", "Select one of the options from the dropdown!");

      // Image
      cy.get('[data-cy="play-mode-image"]').should("be.visible");

      // Form fields
      cy.get('[data-cy="play-mode-popover-label"]')
        .should("be.visible")
        .and("have.text", "Your Answer");
      cy.get('[data-cy="play-mode-popover-trigger"]')
        .should("be.visible")
        .and("not.have.attr", "disabled");

      // Buttons
      cy.get('[data-cy="play-mode-quit"]')
        .should("be.visible")
        .should("have.text", "Quit")
        .and("have.attr", "href", "/play");
      cy.get('[data-cy="play-mode-submit"]')
        .should("be.visible")
        .should("have.text", "Submit")
        .should("have.attr", "type", "submit")
        .and("not.have.attr", "disabled");
    });
  });

  it("Should be able to submit answer successfully", () => {
    modes.forEach((mode) => {
      // Visit
      cy.visit(`/play/${mode}`);

      // Trigger the popover
      cy.get('[data-cy="play-mode-popover-trigger"]').click();

      // Search but not found
      cy.get('[data-cy="play-mode-popover-input"]').type("abcdef");
      cy.get('[data-cy="play-mode-popover-not-found"]', {
        timeout: 7000,
      }).should("be.visible");
      cy.get('[data-cy="play-mode-popover-input"]').clear();

      if (mode === "constellation") {
        // Search and select "orion"
        cy.get('[data-cy="play-mode-popover-input"]').type("orion");
        cy.get('[data-cy="play-mode-popover-option-orion"]').click();
      } else if (mode === "messier") {
        // Search and select "messier 45"
        cy.get('[data-cy="play-mode-popover-input"]').type("messier 45");
        cy.get(
          '[data-cy="play-mode-popover-option-messier-45-(pleiades)"]'
        ).click();
      }

      // Intercept to create loading time
      cy.intercept("POST", `/play/${mode}`, (req) => {
        req.on("response", (res) => {
          res.setDelay(5000);
        });
      }).as("loader");

      // Submit
      cy.get('[data-cy="play-mode-submit"]').click();

      // Loading
      cy.get(".toaster")
        .eq(0)
        .find("[data-title]")
        .and("have.text", "Loading...");
      cy.get('[data-cy="play-mode-popover-trigger"]').should("be.disabled");
      cy.get('[data-cy="play-mode-quit"]').should(
        "have.class",
        "pointer-events-none"
      );
      cy.get('[data-cy="play-mode-submit"]').should("be.disabled");

      // After loading
      // Cannot test correct/icnorrect because game is generated in the server and can't be intercepted by cypress
      cy.wait("@loader");
      cy.get(".toaster")
        .eq(0)
        .find("[data-title]")
        .invoke("text")
        .should("be.oneOf", ["Correct!", "Incorrect!"]);
      cy.get('[data-cy="play-mode-popover-trigger"]').should(
        "have.attr",
        "disabled"
      );
      cy.get('[data-cy="play-mode-quit"]').should(
        "not.have.class",
        "pointer-events-none"
      );
      cy.get('[data-cy="play-mode-next"]')
        .should("be.visible")
        .should("not.be.disabled")
        .and("have.text", "Next");
    });
  });
});
