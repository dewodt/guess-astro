import { modes } from "../../lib/constants";
import { testUserJwtMock } from "../fixtures/jwt";
import { matchSeed } from "../fixtures/match";
import { getFormattedDate, getTitleCase } from "./../../lib/utils";

describe("History Mode Page", () => {
  // Non mutating page, once is enough
  before(() => {
    // Seed database (include reset) once
    cy.task("db:seed");
    cy.wait(5000);
  });

  beforeEach(() => {
    // Login to google every tests
    cy.googleSignIn(testUserJwtMock);
  });

  // Default (no filters) expected after render
  const expectedHistoryModes = {
    constellation: matchSeed
      .filter(
        (match) =>
          match.mode === "constellation" &&
          match.userId === "74607127-c007-4a95-bb74-857e931a205f"
      )
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()),
    messier: matchSeed
      .filter(
        (match) =>
          match.mode === "messier" &&
          match.userId === "74607127-c007-4a95-bb74-857e931a205f"
      )
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()),
  };

  it("Should render the history page successfully", () => {
    modes.forEach((mode) => {
      cy.visit(`/history/${mode}`);

      // Sidebar
      cy.get('[data-cy="history-sidebar-title"]')
        .should("be.visible")
        .and("have.text", "History");
      cy.get(`[data-cy="history-sidebar-${mode}"]`)
        .should("be.visible")
        .should("have.attr", "href", `/history/${mode}`)
        .and("have.text", getTitleCase(mode));

      // Main section
      cy.get(`[data-cy="history-title"`).should(
        "have.text",
        `${getTitleCase(mode)} Mode`
      );

      // Toolbar
      cy.get('[data-cy="history-date-picker-trigger"]').should("be.visible");
      cy.get('[data-cy="history-faceted-filter-trigger"]').should("be.visible");

      // Table
      cy.get('[data-cy="history-table"]').should("be.visible");
      // Table Row
      for (let i = 0; i < 10; i++) {
        // Only show first 10 rows
        // Table Column
        for (let j = 0; j < 2; j++) {
          if (j == 0) {
            cy.get(`[data-cy="history-table-body-${i}-${j}"]`)
              .should("be.visible")
              .and(
                "have.text",
                getFormattedDate(
                  expectedHistoryModes[mode][i]["createdAt"] as Date
                )
              );
          } else {
            cy.get(`[data-cy="history-table-body-${i}-${j}"]`)
              .should("be.visible")
              .and(
                "have.text",
                getTitleCase(expectedHistoryModes[mode][i]["result"])
              );
          }
        }
      }

      // Bottom pagination
      cy.get('[data-cy="history-table-rows-per-page-text"]')
        .should("be.visible")
        .and("have.text", "Rows per page");
      cy.get('[data-cy="history-table-rows-per-page-trigger"]').should(
        "be.visible"
      );
      cy.get('[data-cy="history-table-page-of"]')
        .should("be.visible")
        .and("have.text", "Page 1 of 2"); // Based on seeded test case values
      cy.get('[data-cy="history-button-previous-page"]').should("be.visible");
      cy.get('[data-cy="history-button-next-page"]').should("be.visible");
    });
  });

  it("Should filter by date range and reset successfully", () => {
    modes.forEach((mode) => {
      // Visit page
      cy.visit(`/history/${mode}`);

      // Trigger date filter
      // Filter from 8 to 15 current month & year
      cy.get('[data-cy="history-date-picker-trigger"]').click();
      cy.get('[data-cy="history-date-picker-calendar"]').contains("8").click();
      cy.get('[data-cy="history-date-picker-calendar"]').contains("15").click();
      cy.get('[data-cy="history-title"]').click();

      // Get filtered data
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const filteredDataMode = expectedHistoryModes[mode].filter(
        (match) =>
          match.createdAt!.getTime() >=
            new Date(currentYear, currentMonth, 8).getTime() &&
          match.createdAt!.getTime() <=
            new Date(currentYear, currentMonth, 15 + 1).getTime() // + 1 Because it's inclusive
      );
      const firstPageCount =
        filteredDataMode.length < 10 ? filteredDataMode.length : 10;

      // Check table data
      // Table Row
      for (let i = 0; i < firstPageCount; i++) {
        // Table Column
        for (let j = 0; j < 2; j++) {
          if (j == 0) {
            cy.get(`[data-cy="history-table-body-${i}-${j}"]`, {
              timeout: 10000,
            })
              .should("be.visible")
              .and(
                "have.text",
                getFormattedDate(filteredDataMode[i]["createdAt"] as Date)
              );
          } else {
            cy.get(`[data-cy="history-table-body-${i}-${j}"]`, {
              timeout: 10000,
            })
              .should("be.visible")
              .and("have.text", getTitleCase(filteredDataMode[i]["result"]));
          }
        }
      }

      // Check url
      cy.url().should("include", `createdAt=`);

      // Reset filter
      cy.get('[data-cy="history-reset-filters"]').click();
      cy.url()
        .should("not.include", "result=")
        .and("not.include", "createdAt=");
    });
  });

  it("Should filter by result and reset successfully", () => {
    modes.forEach((mode) => {
      // Visit page
      cy.visit(`/history/${mode}`);

      // Trigger faceted filter
      // Filter only correct
      cy.get('[data-cy="history-faceted-filter-trigger"]').click();
      cy.get('[data-cy="history-faceted-filter-trigger"]').click();
      cy.get('[data-cy="history-faceted-filter-option-correct"]').click();
      cy.get('[data-cy="history-title"]').click();

      // Get filtered data
      const filteredDataMode = expectedHistoryModes[mode].filter(
        (match) => match.result === "correct"
      );
      const firstPageCount =
        filteredDataMode.length < 10 ? filteredDataMode.length : 10;

      // Check table data
      // Table Row
      for (let i = 0; i < firstPageCount; i++) {
        // Table Column
        for (let j = 0; j < 2; j++) {
          if (j == 0) {
            cy.get(`[data-cy="history-table-body-${i}-${j}"]`, {
              timeout: 10000,
            })
              .should("be.visible")
              .and(
                "have.text",
                getFormattedDate(filteredDataMode[i]["createdAt"] as Date)
              );
          } else {
            cy.get(`[data-cy="history-table-body-${i}-${j}"]`, {
              timeout: 10000,
            })
              .should("be.visible")
              .and("have.text", getTitleCase(filteredDataMode[i]["result"]));
          }
        }
      }

      // Check url
      cy.url().should("include", "result=correct");

      // Reset filter
      cy.get('[data-cy="history-reset-filters"]').click();
      cy.url()
        .should("not.include", "result=")
        .and("not.include", "createdAt=");
    });
  });

  it("Should sort by date successfully", () => {
    modes.forEach((mode) => {
      // Visit page
      cy.visit(`/history/${mode}`);

      // Trigger date sort ascending (default is descending)
      cy.get('[data-cy="history-sort-trigger"]').click();
      cy.get('[data-cy="history-sort-ascending"]').click();

      // Get sorted data
      const sortedDataMode = [...expectedHistoryModes[mode]].sort(
        (a, b) => a.createdAt!.getTime() - b.createdAt!.getTime()
      );
      const firstPageCount =
        sortedDataMode.length < 10 ? sortedDataMode.length : 10;

      // Check table data
      // Table Row
      for (let i = 0; i < firstPageCount; i++) {
        // Table Column
        for (let j = 0; j < 2; j++) {
          if (j == 0) {
            cy.get(`[data-cy="history-table-body-${i}-${j}"]`, {
              timeout: 10000,
            })
              .should("be.visible")
              .and(
                "have.text",
                getFormattedDate(sortedDataMode[i]["createdAt"] as Date)
              );
          } else {
            cy.get(`[data-cy="history-table-body-${i}-${j}"]`, {
              timeout: 10000,
            })
              .should("be.visible")
              .and("have.text", getTitleCase(sortedDataMode[i]["result"]));
          }
        }
      }

      // Check url
      cy.url().should("include", "sort=createdAt.asc");
    });
  });

  // Can't click on popup menu
  it.skip("Should rows per page successfully", () => {
    modes.forEach((mode) => {
      // Visit page
      cy.visit(`/history/${mode}`);

      // Trigger rows per page
      cy.get('[data-cy="history-table-rows-per-page-trigger"]').click();
      cy.get('[data-cy="history-table-rows-per-page-option-20"]').click();

      // Get filtered data
      const filteredDataMode = expectedHistoryModes[mode];
      const firstPageCount =
        filteredDataMode.length < 20 ? filteredDataMode.length : 20;

      // Check table data
      // Table Row
      for (let i = 0; i < firstPageCount; i++) {
        // Table Column
        for (let j = 0; j < 2; j++) {
          if (j == 0) {
            cy.get(`[data-cy="history-table-body-${i}-${j}"]`, {
              timeout: 10000,
            })
              .should("be.visible")
              .and(
                "have.text",
                getFormattedDate(filteredDataMode[i]["createdAt"] as Date)
              );
          } else {
            cy.get(`[data-cy="history-table-body-${i}-${j}"]`, {
              timeout: 10000,
            })
              .should("be.visible")
              .and("have.text", getTitleCase(filteredDataMode[i]["result"]));
          }
        }
      }

      // Check url
      cy.url().should("include", "per_page=20");
    });
  });

  it("Should paginate successfully", () => {
    modes.forEach((mode) => {
      // Visit page
      cy.visit(`/history/${mode}`);

      // Note; Test case have 2 page for 10 rows per page
      // Get filtered data from 0 - 9
      const filteredDataMode = expectedHistoryModes[mode];

      // Row
      for (let i = 0; i < 10; i++) {
        // Table Column
        for (let j = 0; j < 2; j++) {
          if (j == 0) {
            cy.get(`[data-cy="history-table-body-${i}-${j}"]`, {
              timeout: 10000,
            })
              .should("be.visible")
              .and(
                "have.text",
                getFormattedDate(filteredDataMode[i]["createdAt"] as Date)
              );
          } else {
            cy.get(`[data-cy="history-table-body-${i}-${j}"]`, {
              timeout: 10000,
            })
              .should("be.visible")
              .and("have.text", getTitleCase(filteredDataMode[i]["result"]));
          }
        }
      }

      // Page text
      cy.get('[data-cy="history-table-page-of"]').should(
        "have.text",
        "Page 1 of 2"
      );

      // Check url
      cy.url().should("include", "page=1");

      // Go to next page
      cy.get('[data-cy="history-button-next-page"]').click();

      // Get filtered data from 10 - finish
      // Row
      for (let i = 10; i < filteredDataMode.length; i++) {
        // Table Column
        for (let j = 0; j < 2; j++) {
          if (j == 0) {
            cy.get(`[data-cy="history-table-body-${i - 10}-${j}"]`, {
              timeout: 10000,
            })
              .should("be.visible")
              .and(
                "have.text",
                getFormattedDate(filteredDataMode[i]["createdAt"] as Date)
              );
          } else {
            cy.get(`[data-cy="history-table-body-${i - 10}-${j}"]`, {
              timeout: 10000,
            })
              .should("be.visible")
              .and("have.text", getTitleCase(filteredDataMode[i]["result"]));
          }
        }
      }

      // Page text
      cy.get('[data-cy="history-table-page-of"]').should(
        "have.text",
        "Page 2 of 2"
      );

      // Check url
      cy.url().should("include", "page=2");
    });
  });

  it("Should combined successfully", () => {
    // Filter from 8 to 15 current month & year and correct and sorted ascending
    modes.forEach((mode) => {
      // Visit page
      cy.visit(`/history/${mode}`);

      // Trigger faceted filter
      // Filter only correct
      cy.get('[data-cy="history-faceted-filter-trigger"]').click();
      cy.get('[data-cy="history-faceted-filter-option-correct"]').click();
      cy.get('[data-cy="history-title"]').click();

      // Trigger date filter
      // Filter from 8 to 15 current month & year
      cy.get('[data-cy="history-date-picker-trigger"]').click();
      cy.get('[data-cy="history-date-picker-calendar"]').contains("8").click();
      cy.get('[data-cy="history-date-picker-calendar"]').contains("15").click();
      cy.get('[data-cy="history-title"]').click();

      // Trigger date sort ascending (default is descending)
      cy.get('[data-cy="history-sort-trigger"]').click();
      cy.get('[data-cy="history-sort-ascending"]').click();

      // Get filtered data
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const filteredDataMode = expectedHistoryModes[mode]
        .filter(
          (match) =>
            match.createdAt!.getTime() >=
              new Date(currentYear, currentMonth, 8).getTime() &&
            match.createdAt!.getTime() <=
              new Date(currentYear, currentMonth, 15 + 1).getTime() && // + 1 Because it's inclusive
            match.result === "correct"
        )
        .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
      const firstPageCount =
        filteredDataMode.length < 10 ? filteredDataMode.length : 10;

      // Check table data
      // Table Row
      for (let i = 0; i < firstPageCount; i++) {
        // Table Column
        for (let j = 0; j < 2; j++) {
          if (j == 0) {
            cy.get(`[data-cy="history-table-body-${i}-${j}"]`, {
              timeout: 10000,
            })
              .should("be.visible")
              .and(
                "have.text",
                getFormattedDate(filteredDataMode[i]["createdAt"] as Date)
              );
          } else {
            cy.get(`[data-cy="history-table-body-${i}-${j}"]`, {
              timeout: 10000,
            })
              .should("be.visible")
              .and("have.text", getTitleCase(filteredDataMode[i]["result"]));
          }
        }
      }

      // Check url
      cy.url()
        .should("include", "result=correct")
        .and("include", "createdAt=")
        .and("include", "sort=createdAt.asc");

      // Reset filter
      cy.get('[data-cy="history-reset-filters"]').click();
      cy.url()
        .should("not.include", "result=")
        .and("not.include", "createdAt=");
    });
  });
});
