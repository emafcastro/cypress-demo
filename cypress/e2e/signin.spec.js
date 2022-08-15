/// <reference types="cypress" />
import { signInPage } from "../support/pageobjects/SignInPage";
import { navBarPage } from "../support/pageobjects/NavBarPage";

describe("Login actions", () => {
    context("Login page validations", () => {
        beforeEach(() => cy.visit("/login"));

        it("should display both email and password fields as required", () => {
            // This test checks if the fields are required
            signInPage.verifyUsernameFieldIsRequired();
            signInPage.verifyPasswordFieldIsRequired();
        });

        it("should display an error message when a field is empty", () => {
            // This test verifies the error message when the email is empty
            signInPage.loginWithCredentials(" ", "Test1234");
            signInPage.verifyErrorMessageContainsText("* This field is required.");
        });

        it("should display an error message when email and password does not match", () => {
            // This test check the error message when the credentials are incorrect
            signInPage.loginWithCredentials("automation@test.com", " ");
            signInPage.verifyErrorMessageContainsText(
                "* Please enter a correct Email Address and password. Note that both fields may be case-sensitive."
            );
            signInPage.loginWithCredentials("automation", "Test1234");
            signInPage.verifyErrorMessageContainsText(
                "* Please enter a correct Email Address and password. Note that both fields may be case-sensitive."
            );
        });
    });

    context("Successful Login", () => {
        beforeEach(() => cy.visit("/login"));

        it("should logging with correct credentials", () => {
            // This test validates the user can log in correctly
            signInPage.loginWithFirstUserFromFixture();
            navBarPage.verifySignOutLinkIsVisible();
        });
    });
});
