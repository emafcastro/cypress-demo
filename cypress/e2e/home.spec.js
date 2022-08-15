/// <reference types="cypress" />
import { homePage } from "../support/pageobjects/HomePage";
import { accountAPI } from "../support/api/AccountAPI";
import { articleAPI } from "../support/api/ArticleAPI";

describe("Logged users actions", () => {
    beforeEach(() => {
        // The user will be logged in before each test
        cy.fixture("user.json")
            .as("users")
            .then((data) => {
                accountAPI.signInUserWithAPI(data.users[0].email, data.users[0].password);
                cy.visit("/");
            });
    });

    it("should be able to see my feed", () => {
        // This test verifies that the ownership of all articles in /?own are from the logged user

        // Wait until own articles finish loading
        cy.intercept("GET", "/?own").as("ownArticles"); //articleAPI.interceptOwnArticlesRequest()
        homePage.clickYourFeedLink();
        cy.wait("@ownArticles", { timeout: 6000 }); //articleAPI.waitForOwnArticles()

        // Then check every author contains the name of the first user
        homePage.verifyAuthorShouldBeFirstUser();
    });

    it("should be able to like an Article with a different user", () => {
        // This test allows to create a new article and then like with another user

        articleAPI.addArticleWithAPI();

        // Cookies and storage are deleted, then the log in is performed with the second user
        cy.clearCookies();
        cy.clearLocalStorage();

        cy.get("@users").then((data) => {
            accountAPI.signInUserWithAPI(data.users[1].email, data.users[1].password);
            cy.visit("/");
        });

        // Intercept the POST request after clicking like to wait until the process is finished
        cy.intercept("POST", "/article/favorite/**").as("favoriteArticle");

        // Press like button on created article and check again that it has the class btn-outline-secondary
        homePage.clickFavoriteInFirstArticle();
        cy.wait("@favoriteArticle", { timeout: 10000 });
        
        homePage.verifyFavoriteButtonChangeStyle();

        homePage.verifyFavoriteButtonContainsText("1");
    });

    it("should be able to verify if the count of articles decreases when an article is deleted", () => {
        // This test creates and deletes the article, checking before and after the length of the list of articles

        articleAPI.addArticleWithAPI().as("createdArticle");
        cy.visit("/");

        // The length of the list will be obtained
        homePage.verifyLengthOfArticlesWhenOneIsDeleted();
    });

    it("should be able to filter by tag", () => {
        // This test creates a new article with a different tag, then there is a verification to check the filter by tag

        const tag = "newTag";

        articleAPI.addArticleWithAPI({ tags: `${tag}` });
        cy.visit("/");

        // Wait until the page loads the specific articles for the tag
        cy.intercept("GET", "/?tag=newTag").as("getTag");
        homePage.clickOnPopularTag("newTag");
        cy.wait("@getTag", { timeout: 6000 });

        // Some articles contains more than one tag, so we iterate over each one and check if at least exist the created tag
        homePage.verifyAllDisplayedArticlesContainsTag(tag);
    });
});
