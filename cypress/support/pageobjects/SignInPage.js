/// <reference types="cypress" />
class SignInPage {
    locators = {
        usernameField: "#id_username",
        passwordField: "#id_password",
        errorMessageSection: ".error-messages",
        signInButton: "button.btn",
    };

    loginWithCredentials(email, password){
        cy.get(this.locators.usernameField).type(email)
        cy.get(this.locators.passwordField).type(password)
        cy.get(this.locators.signInButton).click()
    }

    loginWithFirstUserFromFixture(){
        cy.fixture("user.json").then((data) => {
            // The request to the home needs to be intercepted in order to wait until home page is loaded
            cy.intercept("GET", "/").as("getHome");
            this.loginWithCredentials(data.users[0].email, data.users[0].password);
            cy.wait("@getHome", { timeout: 6000 });
        });
    }

    // VERIFICATIONS
    verifyUsernameFieldIsRequired() {
        cy.get(this.locators.usernameField).should("have.attr", "required");
    }

    verifyPasswordFieldIsRequired(){
        cy.get(this.locators.passwordField).should("have.attr", "required");
    }

    verifyErrorMessageContainsText(text){
        cy.get(this.locators.errorMessageSection).should("contain.text", text);
    }
}
export const signInPage = new SignInPage();
