describe("About Page", () => {
  // Visit about page before each test
  beforeEach(() => {
    cy.visit("/about");
  });

  it("Successfully render about page", () => {
    // Mission
    cy.get('[data-cy="mission-title"]')
      .should("be.visible")
      .and("have.text", "Mission");
    cy.get('[data-cy="mission-description"]')
      .should("be.visible")
      .and(
        "have.text",
        "Help students memorize astronomical objects to prepare for astronomy national/international science olympiad."
      );

    // Contact
    cy.get('[data-cy="contact-title"]')
      .should("be.visible")
      .and("have.text", "Contact");
    cy.get('[data-cy="contact-description"]')
      .should("be.visible")
      .and(
        "have.text",
        "This app is open source. If you have any feedback, suggestion, inquiries, or anything you want to tell me, please feel free to contact me at this email."
      );
    cy.get('[data-cy="contact-repo"]').should(
      "have.attr",
      "href",
      "https://github.com/dewodt/guess-astro"
    );
    cy.get('[data-cy="contact-email"]').should(
      "have.attr",
      "href",
      "mailto:dewantorotriatmojo@gmail.com"
    );
  });
});
