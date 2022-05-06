/// <reference types="cypress" />

xdescribe('Visitors actions', ()=>{

})

describe('Logged users actions', () => {

    beforeEach(() => cy.visit("/login"))

    it('should be able to like an Article', () =>{
        cy.loginWithCredentials("like@test.com", "Test1234")
        cy.contains('automation').should('be.visible')
        cy.get('.preview-link > a').eq(0).click()
        cy.contains('Favorite Article').click()
        cy.intercept({
            method: 'POST',
            url:'/article/2/new-article-1651693350372/'
        }).as('getArticleInformation')
        cy.wait('@getArticleInformation')
        cy.get('.counter').each((item)=>{
            cy.wrap(item).should('have.text', '(1)')
        })
    }) 



    // There is not delete button on this website
    xit('should be able to verify if the count of articles decreases when an article is deleted', ()=>{
        cy.loginWithCredentials("automation@test.com", "Test1234")
        // If there are not articles, at least one needs to be created so it can be deleted
        cy.get('.article-preview').then((preview)=>{
            if(preview.text().includes("No articles are here")){
                cy.createArticle(title, description, body, tags)
                cy.visit('/')
            }
        })
        // This instructions will delete the article
        // The lenght of the list will be obtained
        cy.get('.article-preview').its('length').then((oldLenght) => {
            // Then the first article will be deleted
            cy.accessToArticleByIndex(0)
            cy.contains('Delete Article').click()

            // Then a new lenght needs to be obtained
            cy.get('.article-preview').its('length').then((actualLenght)=>{

                // But the fronted displays a text "No articles are here" in the same class .article-preview
                if (actualLenght == 1){

                    // And it counts in the list, so is a false positive, instead to bypass this
                    cy.get('.article-preview').then((preview)=>{

                        // If there is at least 1 element of .article-preview, we verify if it is actually the message
                        if(preview.text().includes("No articles are here")){

                            // And if it is, we just verify that another element present in the article is not present
                            cy.get('.preview-link').should('not.exist')
                        }
                    })
                }
                else{
                    // If there is not message present, it is because there are articles in the list, so we verify the old length againt the new length
                    expect(actualLenght).to.be.below(oldLenght)
                }
            })
        })
    })

})