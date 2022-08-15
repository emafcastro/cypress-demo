/// <reference types="cypress" />
class NavBarPage{

    locators = {
        navLinks: 'nav ul > li > a',
        signOutLink: 'Sign Out',
        newArticleLink: 'New Article',
        settingsLink: 'Settings'
    }
    
    clickNewArticleLink(){
        cy.get(this.locators.navLinks).contains(this.locators.newArticleLink).click();
    }

    clickSignOutLink(){
        cy.get(this.locators.navLinks).contains(this.locators.signOutLink).click();
    }

    clickSettingsLink(){
        cy.get(this.locators.navLinks).contains(this.locators.settingsLink).click();
    }

    // VERIFICATIONS

    verifySignOutLinkIsVisible(){
        cy.get(this.locators.navLinks).contains(this.locators.signOutLink).should("be.visible");
    }
}
export const navBarPage = new NavBarPage()