import { unregisteredUserJwtMock } from "../fixtures/jwt";

describe("Register Page", () => {
  // Sign in the user
  beforeEach(() => {
    cy.googleSignIn(unregisteredUserJwtMock);
    cy.visit("/auth/register");
  });

  it("Should render the register page successfully", () => {
    // Title
    cy.get('[data-cy="register-title"]')
      .should("be.visible")
      .and("have.text", "Register");

    // Avatar
    cy.get('[data-cy="register-avatar-label"]')
      .should("be.visible")
      .and("have.text", "Avatar");
    cy.get('[data-cy="register-avatar-preview"]').should("be.visible");
    cy.get('[data-cy="register-avatar-input"]').should("be.visible");
    cy.get('[data-cy="register-avatar-delete"]').should("be.visible");

    // Email
    cy.get('[data-cy="register-email-label"]')
      .should("be.visible")
      .and("have.text", "Email");
    cy.get('[data-cy="register-email-input"]')
      .should("be.visible")
      .and("have.attr", "disabled");

    // Username
    cy.get('[data-cy="register-username-label"]')
      .should("be.visible")
      .and("have.text", "Username");
    cy.get('[data-cy="register-username-input"]').should("be.visible");

    // Name
    cy.get('[data-cy="register-name-label"]')
      .should("be.visible")
      .and("have.text", "Name");
    cy.get('[data-cy="register-name-input"]').should("be.visible");

    // Button update
    cy.get('[data-cy="register-submit"]')
      .should("be.visible")
      .and("have.text", "Submit");
  });

  it("Should show error when image is wrong format", () => {
    const invalidImageFormat = [
      "cypress/fixtures/images/test-invalid-format-1.gif",
      "cypress/fixtures/images/test-invalid-format-2.svg",
    ];

    // Upload image
    invalidImageFormat.forEach((image) => {
      cy.get('[data-cy="register-avatar-input"]').selectFile(image);
      cy.get('[data-cy="register-avatar-message"]')
        .should("be.visible")
        .and(
          "have.text",
          "Only these types are allowed .jpg, .jpeg, .png and .webp"
        );
    });
  });

  it("Should show error when image is larger than 5 MB", () => {
    const invalidImageSize = [
      "cypress/fixtures/images/test-invalid-size-1.jpg",
      "cypress/fixtures/images/test-invalid-size-2.png",
    ];

    // Upload image
    invalidImageSize.forEach((image) => {
      cy.get('[data-cy="register-avatar-input"]').selectFile(image);
      cy.get('[data-cy="register-avatar-message"]')
        .should("be.visible")
        .and("have.text", "File size should be less than 5 MB");
    });
  });

  it("Should successfully upload image to cloudinary and show preview then delete it", () => {
    const validImages = [
      "cypress/fixtures/images/test-valid-1.jpg",
      "cypress/fixtures/images/test-valid-2.png",
    ];

    validImages.forEach((image) => {
      // Intercept & delay to emphasize loading state
      cy.intercept("POST", "/auth/register", (req) => {
        req.on("response", (res) => {
          res.setDelay(5000);
        });
      }).as("loader");

      // Upload image
      cy.get('[data-cy="register-avatar-input"]').selectFile(image);

      // Loading state
      cy.get(".toaster")
        .eq(0)
        .find("[data-title]")
        .should("have.text", "Loading...");
      cy.get('[data-cy="register-avatar-input"]').should("be.disabled");
      cy.get('[data-cy="register-avatar-delete"]').should("be.disabled");
      cy.get('[data-cy="register-submit"]').should("be.disabled");

      // After loading state
      cy.wait("@loader");
      cy.get(".toaster")
        .eq(0)
        .find("[data-title]")
        .should("have.text", "Success");
      cy.get('[data-cy="register-avatar-preview"]', { timeout: 10000 })
        .find("img")
        .should("have.attr", "src");
      cy.get('[data-cy="register-avatar-input"]').should("not.be.disabled");
      cy.get('[data-cy="register-avatar-delete"]').should("not.be.disabled");
      cy.get('[data-cy="register-submit"]').should("not.be.disabled");

      // Reset image
      cy.get('[data-cy="register-avatar-delete"]').click();
      cy.get('[data-cy="register-avatar-preview"]')
        .find("img")
        .should("not.exist");
    });
  });

  it("Should show error when username is less than 3 characters", () => {
    // Empty
    cy.get('[data-cy="register-submit"]').click();
    cy.get('[data-cy="register-username-message"]')
      .should("be.visible")
      .and("have.text", "Username must be at least 3 characters");

    // Non empty
    const invalidUsernames = ["a", "ab"];
    invalidUsernames.forEach((username) => {
      cy.get('[data-cy="register-username-input"]').type(username);
      cy.get('[data-cy="register-submit"]').click();
      cy.get('[data-cy="register-username-message"]')
        .should("be.visible")
        .and("have.text", "Username must be at least 3 characters");
      cy.get('[data-cy="register-username-input"]').clear();
    });
  });

  it("Should show error when username is more than than 30 characters", () => {
    const invalidUsernames = [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    ];

    invalidUsernames.forEach((username) => {
      cy.get('[data-cy="register-username-input"]').type(username);
      cy.get('[data-cy="register-submit"]').click();
      cy.get('[data-cy="register-username-message"]')
        .should("be.visible")
        .and("have.text", "Username must be at most 30 characters");
      cy.get('[data-cy="register-username-input"]').clear();
    });
  });

  it("Should show error when username contains non alphanumeric characters", () => {
    const invalidUsernames = [
      "test!",
      "test@",
      "test#",
      "test$",
      "test%",
      "愛してます",
    ];

    invalidUsernames.forEach((username) => {
      cy.get('[data-cy="register-username-input"]').type(username);
      cy.get('[data-cy="register-submit"]').click();
      cy.get('[data-cy="register-username-message"]')
        .should("be.visible")
        .and("have.text", "Username can only contain alphanumeric characters");
      cy.get('[data-cy="register-username-input"]').clear();
    });
  });

  it("Should show error when username is not available", () => {
    const invalidUsernames = ["user1", "user2", "user3"];

    invalidUsernames.forEach((username) => {
      // Type
      cy.get('[data-cy="register-username-input"]').type(username);
      cy.get('[data-cy="register-name-input"]').type("foo");

      // Intercept & delay to emphasize loading state
      cy.intercept("POST", "/auth/register", (req) => {
        req.on("response", (res) => {
          res.setDelay(5000);
        });
      }).as("loader");

      // Submit
      cy.get('[data-cy="register-submit"]').click();

      // Loading state
      cy.get(".toaster")
        .eq(0)
        .find("[data-title]")
        .should("have.text", "Loading...");
      cy.get('[data-cy="register-avatar-input"]').should("be.disabled");
      cy.get('[data-cy="register-avatar-delete"]').should("be.disabled");
      cy.get('[data-cy="register-username-input"]').should("be.disabled");
      cy.get('[data-cy="register-name-input"]').should("be.disabled");
      cy.get('[data-cy="register-submit"]').should("be.disabled");

      // Error, After loading
      cy.wait("@loader");
      cy.get(".toaster")
        .eq(0)
        .find("[data-title]")
        .should("have.text", "Error");
      cy.get('[data-cy="register-username-message"]')
        .should("be.visible")
        .and("have.text", `Username "${username}" is not available`);

      // Reset
      cy.get('[data-cy="register-username-input"]').clear();
    });
  });

  it("Should show error when name is empty", () => {
    cy.get('[data-cy="register-submit"]').click();
    cy.get('[data-cy="register-name-message"]')
      .should("be.visible")
      .and("have.text", "Name is required");
  });

  // The only successfull submit (prevent conflict)
  it("Should be able to register successfully", () => {
    // Intercept & delay to emphasize loading state
    cy.intercept("POST", "/auth/register", (req) => {
      req.on("response", (res) => {
        res.setDelay(5000);
      });
    }).as("imageLoader");

    // Upload image
    cy.get('[data-cy="register-avatar-input"]').selectFile(
      "cypress/fixtures/images/test-valid-1.jpg"
    );

    // Loading state
    cy.get(".toaster")
      .eq(0)
      .find("[data-title]")
      .should("have.text", "Loading...");
    cy.get('[data-cy="register-avatar-input"]').should("be.disabled");
    cy.get('[data-cy="register-avatar-delete"]').should("be.disabled");
    cy.get('[data-cy="register-submit"]').should("be.disabled");

    // After loading state
    cy.wait("@imageLoader");
    cy.get(".toaster")
      .eq(0)
      .find("[data-title]")
      .should("have.text", "Success");
    cy.get('[data-cy="register-avatar-preview"]', { timeout: 10000 })
      .find("img")
      .should("have.attr", "src");
    cy.get('[data-cy="register-avatar-input"]').should("not.be.disabled");
    cy.get('[data-cy="register-avatar-delete"]').should("not.be.disabled");
    cy.get('[data-cy="register-submit"]').should("not.be.disabled");

    // Type username
    cy.get('[data-cy="register-username-input"]').type("newUsername");

    // Type name
    cy.get('[data-cy="register-name-input"]').type("New Username");

    // Intercept & delay to emphasize loading state
    cy.intercept("POST", "/auth/register", (req) => {
      req.on("response", (res) => {
        res.setDelay(5000);
      });
    }).as("registerLoader");

    // Submit
    cy.get('[data-cy="register-submit"]').click();

    // Loading state
    cy.get(".toaster")
      .eq(0)
      .find("[data-title]")
      .should("have.text", "Loading...");
    cy.get('[data-cy="register-avatar-input"]').should("be.disabled");
    cy.get('[data-cy="register-avatar-delete"]').should("be.disabled");
    cy.get('[data-cy="register-username-input"]').should("be.disabled");
    cy.get('[data-cy="register-name-input"]').should("be.disabled");
    cy.get('[data-cy="register-submit"]').should("be.disabled");

    // After loading state
    cy.wait("@registerLoader");
    cy.get(".toaster")
      .eq(0)
      .find("[data-title]")
      .should("have.text", "Success");
    cy.url().should("include", "/"); // Redirected to home page
  });
});
