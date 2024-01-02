describe("Verify Request Page", () => {
  beforeEach(() => {
    cy.visit("/auth/verify-request");
  });

  it("Should render verify request page successfully", () => {
    cy.get('[data-cy="verify-request-title"]')
      .should("be.visible")
      .and("have.text", "Verify Request");

    cy.get('[data-cy="verify-request-description"]')
      .should("be.visible")
      .and(
        "have.text",
        "To complete the verification process, please check your email inbox for a verification link from us. If you don't see the email in your inbox, please also check your spam folder."
      );
  });
});
