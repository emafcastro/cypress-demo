/// <reference types="cypress" />
import { articleAPI } from "../api/articleAPI";

class HomePage {
    locators = {
        feedLinks: "div.feed-toggle a",
        yourFeedLink: "Your Feed",
        authorLinks: ".author",
        likeButtons: ".article-meta button",
        allArticlesContainer: ".article-preview",
        allArticlesTitleText: "a > h1",
        popularTags: ".sidebar",
    };

    getFirstArticleFavoriteButton() {
        return cy.get(this.locators.likeButtons).eq(0);
    }

    getAllArticles() {
        return cy.get(this.locators.allArticlesContainer);
    }

    clickYourFeedLink() {
        cy.get(this.locators.feedLinks).contains(this.locators.yourFeedLink).click();
    }

    clickFavoriteInFirstArticle() {
        this.getFirstArticleFavoriteButton().click();
    }

    clickOnPopularTag(tag){
        cy.get(this.locators.popularTags).contains(tag).click();
    }

    // VERIFICATIONS

    verifyAllDisplayedArticlesContainsTag(tag) {
        this.getAllArticles().each(($article) => {
            cy.wrap($article).find("li").contains(tag).should("exist");
        });
    }

    verifyLastCreatedArticleHasTitle(title) {
        cy.get(this.locators.allArticlesTitleText).eq(0).should("have.text", title);
    }

    verifyAuthorShouldBeFirstUser() {
        cy.get("@users").then((data) => {
            cy.get(this.locators.authorLinks).each(($el) => {
                cy.wrap($el).should("have.text", data.users[0].name);
            });
        });
    }

    verifyFavoriteButtonChangeStyle() {
        this.getFirstArticleFavoriteButton().should("have.class", "btn-outline-secondary");
    }

    verifyFavoriteButtonContainsText() {
        this.getFirstArticleFavoriteButton().then((item) => {
            cy.wrap(item).should("contain.text", "1");
        });
    }

    verifyLengthOfArticlesWhenOneIsDeleted() {
        this.getAllArticles()
            .its("length")
            .then((oldLength) => {
                // Then the first article will be deleted
                articleAPI.deleteArticleWithAPI();

                // Then a new length needs to be obtained
                this.getAllArticles()
                    .its("length")
                    .then((actualLength) => {
                        expect(actualLength).to.be.below(oldLength);
                        this.verifyInvisibilityOfDeletedArticle();
                    });
            });
    }

    verifyInvisibilityOfDeletedArticle() {
        // Verify if the created article is not displayed on the list
        cy.get("@createdArticle").then((response) => {
            const pathSplit = response.headers["hx-redirect"].split("/");
            const title = pathSplit[3].replaceAll("-", " ");
            cy.contains(title).should("not.exist");
        });
    }
}
export const homePage = new HomePage();
