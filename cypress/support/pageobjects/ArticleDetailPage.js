/// <reference types="cypress" />
class ArticleDetailPage {
    locators = {
        articleTitleText: ".container > h1",
        articleAuthorLinks: ".author",
        articleDatesText: ".date",
        articleContentSection: ".article-content",
        articleCommentTextArea: "textarea",
        favoritePostButton: "Favorite Post",
    };

    clickFavoriteButton(){
        cy.get(this.locators.favoritePostButton).click();
    }

    verifyVisibilityOfTitle() {
        cy.get(this.locators.articleTitleText).should("be.visible");
    }

    verifyVisibilityOfAuthor() {
        cy.get(this.locators.articleAuthorLinks).each(($el) => {
            cy.wrap($el).should("be.visible");
        });
    }

    verifyDatesAreToday() {
        const today = new Date();
        let date = today.toLocaleString("default", { year: "numeric", month: "short", day: "numeric" });
        let convertedDate = [date.slice(0, 3), ".", date.slice(3)].join("");

        cy.get(this.locators.articleDatesText).each(($el) => {
            cy.wrap($el).should("have.text", convertedDate);
        });
    }

    verifyVisibilityOfContent(){
        cy.get(this.locators.articleContentSection).should("be.visible");
    }

    verifiyInvisibilityOfTextArea(){
        cy.get(this.locators.articleCommentTextArea).should("not.exist");
    }

    verifyAuthorLinksContainsText(text){
        cy.get(this.locators.articleAuthorLinks).each(($el) => {
            cy.wrap($el).should("contain.text", text);
        });
    }

    verifyVisibilityOfText(text){
        cy.contains(text).should("be.visible");
    }

    verifyFavoriteButtonChangeStyle(){
        cy.get(this.locators.favoritePostButton).should("have.class", "btn-outline-secondary");
    }
}
export const articleDetailPage = new ArticleDetailPage();
