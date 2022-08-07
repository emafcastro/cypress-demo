class ArticleDetailPage{
    getArticleTitleText(){
        return cy.get('.container > h1')
    }

    getArticleAuthorLinks(){
        return cy.get('.author')
    }

    getArticleDates(){
        return cy.get('.date')
    }

    getArticleContent(){
        return cy.get('.article-content')
    }

    getCommentTextArea(){
        return cy.get('textarea')
    }

    getFavoritePostButton(){
        return cy.contains('Favorite Post')
    }
}
export default ArticleDetailPage