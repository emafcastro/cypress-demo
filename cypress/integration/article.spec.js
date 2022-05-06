/// <reference types="cypress" />

describe('Article actions',()=> {

    const title = "New Article " + Date.now()
    const description = "This is an automated article"
    const body = "# Hello World"
    const tags = "test"

    beforeEach(() => {

        // The user will be logged in before each test
        cy.visit('/login')
        cy.loginWithCredentials("automation@test.com", "Test1234")
        cy.contains('automation').should('be.visible')
        
    })

    it('should be able to create a new Article', () =>{
        // Maybe this test can be moved as a part of the beforeEach
        const urlTitle = title.replaceAll(' ', '-').toLowerCase()
        console.log(urlTitle)
        cy.createArticle(title, description, body, tags)
        cy.intercept({
            method: "GET",
            url:"/article/**"
        })
        cy.get('a > h1').eq(0).should('have.text', title)
    })

    it('should be able to verify if all submited elements are in the article', ()=> {
        cy.createArticle(title, description, body, tags)
        cy.accessToArticleByName(title)
        cy.get('.container > h1').should('have.text', title)
        cy.get('.author').each(($el) => {
            cy.wrap($el).should('contain.text', 'automation')
        })

    })


    // There is not delete button on this website
    xit('should be able to delete an article', ()=> {
        
    })
    
})