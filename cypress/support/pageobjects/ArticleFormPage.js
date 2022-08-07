class ArticleFormPage {
    getTitleField(){
        return cy.get('#id_title')
    }

    getSummaryField(){
        return cy.get('#id_summary')
    }

    getContentField(){
        return cy.get('#id_content')
    }

    getTagField(){
        return cy.get('[name=tags]')
    }

    getPublishButton(){
        return cy.contains('Publish Article')
    }
}
export default ArticleFormPage