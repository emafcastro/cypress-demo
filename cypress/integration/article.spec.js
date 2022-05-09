/// <reference types="cypress" />

describe('Article actions',()=> {

    beforeEach(() => {

        // The user will be logged in before each test
        cy.visit('/login')
        cy.loginWithCredentials("automation@test.com", "Test1234")
        cy.contains('Sign Out').should('be.visible')
        
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
        // This test creates an article via API, gets url, then clearStorage and cookies, then verify elements and try to comment
        cy.addArticle().then((response) => {
            cy.clearCookies()
            cy.clearLocalStorage()

            cy.visit(response.headers['hx-redirect']) // This header returns the path to the created article

            // All elements will be verified to be visible
            cy.get('.container > h1').should('be.visible')
            cy.get('.author').each(($el) => {
                cy.wrap($el).should('be.visible')
            })

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

        // TODO consider moving the edit method to a function
        // TODO Create first an article and then edit it
        const title = "Edited title via Cypress"
        const description = "Edited description"
        const body = "Edited body"
        const tags = "test"

        cy.setCookie('csrftoken', 'Zpe3934sqarqMFa1fh1dvGn994woCikLEJDQniA6ohUsHdCVlX2yjemJ43Ujskob')
        cy.setCookie('sessionid', 'zf4o9xkownkqpvunmecwf789el6war7d')

        cy.request({
            method: 'POST',
            url: '/article/edit/21/',
            body: {
                "title": title,
                "summary": description,
                "content": body,
                "tags": tags
            },
            form: true,
            headers: {
                'X-CSRFToken': 'Zpe3934sqarqMFa1fh1dvGn994woCikLEJDQniA6ohUsHdCVlX2yjemJ43Ujskob',
                'Content-Type': "multipart/form-data; boundary=--------------------------579482458443764609045166"
            }
        }).then((response) => {
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

        // A new article with user automation is created
        cy.addArticle().then((response) => {
            // Cookies and storage is deleted, then the log in is performed with the user like
            cy.clearCookies()
            cy.clearLocalStorage()
            cy.visit('/login')
            cy.loginWithCredentials("like@test.com", "Test1234")
            cy.contains('Sign Out').should('be.visible')

            // Visit the url to the created article
            cy.visit(response.headers['hx-redirect'])

            // Click on favorite post and check again that it has the class btn-outline-secondary
            cy.contains('Favorite Post').click()
            cy.contains('Favorite Post').should('have.class', 'btn-outline-secondary')

        })

    })  
    
})