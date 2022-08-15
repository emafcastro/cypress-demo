/// <reference types="cypress" />
class ProfilePage {
    locators = {
        profileImage: "img",
    };

    verifyProfileImageHasUrl(url) {
        cy.get(this.locators.profileImage).eq(0).invoke("attr", "src").should("eq", url);
    }

    verifyTextIsVisible(text){
        cy.contains(text).should("be.visible");
    }
}
export const profilePage = new ProfilePage();
