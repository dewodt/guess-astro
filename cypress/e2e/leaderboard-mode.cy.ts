import { modes } from "../../lib/constants";
import { getFormattedDate, getTitleCase } from "./../../lib/utils";
import { userSeed } from "./../fixtures/user";

describe("Leaderboard Mode Page", () => {
  before(() => {
    cy.task("db:seed");
  });

  // Expected leaderboard data from the seed
  const expectedLeaderboard = {
    constellation: [
      {
        rank: "1",
        username: "testuser",
        score: "13",
        ...userSeed.find((user) => user.username === "testuser"),
      },
      {
        rank: "2",
        username: "user1",
        score: "5",
        ...userSeed.find((user) => user.username === "user1"),
      },
      {
        rank: "3",
        username: "user2",
        score: "4",
        ...userSeed.find((user) => user.username === "user2"),
      },
      {
        rank: "4",
        username: "user3",
        score: "3",
        ...userSeed.find((user) => user.username === "user3"),
      },
      {
        rank: "5",
        username: "user4",
        score: "2",
        ...userSeed.find((user) => user.username === "user4"),
      },
      {
        rank: "6",
        username: "user6",
        score: "0",
        ...userSeed.find((user) => user.username === "user6"),
      },
      {
        rank: "7",
        username: "user11",
        score: "0",
        ...userSeed.find((user) => user.username === "user11"),
      },
      {
        rank: "8",
        username: "user12",
        score: "0",
        ...userSeed.find((user) => user.username === "user12"),
      },
      {
        rank: "9",
        username: "user10",
        score: "0",
        ...userSeed.find((user) => user.username === "user10"),
      },
      {
        rank: "10",
        username: "user9",
        score: "0",
        ...userSeed.find((user) => user.username === "user9"),
      },
    ],
    messier: [
      {
        rank: "1",
        username: "testuser",
        score: "15",
        ...userSeed.find((user) => user.username === "testuser"),
      },
      {
        rank: "2",
        username: "user5",
        score: "5",
        ...userSeed.find((user) => user.username === "user5"),
      },
      {
        rank: "3",
        username: "user6",
        score: "4",
        ...userSeed.find((user) => user.username === "user6"),
      },
      {
        rank: "4",
        username: "user7",
        score: "3",
        ...userSeed.find((user) => user.username === "user7"),
      },
      {
        rank: "5",
        username: "user8",
        score: "2",
        ...userSeed.find((user) => user.username === "user8"),
      },
      {
        rank: "6",
        username: "user12",
        score: "0",
        ...userSeed.find((user) => user.username === "user12"),
      },
      {
        rank: "7",
        username: "user4",
        score: "0",
        ...userSeed.find((user) => user.username === "user4"),
      },
      {
        rank: "8",
        username: "user10",
        score: "0",
        ...userSeed.find((user) => user.username === "user10"),
      },
      {
        rank: "9",
        username: "user9",
        score: "0",
        ...userSeed.find((user) => user.username === "user9"),
      },
      {
        rank: "10",
        username: "user3",
        score: "0",
        ...userSeed.find((user) => user.username === "user3"),
      },
    ],
  };

  it("Should render the leaderboard page successfully", () => {
    modes.forEach((mode) => {
      // Visit the leaderboard page
      cy.visit(`/leaderboard/${mode}`);

      // Sidebar
      cy.get(`[data-cy="leaderboard-sidebar-${mode}"]`)
        .should("be.visible")
        .should("have.attr", "href", `/leaderboard/${mode}`)
        .and("have.text", getTitleCase(mode));

      // Main section
      // Title
      cy.get(`[data-cy="leaderboard-title"]`)
        .should("be.visible")
        .should("have.text", getTitleCase(`${mode} Mode`));

      // Table Header
      cy.get(`[data-cy="leaderboard-table-header-0"]`)
        .should("be.visible")
        .and("have.text", "Rank");
      cy.get(`[data-cy="leaderboard-table-header-1"]`)
        .should("be.visible")
        .and("have.text", "Username");
      cy.get(`[data-cy="leaderboard-table-header-2"]`)
        .should("be.visible")
        .and("have.text", "Score");

      // Table Body
      for (let i = 0; i < 10; i++) {
        cy.get(`[data-cy="leaderboard-table-body-${i}-0"]`)
          .should("be.visible")
          .and("have.text", expectedLeaderboard[mode][i]["rank"]);
        cy.get(`[data-cy="leaderboard-table-body-${i}-1"]`)
          .should("be.visible")
          .and("have.text", expectedLeaderboard[mode][i]["username"]);
        cy.get(`[data-cy="leaderboard-table-body-${i}-2"]`)
          .should("be.visible")
          .and("have.text", expectedLeaderboard[mode][i]["score"]);
      }
    });
  });

  it.only("Should render modal and intercept route successfully when table row is clicked", () => {
    modes.forEach((mode) => {
      // Visit the leaderboard page
      cy.visit(`/leaderboard/${mode}`);

      for (let i = 0; i < 10; i++) {
        // Click on each row
        cy.get(`[data-cy="leaderboard-table-body-${i}"]`).click({
          force: true,
        });

        // Modal
        cy.get(`[data-cy="leaderboard-modal"]`, { timeout: 15000 }).should(
          "be.visible"
        );

        // Title
        cy.get(`[data-cy="leaderboard-modal-title"]`)
          .should("be.visible")
          .and("have.text", "User Detail");

        // Avatar
        cy.get(`[data-cy="leaderboard-modal-avatar"]`).should("be.visible");
        if (expectedLeaderboard[mode][i]["image"] !== null) {
          cy.get(`[data-cy="leaderboard-modal-avatar"]`)
            .find("img")
            .should("have.attr", "src", expectedLeaderboard[mode][i]["image"]);
        }

        // Username
        cy.get(`[data-cy="leaderboard-modal-username-title"]`)
          .should("be.visible")
          .and("have.text", "Username");
        cy.get(`[data-cy="leaderboard-modal-username-detail"]`)
          .should("be.visible")
          .and("have.text", expectedLeaderboard[mode][i]["username"]);

        // Name
        cy.get(`[data-cy="leaderboard-modal-name-title"]`)
          .should("be.visible")
          .and("have.text", "Name");
        cy.get(`[data-cy="leaderboard-modal-name-detail"]`)
          .should("be.visible")
          .and("have.text", expectedLeaderboard[mode][i]["name"]);

        // Signed up at
        cy.get(`[data-cy="leaderboard-modal-signed-up-at-title"]`)
          .should("be.visible")
          .and("have.text", "Signed up at");
        cy.get(`[data-cy="leaderboard-modal-signed-up-at-detail"]`)
          .should("be.visible")
          .and(
            "have.text",
            getFormattedDate(expectedLeaderboard[mode][i]["createdAt"] as Date)
          );

        // Intercept Url
        cy.url().should(
          "include",
          `/user/${expectedLeaderboard[mode][i]["username"]}`
        );

        // Close modal
        cy.get(`[data-cy="leaderboard-modal"]`)
          .find("button")
          .contains("Close")
          .click({ force: true });

        // Default URL
        cy.url().should("include", `/leaderboard/${mode}`);
      }
    });
  });
});
