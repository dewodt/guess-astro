describe("Privacy Policy Page", () => {
  // Visit the Privacy Policy page before each test
  beforeEach(() => {
    cy.visit("/privacy-policy");
  });

  it("Successfully render privacy policy page", () => {
    cy.get('[data-cy="privacy-policy-section"]')
      .children()
      .should("have.length", 7);

    const expectedPrivacyPolicy = [
      {
        title: "Privacy Policy",
        description:
          "Welcome to Guess Astro! At Guess Astro, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard the information you provide to us while using our services. By accessing and using our website or mobile application, you consent to the practices described in this Privacy Policy.",
      },
      {
        title: "Information We Collect",
        description:
          "To run this app, we collect several user information such as email address, name, username, and an optional profile picture data. We may also collect data on your interactions with the website such as game activity and usage patterns.",
      },
      {
        title: "How We Use Your Information",
        description:
          "We collect user information to manage user/player account in our application. We also collect your game/match activity to keep track of your statistics and progress.",
      },
      {
        title: "Data Security",
        description:
          "We are committed to ensuring the security of your personal information. We implement reasonable technical and organizational measures to protect your data from unauthorized access, disclosure, alteration, and destruction.",
      },
      {
        title: "Expose To Third Parties",
        description:
          "We will not share, sell, or rent your personal information/data to any third parties.",
      },
      {
        title: "Updates to Privacy Policy",
        description:
          "We may update this Privacy Policy from time to time to reflect changes in our practices or for legal and regulatory reasons. Please check this page periodically for any updates.",
      },
      {
        title: "Contact",
        description:
          "If you have any questions, concerns, or requests related to this Privacy Policy or how we handle your data, please contact us at this email.",
      },
    ];

    cy.get('[data-cy="privacy-policy-section"]')
      .children()
      .each((el, index) => {
        if (index === 0) {
          cy.wrap(el)
            .find("h1")
            .should("be.visible")
            .and("have.text", expectedPrivacyPolicy[index].title);
        } else {
          cy.wrap(el)
            .find("h2")
            .should("be.visible")
            .and("have.text", expectedPrivacyPolicy[index].title);
        }

        cy.wrap(el)
          .find("p")
          .should("be.visible")
          .and("have.text", expectedPrivacyPolicy[index].description);
      });
  });
});
