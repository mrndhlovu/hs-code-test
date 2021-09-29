/// <reference types="cypress" />

describe("App", () => {
  it("loads the app properly", () => {
    cy.on("uncaught:exception", (err, runnable) => {
      return false
    })
    cy.viewport(1080, 720)
    cy.visit("/")

    cy.get("[data-test-id=root-container]").should("exist")
  })
})
