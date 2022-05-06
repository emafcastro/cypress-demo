/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
        /**
         * Login user with @email and @password
         * 
         * @email
         * User email
         * 
         * @password
         * User password
         * 
         * @example
         * cy.loginWithCredentials('email@email.com', 'password')
         */
         loginWithCredentials(email:string, password:string)
    }
}