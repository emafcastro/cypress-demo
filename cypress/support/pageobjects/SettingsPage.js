/// <reference types="cypress" />
class SettingsPage {
    locators = {
        imageField: "#id_image",
        updateButton: "Update Settings",
        nameField: "#id_name",
        bioField: "#id_bio",
        emailField: "#id_email",
        passwordField: "#id_password",
    };

    typeInImageField(text) {
        cy.get(this.locators.imageField).clear().type(text);
    }

    clickUpdateButton() {
        cy.contains(this.locators.updateButton).click();
    }

    typeInNameField(text) {
        cy.get(this.locators.nameField).clear().type(text);
    }

    typeInBioField(text){
        cy.get(this.locators.bioField).clear().type(text);
    }

    typeInEmailField(text){
        cy.get(this.locators.emailField).clear().type(text);
    }

    typeInPasswordField(text){
        cy.get(this.locators.passwordField).clear().type(text);
    }

    getEmailFieldValue(){
        return cy.get(this.locators.emailField).invoke("attr", "value")
    }

    // VERIFICATIONS

    verifyEmailFieldHasText(text){
        cy.get(this.locators.emailField).invoke("attr", "value").should("eq", text);
    }
}
export const settingsPage = new SettingsPage();
