/// <reference types="cypress" />
import { settingsPage } from "../support/pageobjects/SettingsPage";
import { profilePage } from "../support/pageobjects/ProfilePage";
import { navBarPage } from "../support/pageobjects/NavBarPage";
import { accountAPI } from "../support/api/accountAPI";

describe("Settings actions", () => {
    beforeEach(() => {
        // The user will be logged in before each test
        accountAPI.signUpUserWithAPI();
        cy.visit("/");
    });

    it("should be able to see a profile picture", () => {
        // This test changes the profile picture and verifies the change on the profile
        navBarPage.clickSettingsLink();
        settingsPage.typeInImageField("https://www.goarabic.com/vm/wp-content/uploads/2019/05/dummy-profile-pic.jpg");
        settingsPage.clickUpdateButton();
        profilePage.verifyProfileImageHasUrl("https://www.goarabic.com/vm/wp-content/uploads/2019/05/dummy-profile-pic.jpg");
    });

    it("should be able to change the username", () => {
        // This test edits the username and verifies the change
        navBarPage.clickSettingsLink();
        settingsPage.typeInNameField("EditedName");
        settingsPage.clickUpdateButton();
        profilePage.verifyTextIsVisible("EditedName");
    });

    it("should be able to set a bio", () => {
        // This test edits the bio and verifies the change
        navBarPage.clickSettingsLink();
        settingsPage.typeInBioField("New Bio");
        settingsPage.clickUpdateButton();
        profilePage.verifyTextIsVisible("New Bio");
    });

    it("should be able to change the email", () => {
        // This test edits the email and verifies the change by logging in with the new email
        const newMail = `edited${Date.now()}@test.com`;

        cy.intercept("POST", "/settings/").as("updatedProfile");
        navBarPage.clickSettingsLink();
        settingsPage.typeInEmailField(newMail);
        settingsPage.clickUpdateButton();
        cy.wait("@updatedProfile", { timeout: 6000 });

        cy.clearCookies();
        cy.clearLocalStorage();

        accountAPI.signInUserWithAPI(newMail, "Test1234");
        cy.visit("/");

        navBarPage.clickSettingsLink();
        settingsPage.verifyEmailFieldHasText(newMail);
    });

    it("should be able to change the password", () => {
        // This test edits the password and verifies the change by logging in with the new password
        cy.intercept("POST", "/settings/").as("updatedProfile");
        navBarPage.clickSettingsLink();
        settingsPage.getEmailFieldValue().as("email");
        settingsPage.typeInPasswordField("Test5678");
        settingsPage.clickUpdateButton();
        cy.wait("@updatedProfile", { timeout: 6000 });

        cy.clearCookies();
        cy.clearLocalStorage();

        cy.get("@email").then((email) => {
            accountAPI.signInUserWithAPI(email, "Test5678");
            cy.visit("/");
        });
        
        navBarPage.verifySignOutLinkIsVisible();
    });
});
