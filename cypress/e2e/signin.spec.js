/// <reference types="cypress" />
import SignInPage from '../support/pageobjects/SignInPage';
import NavBarPage from '../support/pageobjects/NavBarPage';

describe('Login actions', () => {

    context('Login page validations', () => {

        const signInPage = new SignInPage();

        beforeEach(() => cy.visit("/login"))

        it('should display both email and password fields as required', () => {
            // This test checks if the fields are required
            signInPage.getUsernameField().should('have.attr', 'required')
            signInPage.getPasswordField().should('have.attr', 'required')
        })
    
        it('should display an error message when a field is empty', () => {
            // This test verifies the error message when the email is empty
            cy.loginWithCredentials(" ", "Test1234")
            signInPage.getErrorMessageSection().should('contain.text', '* This field is required.')
        })
    
        it('should display an error message when email and password does not match', () => {
            // This test check the error message when the credentials are incorrect
            cy.loginWithCredentials("automation@test.com", " ")
            signInPage.getErrorMessageSection().should('contain.text', '* Please enter a correct Email Address and password. Note that both fields may be case-sensitive.')
            cy.loginWithCredentials("automation", "Test1234")
            signInPage.getErrorMessageSection().should('contain.text', '* Please enter a correct Email Address and password. Note that both fields may be case-sensitive.')
        })
    })

    context('Successful Login', () => {

        beforeEach(() => cy.visit("/login"))

        it('should logging with correct credentials', () => {
            // This test validates the user can log in correctly
            const navBarPage = new NavBarPage();

            cy.fixture('user.json').then((data) => {
                // The request to the home needs to be intercepted in order to wait until home page is loaded
                cy.intercept('GET', '/').as('getHome')
                cy.loginWithCredentials(data.users[0].email, data.users[0].password)
                cy.wait('@getHome', {timeout:6000})
                navBarPage.getSignOutLink().should('be.visible')
            })
        })
    })

      
})