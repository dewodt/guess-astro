import { testUserJwtMock } from "../fixtures/jwt";

describe("Settings Profile Page", () => {
  // Sign in the user
  beforeEach(() => {
    cy.googleSignIn(testUserJwtMock);
    cy.visit("/settings/profile");
  });

  it("Should render the settings profile page successfully", () => {
    // Sidebar
    cy.get('[data-cy="settings-sidebar-title"]')
      .should("be.visible")
      .and("have.text", "Settings");
    cy.get('[data-cy="settings-sidebar-profile"]')
      .should("be.visible")
      .should("have.text", "Profile")
      .and("have.attr", "href", "/settings/profile");

    // Title
    cy.get('[data-cy="settings-profile-title"]')
      .should("be.visible")
      .and("have.text", "Profile");

    // Avatar
    cy.get('[data-cy="settings-profile-avatar-label"]')
      .should("be.visible")
      .and("have.text", "Avatar");
    cy.get('[data-cy="settings-profile-avatar-preview"]')
      .find("img")
      .should("be.visible")
      .and(
        "have.attr",
        "src",
        "https://lh3.googleusercontent.com/a/ACg8ocJ70HlfjYNMiVhMcL39qTKVmQBMBUpjmsEHWWq5qCrL=s288-c-no"
      ); // Default value from session
    cy.get('[data-cy="settings-profile-avatar-input"]').should("be.visible");
    cy.get('[data-cy="settings-profile-avatar-delete"]').should("be.visible");

    // Email
    cy.get('[data-cy="settings-profile-email-label"]')
      .should("be.visible")
      .and("have.text", "Email");
    cy.get('[data-cy="settings-profile-email-input"]')
      .should("be.visible")
      .should("have.value", "testuserdewodt@gmail.com") // Default value from session
      .and("have.attr", "disabled");

    // Username
    cy.get('[data-cy="settings-profile-username-label"]')
      .should("be.visible")
      .and("have.text", "Username");
    cy.get('[data-cy="settings-profile-username-input"]')
      .should("be.visible")
      .and("have.value", "testuser"); // Default value from session

    // Name
    cy.get('[data-cy="settings-profile-name-label"]')
      .should("be.visible")
      .and("have.text", "Name");
    cy.get('[data-cy="settings-profile-name-input"]')
      .should("be.visible")
      .and("have.value", "Test User"); // Default value from session

    // Button update
    cy.get('[data-cy="settings-profile-submit"]')
      .should("be.visible")
      .and("have.text", "Update");
  });

  it("Should show error when image is wrong format", () => {
    const invalidImageFormat = [
      "cypress/fixtures/images/test-invalid-format-1.gif",
      "cypress/fixtures/images/test-invalid-format-2.svg",
    ];

    // Upload image
    invalidImageFormat.forEach((image) => {
      cy.get('[data-cy="settings-profile-avatar-input"]').selectFile(image);
      cy.get('[data-cy="settings-profile-avatar-message"]')
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
      cy.get('[data-cy="settings-profile-avatar-input"]').selectFile(image);
      cy.get('[data-cy="settings-profile-avatar-message"]')
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
      cy.intercept("POST", "/settings/profile", (req) => {
        req.on("response", (res) => {
          res.setDelay(5000);
        });
      }).as("loader");

      // Upload image
      cy.get('[data-cy="settings-profile-avatar-input"]').selectFile(image);

      // Loading state
      cy.get(".toaster")
        .eq(0)
        .find("[data-title]")
        .should("have.text", "Loading...");
      cy.get('[data-cy="settings-profile-avatar-input"]').should("be.disabled");
      cy.get('[data-cy="settings-profile-avatar-delete"]').should(
        "be.disabled"
      );
      cy.get('[data-cy="settings-profile-submit"]').should("be.disabled");

      // After loading state
      cy.wait("@loader").then((interception) => {
        const body = interception.response!.body as string;
        const idx = body.indexOf("https://res.cloudinary.com");
        const interceptedImageUrl = body.slice(idx, body.length - 2);

        // Assert src
        cy.get('[data-cy="settings-profile-avatar-preview"]', {
          timeout: 10000,
        })
          .find("img")
          .should("have.attr", "src", interceptedImageUrl);
      });
      cy.get(".toaster")
        .eq(0)
        .find("[data-title]")
        .should("have.text", "Success");
      cy.get('[data-cy="settings-profile-avatar-input"]').should(
        "not.be.disabled"
      );
      cy.get('[data-cy="settings-profile-avatar-delete"]').should(
        "not.be.disabled"
      );
      cy.get('[data-cy="settings-profile-submit"]').should("not.be.disabled");

      // Reset image
      cy.get('[data-cy="settings-profile-avatar-delete"]').click();
      cy.get('[data-cy="settings-profile-avatar-preview"]')
        .find("img")
        .should("not.exist");
    });
  });

  it("Should show error when username is less than 3 characters", () => {
    // Clear username
    cy.get('[data-cy="settings-profile-username-input"]').clear();
    cy.get('[data-cy="settings-profile-submit"]').click();
    cy.get('[data-cy="settings-profile-username-message"]')
      .should("be.visible")
      .and("have.text", "Username must be at least 3 characters");

    // Non empty
    const invalidUsernames = ["a", "ab"];
    invalidUsernames.forEach((username) => {
      cy.get('[data-cy="settings-profile-username-input"]').clear();
      cy.get('[data-cy="settings-profile-username-input"]').type(username);
      cy.get('[data-cy="settings-profile-submit"]').click();
      cy.get('[data-cy="settings-profile-username-message"]')
        .should("be.visible")
        .and("have.text", "Username must be at least 3 characters");
    });
  });

  it("Should show error when username is more than than 30 characters", () => {
    const invalidUsernames = [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    ];

    invalidUsernames.forEach((username) => {
      cy.get('[data-cy="settings-profile-username-input"]').clear();
      cy.get('[data-cy="settings-profile-username-input"]').type(username);
      cy.get('[data-cy="settings-profile-submit"]').click();
      cy.get('[data-cy="settings-profile-username-message"]')
        .should("be.visible")
        .and("have.text", "Username must be at most 30 characters");
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
      cy.get('[data-cy="settings-profile-username-input"]').clear();
      cy.get('[data-cy="settings-profile-username-input"]').type(username);
      cy.get('[data-cy="settings-profile-submit"]').click();
      cy.get('[data-cy="settings-profile-username-message"]')
        .should("be.visible")
        .and("have.text", "Username can only contain alphanumeric characters");
    });
  });

  it("Should show error when username is not available", () => {
    const invalidUsernames = ["user1", "user2", "user3"];

    invalidUsernames.forEach((username) => {
      // Type
      cy.get('[data-cy="settings-profile-username-input"]').clear();
      cy.get('[data-cy="settings-profile-username-input"]').type(username);
      cy.get('[data-cy="settings-profile-name-input"]').type("foo");

      // Intercept & delay to emphasize loading state
      cy.intercept("POST", "/settings/profile", (req) => {
        req.on("response", (res) => {
          res.setDelay(5000);
        });
      }).as("loader");

      // Submit
      cy.get('[data-cy="settings-profile-submit"]').click();

      // Loading state
      cy.get(".toaster")
        .eq(0)
        .find("[data-title]")
        .should("have.text", "Loading...");
      cy.get('[data-cy="settings-profile-avatar-input"]').should("be.disabled");
      cy.get('[data-cy="settings-profile-avatar-delete"]').should(
        "be.disabled"
      );
      cy.get('[data-cy="settings-profile-username-input"]').should(
        "be.disabled"
      );
      cy.get('[data-cy="settings-profile-name-input"]').should("be.disabled");
      cy.get('[data-cy="settings-profile-submit"]').should("be.disabled");

      // Error, After loading
      cy.wait("@loader");
      cy.get(".toaster")
        .eq(0)
        .find("[data-title]")
        .should("have.text", "Error");
      cy.get('[data-cy="settings-profile-username-message"]')
        .should("be.visible")
        .and("have.text", `Username "${username}" is not available`);
    });
  });

  it("Should show error when name is empty", () => {
    cy.get('[data-cy="settings-profile-name-input"]').clear();
    cy.get('[data-cy="settings-profile-submit"]').click();
    cy.get('[data-cy="settings-profile-name-message"]')
      .should("be.visible")
      .and("have.text", "Name is required");
  });

  // The only successfull submit (prevent conflict)
  it("Should be able to update profile successfully", () => {
    // Intercept & delay to emphasize loading state
    cy.intercept("POST", "/settings/profile", (req) => {
      req.on("response", (res) => {
        res.setDelay(5000);
      });
    }).as("imageLoader");

    // Upload image
    cy.get('[data-cy="settings-profile-avatar-input"]').selectFile(
      "cypress/fixtures/images/test-valid-1.jpg"
    );

    // Loading state
    cy.get(".toaster")
      .eq(0)
      .find("[data-title]")
      .should("have.text", "Loading...");
    cy.get('[data-cy="settings-profile-avatar-input"]').should("be.disabled");
    cy.get('[data-cy="settings-profile-avatar-delete"]').should("be.disabled");
    cy.get('[data-cy="settings-profile-submit"]').should("be.disabled");

    // After loading state
    cy.wait("@imageLoader").then((interception) => {
      const body = interception.response!.body as string;
      const idx = body.indexOf("https://res.cloudinary.com");
      const interceptedImageUrl = body.slice(idx, body.length - 2);

      // Assert src
      cy.get('[data-cy="settings-profile-avatar-preview"]', { timeout: 10000 })
        .find("img")
        .should("have.attr", "src", interceptedImageUrl);
    });
    cy.get(".toaster")
      .eq(0)
      .find("[data-title]")
      .should("have.text", "Success");
    cy.get('[data-cy="settings-profile-avatar-preview"]', { timeout: 10000 })
      .find("img")
      .should("have.attr", "src");
    cy.get('[data-cy="settings-profile-avatar-input"]').should(
      "not.be.disabled"
    );
    cy.get('[data-cy="settings-profile-avatar-delete"]').should(
      "not.be.disabled"
    );
    cy.get('[data-cy="settings-profile-submit"]').should("not.be.disabled");

    // Type username
    cy.get('[data-cy="settings-profile-username-input"]').clear();
    cy.get('[data-cy="settings-profile-username-input"]').type("newUsername2");

    // Type name
    cy.get('[data-cy="settings-profile-name-input"]').clear();
    cy.get('[data-cy="settings-profile-name-input"]').type("New Username 2");

    // Intercept & delay to emphasize loading state
    cy.intercept("POST", "/settings/profile", (req) => {
      req.on("response", (res) => {
        res.setDelay(5000);
      });
    }).as("updateLoader");

    // Submit
    cy.get('[data-cy="settings-profile-submit"]').click();

    // Loading state
    cy.get(".toaster")
      .eq(0)
      .find("[data-title]")
      .should("have.text", "Loading...");
    cy.get('[data-cy="settings-profile-avatar-input"]').should("be.disabled");
    cy.get('[data-cy="settings-profile-avatar-delete"]').should("be.disabled");
    cy.get('[data-cy="settings-profile-email-input"]').should("be.disabled");
    cy.get('[data-cy="settings-profile-username-input"]').should("be.disabled");
    cy.get('[data-cy="settings-profile-name-input"]').should("be.disabled");
    cy.get('[data-cy="settings-profile-submit"]').should("be.disabled");

    // After loading state
    cy.wait("@updateLoader");
    cy.get(".toaster")
      .eq(0)
      .find("[data-title]")
      .should("have.text", "Success");
    // Check updated fields
    // Avatar
    cy.get('[data-cy="settings-profile-avatar-input"]').should(
      "not.be.disabled"
    );
    cy.get('[data-cy="settings-profile-avatar-delete"]').should(
      "not.be.disabled"
    );
    // Email
    cy.get('[data-cy="settings-profile-email-input"]')
      .should("be.disabled")
      .and("have.value", "testuserdewodt@gmail.com");
    // Username
    cy.get('[data-cy="settings-profile-username-input"]')
      .should("not.be.disabled")
      .and("have.value", "newUsername2");
    // Name
    cy.get('[data-cy="settings-profile-name-input"]')
      .should("not.be.disabled")
      .and("have.value", "New Username 2");
    // Update submit button
    cy.get('[data-cy="settings-profile-submit"]').should("be.disabled");
  });
});
