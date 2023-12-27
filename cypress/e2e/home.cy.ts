describe("Home Page", () => {
  // Visit home page before each test
  beforeEach(() => {
    cy.visit("/");
  });

  // Hero section
  it("Successfully render hero section", () => {
    // Title
    cy.get('[data-cy="hero-title"]')
      .should("be.visible")
      .and("have.text", "Memorize Astronomical Object Easily.");

    // Description
    cy.get('[data-cy="hero-description"]')
      .should("be.visible")
      .and(
        "have.text",
        "Here at Guess Astro we help you memorize astronomical objects to prepare for Astronomy National/International Science Olympiad!"
      );

    // Start button
    cy.get('[data-cy="hero-anchor')
      .should("be.visible")
      .should("have.attr", "href", "/play")
      .and("have.text", "Play Now");

    // Image
    cy.get('[data-cy="hero-image"]').should("be.visible");
  });

  // Features section
  it("Successfully render features section", () => {
    // Title
    cy.get('[data-cy="features-title"]')
      .should("be.visible")
      .and("have.text", "Epic Features.");

    // Features
    const expectedFeatures = [
      {
        title: "Various Astronomical Objects",
        description:
          "There are various modes to play with such as constellation and messier mode!",
      },
      {
        title: "Randomized Image Rotation",
        description:
          "The image rotation is randomized so you can't just 'memorize' the image of the object!",
      },
      {
        title: "Leaderboard",
        description:
          "Compete with other players to get the highest score in the leaderboard for different mode!",
      },
      {
        title: "Statistics",
        description:
          "See your statistics like score, current streak, highest streak, rank, accuracy, activity charts, and more!",
      },
      {
        title: "History",
        description:
          "Review your gameplay trajectory effortlessly so that you can analyze the matches you've ever played.",
      },
    ];

    cy.get('[data-cy="features-list"]')
      .children()
      .should("have.length", expectedFeatures.length);

    cy.get('[data-cy="features-list"]')
      .children()
      .each(($el, index) => {
        cy.wrap($el).find("svg").should("be.visible");

        cy.wrap($el)
          .find("h3")
          .should("be.visible")
          .and("have.text", expectedFeatures[index].title);

        cy.wrap($el)
          .find("p")
          .should("be.visible")
          .and("have.text", expectedFeatures[index].description);
      });
  });
});
