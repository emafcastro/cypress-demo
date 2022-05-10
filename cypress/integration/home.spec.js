/// <reference types="cypress" />

describe('Logged users actions', () => {

    beforeEach(() => {

        // The user will be logged in before each test
        cy.visit('/login')
        cy.loginWithCredentials("automation@test.com", "Test1234")
        cy.contains('Sign Out').should('be.visible')
        
    })


    it('should be able to see my feed', () => {

        //Wait until own articles finish loading
        cy.intercept('GET', '/?own').as('ownArticles')
        cy.contains('Your Feed').click()
        cy.wait('@ownArticles', {timeout: 6000})

        cy.get('.author').each(($el) => {
            cy.wrap($el).should('have.text','automation')
        })
    })


    it('should be able to like an Article with a different user', () =>{
        // This test allows to create a new article and then like with another user

        cy.addArticle()
        // Cookies and storage are deleted, then the log in is performed with the user like
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.visit('/login')
        cy.loginWithCredentials("like@test.com", "Test1234")
        cy.contains('Sign Out').should('be.visible')

        // Intercept the POST request after clicking like to wait until it is finished
        cy.intercept('POST','/article/favorite/**').as('favoriteArticle')

        // Press like button on created article and check again that it has the class btn-outline-secondary
        cy.get('.article-meta button').eq(0).click()
        cy.wait('@favoriteArticle', { timeout: 10000 } )
        cy.get('.article-meta button').eq(0).should('have.class', 'btn-outline-secondary')

        cy.get('.article-meta button').eq(0).then((item) => {
            cy.wrap(item).should('contain.text', '1')
        })
        
    }) 


    it('should be able to verify if the count of articles decreases when an article is deleted', ()=>{
        
        cy.addArticle().as('createdArticle')
        cy.visit('/')


        // The lenght of the list will be obtained
        cy.get('.article-preview').its('length').then((oldLenght) => {
            // Then the first article will be deleted
            cy.deleteArticle()

            // Then a new lenght needs to be obtained
            cy.get('.article-preview').its('length').then((actualLenght)=>{

                expect(actualLenght).to.be.below(oldLenght)

                // Verify if the created article is not displayed on the list
                cy.get('@createdArticle').then((response) => {
                    const pathSplit = response.headers['hx-redirect'].split("/")
                    const title = pathSplit[3].replaceAll("-", " ")
                    cy.contains(title).should('not.exist')
                })
            })
        })
    })


    it('should be able to filter by tag', () => {
        // This test creates a new article with a different tag, then there is a verification to check the filter by tag
        cy.addArticle({tags:"newTag"})
        cy.visit('/')

        // Wait until the page loads the specific articles for the tag
        cy.intercept('GET','/?tag=newTag').as('getTag')
        cy.get('.sidebar').contains('newTag').click()
        cy.wait('@getTag', {timeout: 6000})

        cy.get('.tag-outline').each(($elem)=>{
            cy.wrap($elem).should('have.text','newTag')
        })
    })

})