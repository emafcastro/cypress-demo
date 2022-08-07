/// <reference types="cypress" />
import CommentPage from "../support/pageobjects/CommentPage"

describe('Comment actions', () => {

    const commentPage = new CommentPage();

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

        commentPage.getCommentTextArea().type('random comment')
        commentPage.getPostButton().click()
        cy.contains('random comment').should('be.visible')
    })

    it('should be able to delete a comment', () => {
        // A new comment is added via API, then manually the delete button is selected
        // The only validation that will be done is to check the message, because Cypress automatically accepts every alert

        cy.addComment()
        commentPage.getDeleteCommentButton().click()
        cy.on('window:confirm', (text) => {
            expect(text).to.contains('Delete this comment?');
        });
    })

    it('should be able to edit a comment', () => {
        // Manual test to edit a comment created via API

        // Intercept and wait are used to wait for the textarea to be enable for edition
        cy.intercept('GET', '/comments/edit/**').as('getComment')
        cy.addComment()
        commentPage.getEditCommentButton().click()
        cy.wait('@getComment', {timeout:6000})

        commentPage.getLastPostedComment().clear()
        commentPage.getLastPostedComment().type('Edited comment')
        commentPage.getSaveCommentButton().click()
        cy.contains('Edited comment').should('be.visible')
    })
})