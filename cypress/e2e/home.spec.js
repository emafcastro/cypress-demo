/// <reference types="cypress" />

describe('Logged users actions', () => {

    beforeEach(() => {

        // The user will be logged in before each test
        cy.fixture('user.json').as('users').then((data)=>{
            cy.loginWithAPI(data.users[0].email, data.users[0].password)
            cy.visit('/')
        })
        
    })


    it('should be able to see my feed', () => {
        // This test verifies that the ownership of all articles in /?own are from the logged user

        // Wait until own articles finish loading
        cy.intercept('GET', '/?own').as('ownArticles')
        cy.contains('Your Feed').click()
        cy.wait('@ownArticles', {timeout: 6000})


        // Then check every author contains the name of the first user
        cy.get('@users').then((data) => {
            cy.get('.author').each(($el) => {
                cy.wrap($el).should('have.text', data.users[0].name)
            })
        })
        
    })


    it('should be able to like an Article with a different user', () =>{
        // This test allows to create a new article and then like with another user

        cy.addArticle()

        // Cookies and storage are deleted, then the log in is performed with the second user
        cy.clearCookies()
        cy.clearLocalStorage()

        cy.get('@users').then((data)=>{
            cy.loginWithAPI(data.users[1].email, data.users[1].password)
            cy.visit('/')
        })

        // Intercept the POST request after clicking like to wait until the process is finished
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

        // This test creates and deletes the article, checking before and after the length of the list of articles
        
        cy.addArticle().as('createdArticle')
        cy.visit('/')


        // The length of the list will be obtained
        cy.get('.article-preview').its('length').then((oldLength) => {
            // Then the first article will be deleted
            cy.deleteArticle()

            // Then a new length needs to be obtained
            cy.get('.article-preview').its('length').then((actualLength)=>{

                expect(actualLength).to.be.below(oldLength)

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

        // Some articles contains more than one tag, so we iterate over each one and check if at least exist the created tag
        cy.get('.article-preview').each(($article) => {
            cy.wrap($article).find('li').contains('newTag').should('exist')
        })
    })

})