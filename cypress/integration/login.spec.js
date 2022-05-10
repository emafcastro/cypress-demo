/// <reference types="cypress" />

describe('Login actions', () => {

    context('Unsuccessful Login', () => {

        beforeEach(() => cy.visit("/login"))

        it('should display both email and password fields as required', () => {
            cy.get('#id_username').should('have.attr', 'required')
            cy.get('#id_password').should('have.attr', 'required')
        })
    
        it('should display an error message when a field is empty', () => {
            cy.loginWithCredentials(" ", "Test1234")
            cy.get('.error-messages').should('contain.text', '* This field is required.')
        })
    
        it('should display an error message when email and password does not match', () => {
            cy.loginWithCredentials("automation@test.com", " ")
            cy.get('.error-messages').should('contain.text', '* Please enter a correct Email Address and password. Note that both fields may be case-sensitive.')
            cy.loginWithCredentials("automation", "Test1234")
            cy.get('.error-messages').should('contain.text', '* Please enter a correct Email Address and password. Note that both fields may be case-sensitive.')
        })
    })

    context('Successful Login', () => {

        beforeEach(() => cy.visit("/login"))

        it('should logging with correct credentials', () => {
            cy.loginWithCredentials("automation@test.com", "Test1234")
            cy.contains('Sign Out').should('be.visible')
        })
    })

      
})