describe("Play Page", () => {
  beforeEach(() => {
    cy.visit("/play");
  });

  it("Should render play page successfully", () => {
    cy.get('[data-cy="play-title"]')
      .should("be.visible")
      .and("have.text", "Choose Gamemode!");

    cy.get('[data-cy="play-description"]')
      .should("be.visible")
      .and(
        "have.text",
        "You can choose between multiple gamemode to memorize different astronomical objects."
      );

    const expectedOptions = [
      {
        href: "/play/constellation",
        title: "Constellation",
        description: "Memorize the name of the constellations and their shape",
      },
      {
        href: "/play/messier",
        title: "Messier",
        description: "Memorize the name of the messier objects",
      },
    ];

    cy.get('[data-cy="play-options"]')
      .children()
      .should("have.length", expectedOptions.length);

    cy.get('[data-cy="play-options"]')
      .children()
      .each(($el, index) => {
        cy.wrap($el).should("have.attr", "href", expectedOptions[index].href);
        cy.wrap($el).find("img").should("be.visible");
        cy.wrap($el)
          .find("h3")
          .should("be.visible")
          .and("have.text", expectedOptions[index].title);
        cy.wrap($el)
          .find("p")
          .should("be.visible")
          .and("have.text", expectedOptions[index].description);
      });
  });

  it("Should redirect to login page if user is not logged in and clicked one of the mode", () => {
    for (let i = 0; i < 2; i++) {
      cy.get('[data-cy="play-options"]')
        .children()
        .eq(0)
        .click({ force: true });
      cy.url().should("include", "/auth/sign-in");
      cy.go("back");
    }
  });

  it("Should redirect to game page if user is logged in and clicked one of the mode", () => {
    // To do: mock login
  });
});
