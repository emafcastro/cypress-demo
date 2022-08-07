/// <reference types="cypress" />
import ArticleFormPage from "../support/pageobjects/ArticleFormPage";
import HomePage from "../support/pageobjects/HomePage";
import NavBarPage from "../support/pageobjects/NavBarPage";
import ArticleDetailPage from "../support/pageobjects/ArticleDetailPage"

describe('Article actions',()=> {
    const articleFormPage = new ArticleFormPage();
    const articleDetailPage = new ArticleDetailPage();

    beforeEach(() => {
        // The user will be logged in before each test
        
        // The log in will be done with the first user in user.json file 
        cy.fixture('user.json').as('users').then((data)=>{
            cy.loginWithAPI(data.users[0].email, data.users[0].password)
            cy.visit('/')
        })
        
    })

    afterEach(()=>{
        cy.visit('/')
        cy.deleteArticle()
    })

    it('should be able to create a new Article', () =>{
        // The first time an End to End test is used
        
        const title = "New Article " + Date.now()
        const description = "This is an automated article"
        const body = "# Hello World"
        const tags = "test"

        const navBarPage = new NavBarPage();
        navBarPage.getNewArticleLink().click()
        
        articleFormPage.getTitleField().type(title)
        articleFormPage.getSummaryField().type(description)
        articleFormPage.getContentField().type(body)
        articleFormPage.getTagField().type(tags)
        articleFormPage.getPublishButton().click()
        cy.visit('/')

        const homePage = new HomePage();
        homePage.getLastCreatedArticle().should('have.text', title)
    })

    it('should logged out user be able to see the article', () => {
        // This test creates an article via API, gets its url, then clearStorage and cookies, finally verify elements and try to comment
        cy.addArticle().then((response) => {
            cy.clearCookies()
            cy.clearLocalStorage()

            cy.visit(response.headers['hx-redirect']) // This header returns the path to the created article

            // All elements will be verified to be visible
            articleDetailPage.getArticleTitleText().should('be.visible')
            articleDetailPage.getArticleAuthorLinks().each(($el) => {
                cy.wrap($el).should('be.visible')
            })

            // The date will be verified to be today's date
            const today = new Date();
            let date = today.toLocaleString('default', { year: 'numeric', month: 'short', day: 'numeric' })
            let convertedDate = [date.slice(0, 3), ".", date.slice(3)].join('')
            articleDetailPage.getArticleDates().each(($el) => {
                cy.wrap($el).should('have.text', convertedDate)
            })

            articleDetailPage.getArticleContent().should('be.visible')

            articleDetailPage.getCommentTextArea().should('not.exist')
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
            articleDetailPage.getArticleTitleText().should('be.visible')
            articleDetailPage.getArticleAuthorLinks().each(($el) => {
                cy.wrap($el).should('contain.text', 'automation')
            })

            cy.contains(description).should('be.visible')
            cy.contains(body).should('be.visible')
        })
    })

    it.skip('should be able to like an article with another user', () => {
        // SKIPPED until figure out how to login again with the previous user
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
            articleDetailPage.getFavoritePostButton().click()
            articleDetailPage.getFavoritePostButton().should('have.class', 'btn-outline-secondary')

        })

    })
    
})