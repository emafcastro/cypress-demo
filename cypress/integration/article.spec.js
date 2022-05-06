/// <reference types="cypress" />

xdescribe('Logged owner user',()=> {

    const title = "New Article " + Date.now()
    const description = "This is an automated article"
    const body = "# Hello World"
    const tags = "test"

    beforeEach(() => {

        // The user will be logged in before each test
        cy.visit('/login')
        cy.loginWithCredentials("automation@test.com", "Test1234")
        cy.contains('Sign Out').should('be.visible')
        
    })

    it('should be able to create a new Article', () =>{
        // The first time an End to End test is used
        cy.contains('New Article').click()
        cy.get('#id_title').type(title)
        cy.get('#id_summary').type(description)
        cy.get('#id_content').type(body)
        cy.get('[name=tags]').type(tags)
        cy.contains('Publish Article').click()
        cy.visit('/')
        cy.get('a > h1').eq(0).should('have.text', title)
    })

    it('should be able to verify if all submited elements are in the article', ()=> {
        // The second time an API request is used
        // TODO Add API request as a command in cypress
        cy.createArticle(title, description, body, tags)
        cy.get('a > h1').contains(title).click()
        cy.get('.container > h1').should('have.text', title)
        cy.get('.author').each(($el) => {
            cy.wrap($el).should('contain.text', 'automation')
        })

        const today = new Date();
        const date = today.toLocaleString('default', { year: 'numeric', month: 'long', day: 'numeric' })
        cy.get('.date').each(($el)=> {
            cy.wrap($el).should('have.text',date)
        }) 
        cy.contains(description).should('be.visible')
        cy.contains('Hello World').should('be.visible')
    })

    it('should logged out user be able to see the article', () => {
        // TODO Create article via API, get url, then clearStorage and cookies and verify elements, try to comment
    })

    it('should be able to edit an article', ()=> {
        // TODO Edit an article via API, access and check its elements
    })

    it('should be able to like an article with another user', () => {
        // Login with another user, like an article
    })  
    
})