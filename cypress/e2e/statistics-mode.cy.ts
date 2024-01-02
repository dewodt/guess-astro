import { modes } from "../../lib/constants";
import { getTitleCase } from "../../lib/utils";
import { testUserJwtMock } from "../fixtures/jwt";

describe("Statistics Mode Page", () => {
  before(() => {
    // Non mutating, seed once
    cy.task("db:seed");
    cy.wait(5000);
  });

  beforeEach(() => {
    // Sign in to DB
    cy.googleSignIn(testUserJwtMock);
  });

  const expectedStatistics = {
    constellation: [
      {
        title: "Score",
        value: "13",
      },
      {
        title: "Leaderboard Rank",
        value: "1",
      },
      {
        title: "Accuracy",
        value: "65.00%",
      },
      {
        title: "Match Played",
        value: "20",
      },
      {
        title: "Current Streak",
        value: "0",
      },
      {
        title: "Highest Streak",
        value: "13",
      },
    ],
    messier: [
      {
        title: "Score",
        value: "15",
      },
      {
        title: "Leaderboard Rank",
        value: "1",
      },
      {
        title: "Accuracy",
        value: "75.00%",
      },
      {
        title: "Match Played",
        value: "20",
      },
      {
        title: "Current Streak",
        value: "0",
      },
      {
        title: "Highest Streak",
        value: "15",
      },
    ],
  };

  it("Should render the statistics page successfully", () => {
    modes.forEach((mode) => {
      // Visit the page`
      cy.visit(`/statistics/${mode}`);

      // Sidebar
      cy.get('[data-cy="statistics-sidebar-title"]')
        .should("be.visible")
        .and("have.text", "Statistics");
      cy.get(`[data-cy="statistics-sidebar-${mode}"]`)
        .should("be.visible")
        .should("have.attr", "href", `/statistics/${mode}`)
        .and("have.text", getTitleCase(mode));

      // Main section
      // Statistics Cards
      expectedStatistics[mode].forEach((expectedStat, index) => {
        // Title
        cy.get(
          `[data-cy="statistics-${expectedStat.title
            .replace(" ", "-")
            .toLowerCase()}-title"]`
        )
          .should("be.visible")
          .and("have.text", expectedStat.title);

        // Value
        cy.get(
          `[data-cy="statistics-${expectedStat.title
            .replace(" ", "-")
            .toLowerCase()}-value"]`
        )
          .should("be.visible")
          .and("have.text", expectedStat.value);
      });
    });

    // Chart
    cy.get('[data-cy="statistics-current-year-overview-title"]')
      .should("be.visible")
      .and("have.text", "Current Year Overview");
    cy.get('[data-cy="statistics-current-year-overview-chart"]')
      .find("svg")
      .should("be.visible");
  });
});
