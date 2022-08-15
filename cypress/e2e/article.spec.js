/// <reference types="cypress" />
import { articleFormPage } from "../support/pageobjects/ArticleFormPage";
import { homePage } from "../support/pageobjects/HomePage";
import { navBarPage } from "../support/pageobjects/NavBarPage";
import { articleDetailPage } from "../support/pageobjects/ArticleDetailPage";
import { accountAPI } from "../support/api/accountAPI";
import { articleAPI } from "../support/api/articleAPI";

describe("Article actions", () => {
    beforeEach(() => {
        // The user will be logged in before each test

        // The log in will be done with the first user in user.json file
        cy.fixture("user.json")
            .as("users")
            .then((data) => {
                accountAPI.signInUserWithAPI(data.users[0].email, data.users[0].password);
                cy.visit("/");
            });
    });

    afterEach(() => {
        cy.visit("/");
        articleAPI.deleteArticleWithAPI();
    });

    it("should be able to create a new Article", () => {
        // The first time an End to End test is used

        const title = "New Article " + Date.now();
        const description = "This is an automated article";
        const body = "# Hello World";
        const tags = "test";

        navBarPage.clickNewArticleLink();

        articleFormPage.createNewArticle(title, description, body, tags);

        cy.visit("/");
        homePage.verifyLastCreatedArticleHasTitle(title);
    });

    it("should logged out user be able to see the article", () => {
        // This test creates an article via API, gets its url, then clearStorage and cookies, finally verify elements and try to comment
        articleAPI.addArticleWithAPI().then((response) => {
            cy.clearCookies();
            cy.clearLocalStorage();

            cy.visit(response.headers["hx-redirect"]); // This header returns the path to the created article

            // All elements will be verified to be visible
            articleDetailPage.verifyVisibilityOfTitle();
            articleDetailPage.verifyVisibilityOfAuthor();

            articleDetailPage.verifyDatesAreToday();

            articleDetailPage.verifyVisibilityOfContent();

            articleDetailPage.verifiyInvisibilityOfTextArea();
        });
    });

    it("should be able to edit an article", () => {
        // This test allows to edit an article via API, access and check its elements

        const title = "Edited title via Cypress";
        const description = "Edited description";
        const body = "Edited body";
        const tags = "test";

        articleAPI.addArticleWithAPI();
        cy.visit("/");

        articleAPI.editArticleWithAPI(title, description, body, tags).then((response) => {
            cy.visit(response.headers["hx-redirect"]);

            // Validations to verify the changes were made
            articleDetailPage.verifyVisibilityOfTitle();
            articleDetailPage.verifyAuthorLinksContainsText("automation");

            articleDetailPage.verifyVisibilityOfText(description);
            articleDetailPage.verifyVisibilityOfText(body);
        });
    });

    it.skip("should be able to like an article with another user", () => {
        // SKIPPED until figure out how to login again with the previous user
        // This test allows to login with another user and like an article

        articleAPI.addArticleWithAPI().then((response) => {
            // Cookies and storage are deleted, then the log in is performed with the second user
            cy.clearCookies();
            cy.clearLocalStorage();

            // The second user is taken from the fixture user.json
            cy.get("@users").then((data) => {
                accountAPI.signInUserWithAPI(data.users[1].email, data.users[1].password);
            });

            // Visit the url to the created article
            cy.visit(response.headers["hx-redirect"]);

            // Click on favorite post and check again that it has the class btn-outline-secondary
            articleDetailPage.clickFavoriteButton();
            articleDetailPage.verifyFavoriteButtonChangeStyle();
        });
    });
});
