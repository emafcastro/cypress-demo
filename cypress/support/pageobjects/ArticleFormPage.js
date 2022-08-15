/// <reference types="cypress" />
class ArticleFormPage {
    locators = {
        titleField: "#id_title",
        summaryField: "#id_summary",
        contentField: "#id_content",
        tagField: "[name=tags]",
        publishButton: "Publish Article",
    };

    createNewArticleWithFixture() {
        cy.fixture("article.json").then((data) => {
            cy.get(this.locators.titleField).type(data.title);
            cy.get(this.locators.summaryField).type(data.summary);
            cy.get(this.locators.contentField).type(data.content);
            cy.get(this.locators.tagField).type(data.tags);
        });
        cy.contains(this.locators.publishButton).click();
    }

    createNewArticle(title, summary, content, tags) {
        cy.get(this.locators.titleField).type(title);
        cy.get(this.locators.summaryField).type(summary);
        cy.get(this.locators.contentField).type(content);
        cy.get(this.locators.tagField).type(tags);
        cy.contains(this.locators.publishButton).click();
    }
}
export const articleFormPage = new ArticleFormPage();
