class HomePage{
    getLastCreatedArticle(){
        return cy.get('a > h1').eq(0)
    }

    getFeedLinks(){
        return cy.get('div.feed-toggle a')
    }

    getYourFeedLink(){
        return this.getFeedLinks().contains('Your Feed')
    }

    getAuthorLinks(){
        return cy.get('.author')
    }

    getFirstArticleLikeButton(){
        return cy.get('.article-meta button').eq(0)
    }

    getAllArticles(){
        return cy.get('.article-preview')
    }

    getPopularTags(){
        return cy.get('.sidebar')
    }

    verifyAllDisplayedArticlesContainsTag(tag){
        return this.getAllArticles().each(($article) => {
            cy.wrap($article).find('li').contains(tag).should('exist')
        })
    }
}
export default HomePage