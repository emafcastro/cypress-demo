/// <reference types="cypress" />

describe('Article actions',()=> {

    beforeEach(() => {
        // The user will be logged in before each test
        
        // The log in will be done with the first user in user.json file 
        cy.fixture('user.json').as('users').then((data)=>{
            cy.loginWithAPI(data.users[0].email, data.users[0].password)
            cy.visit('/')
        })
        
    })

    it('should be able to create a new Article', () =>{
        // The first time an End to End test is used

        const title = "New Article " + Date.now()
        const description = "This is an automated article"
        const body = "# Hello World"
        const tags = "test"

        cy.contains('New Article').click()
        cy.get('#id_title').type(title)
        cy.get('#id_summary').type(description)
        cy.get('#id_content').type(body)
        cy.get('[name=tags]').type(tags)
        cy.contains('Publish Article').click()
        cy.visit('/')
        cy.get('a > h1').eq(0).should('have.text', title)
    })

    it('should logged out user be able to see the article', () => {
        // This test creates an article via API, gets its url, then clearStorage and cookies, finally verify elements and try to comment
        cy.addArticle().then((response) => {
            cy.clearCookies()
            cy.clearLocalStorage()

            cy.visit(response.headers['hx-redirect']) // This header returns the path to the created article

            // All elements will be verified to be visible
            cy.get('.container > h1').should('be.visible')
            cy.get('.author').each(($el) => {
                cy.wrap($el).should('be.visible')
            })

            // The date will be verified to be today's date
            const today = new Date();
            const date = today.toLocaleString('default', { year: 'numeric', month: 'long', day: 'numeric' })
            cy.get('.date').each(($el) => {
                cy.wrap($el).should('have.text', date)
            })

            cy.get('.article-content').should('be.visible')

            cy.get('textarea').should('not.exist')
        })
    })

    it('should be able to edit an article', ()=> {
        // This test allows to edit an article via API, access and check its elements

        const title = "Edited title via Cypress"
        const description = "Edited description"
        const body = "Edited body"
        const tags = "test"

        cy.addArticle()
        cy.visit('/')

        cy.editArticle(title, description, body, tags).then((response) => {
            cy.visit(response.headers['hx-redirect'])

            // Validations to verify the changes were made
            cy.contains(title).should('be.visible')
            cy.get('.author').each(($el) => {
                cy.wrap($el).should('contain.text', 'automation')
            })

            cy.contains(description).should('be.visible')
            cy.contains(body).should('be.visible')
        })
    })

    it('should be able to like an article with another user', () => {
        // This test allows to login with another user and like an article

        cy.addArticle().then((response) => {
            // Cookies and storage are deleted, then the log in is performed with the second user
            cy.clearCookies()
            cy.clearLocalStorage()

            // The second user is taken from the fixture user.json
            cy.get('@users').then((data)=>{
                cy.loginWithAPI(data.users[1].email, data.users[1].password)
            })

            // Visit the url to the created article
            cy.visit(response.headers['hx-redirect'])

            // Click on favorite post and check again that it has the class btn-outline-secondary
            cy.contains('Favorite Post').click()
            cy.contains('Favorite Post').should('have.class', 'btn-outline-secondary')

        })

    })
    
})