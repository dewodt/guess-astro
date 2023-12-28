import Footer from "@/components/ui/footer";

describe("Footer component", () => {
  it("Should successfully render the footer", () => {
    cy.mount(<Footer />);

    cy.get('[data-cy="footer-about"]')
      .should("be.visible")
      .should("have.attr", "href", "/about")
      .and("have.text", "About");

    cy.get('[data-cy="footer-privacy-policy"]')
      .should("be.visible")
      .should("have.attr", "href", "/privacy-policy")
      .and("have.text", "Privacy Policy");

    const year = new Date().getFullYear();
    cy.get('[data-cy="footer-copyright"]')
      .should("be.visible")
      .and("have.text", `Copyright © ${year} Guess Astro`);
  });
});
