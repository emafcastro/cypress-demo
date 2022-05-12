/// <reference types="cypress" />

describe('Comment actions', () => {

    beforeEach(() => {

        // The user will be logged in before each test
        cy.fixture('user.json').then((data)=>{
            cy.loginWithAPI(data.users[0].email, data.users[0].password)
        })

        // A new article will be created to work with each comment test
        cy.addArticle().as('createdArticle').then((response) => {
            cy.visit(response.headers['hx-redirect'])
        })
        
    })

    it('should be able to leave a comment', () => {
        // Manual test to add a new comment

        cy.get('textarea').type('random comment')
        cy.contains('Post Comment').click()
        cy.contains('random comment').should('be.visible')
    })

    it('should be able to delete a comment', () => {
        // A new comment is added via API, then manually the delete button is selected
        // The only validation that will be done is to check the message, because Cypress automatically accepts every alert

        cy.addComment()
        cy.get('.ion-trash-a').click()
        cy.on('window:confirm', (text) => {
            expect(text).to.contains('Delete this comment?');
        });
    })

    it('should be able to edit a comment', () => {
        // Manual test to edit a comment created via API

        // Intercept and wait are used to wait for the textarea to be enable for edition
        cy.intercept('GET', '/comments/edit/**').as('getComment')
        cy.addComment()
        cy.get('.ion-edit').click()
        cy.wait('@getComment', {timeout:6000})

        cy.get('textarea').eq(1).clear()
        cy.get('textarea').eq(1).type('Edited comment')
        cy.contains('Save Comment').click()
        cy.contains('Edited comment').should('be.visible')
    })
})