/// <reference types="cypress" />
import { commentPage } from "../support/pageobjects/CommentPage";
import { accountAPI } from "../support/api/AccountAPI";
import { articleAPI } from "../support/api/ArticleAPI";
import { commentAPI } from "../support/api/CommentAPI";

describe("Comment actions", () => {
    beforeEach(() => {
        // The user will be logged in before each test
        accountAPI.signInAPIWithFirstUserFromFixture();

        // A new article will be created to work with each comment test
        articleAPI.addArticleWithAPI()
            .as("createdArticle")
            .then((response) => {
                cy.visit(response.headers["hx-redirect"]);
            });
    });

    it("should be able to leave a comment", () => {
        // Manual test to add a new comment
        commentPage.typeComment("random comment");
        commentPage.clickPostButton();
        commentPage.verifyVisibilityOfComment("random comment");
    });

    it("should be able to delete a comment", () => {
        // A new comment is added via API, then manually the delete button is selected
        // The only validation that will be done is to check the message, because Cypress automatically accepts every alert

        commentAPI.addCommentWithAPI();
        commentPage.clickDeleteCommentButton();
        commentPage.verifyConfirmationMessage();
    });

    it("should be able to edit a comment", () => {
        // Manual test to edit a comment created via API

        // Intercept and wait are used to wait for the textarea to be enable for edition
        cy.intercept("GET", "/comments/edit/**").as("getComment");
        commentAPI.addCommentWithAPI();
        commentPage.clickEditCommentButton();
        cy.wait("@getComment", { timeout: 10000 });

        commentPage.typeLastPostedComment("Edited comment");
        commentPage.clickSaveCommentButton();
        
        commentPage.verifyVisibilityOfComment("Edited comment");
    });
});
