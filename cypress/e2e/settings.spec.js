/// <reference types="cypress" />
import SettingsPage from "../support/pageobjects/SettingsPage"
import ProfilePage from "../support/pageobjects/ProfilePage"
import HomePage from "../support/pageobjects/HomePage"
import NavBarPage from "../support/pageobjects/NavBarPage"

describe('Settings actions', () => {

    const settingsPage = new SettingsPage();
    const profilePage = new ProfilePage();
    const navBarPage = new NavBarPage();

    beforeEach(() => {

        // The user will be logged in before each test
        cy.createUser()
        cy.visit('/')
        
    })

    it('should be able to see a profile picture', () => {
        // This test changes the profile picture and verifies the change on the profile
        navBarPage.getSettingsLink().click()
        settingsPage.getImageField().clear().type('https://www.goarabic.com/vm/wp-content/uploads/2019/05/dummy-profile-pic.jpg')
        settingsPage.getUpdateButton().click()
        profilePage.getMainProfileImage().invoke('attr', 'src').should('eq','https://www.goarabic.com/vm/wp-content/uploads/2019/05/dummy-profile-pic.jpg')
    })

    it('should be able to change the username', () => {
        // This test edits the username and verifies the change
        navBarPage.getSettingsLink().click()
        settingsPage.getNameField().clear().type('EditedName')
        settingsPage.getUpdateButton().click()
        cy.contains('EditedName').should('be.visible')
    })

    it('should be able to set a bio', () => {
        // This test edits the bio and verifies the change
        navBarPage.getSettingsLink().click()
        cy.get('#id_bio').clear().type('New Bio')
        settingsPage.getUpdateButton().click()
        cy.contains('New Bio').should('be.visible')
    })

    it('should be able to change the email', () => {
        // This test edits the email and verifies the change by logging in with the new email
        const newMail = `edited${Date.now()}@test.com`

        cy.intercept('POST','/settings/').as('updatedProfile')
        navBarPage.getSettingsLink().click()
        settingsPage.getEmailField().clear().type(newMail)
        settingsPage.getUpdateButton().click()
        cy.wait('@updatedProfile', { timeout: 6000 } )
        
        cy.clearCookies()
        cy.clearLocalStorage()

        cy.loginWithAPI(newMail, "Test1234")
        cy.visit('/')
        
        navBarPage.getSettingsLink().click()
        settingsPage.getEmailField().invoke('attr', 'value').should('eq', newMail)
        
    })

    it('should be able to change the password', () => {
        // This test edits the password and verifies the change by logging in with the new password
        cy.intercept('POST','/settings/').as('updatedProfile')
        navBarPage.getSettingsLink().click()
        settingsPage.getEmailField().invoke('attr', 'value').as('email')
        settingsPage.getPasswordField().clear().type("Test5678")
        settingsPage.getUpdateButton().click()
        cy.wait('@updatedProfile', { timeout: 6000 } )
        
        cy.clearCookies()
        cy.clearLocalStorage()

        cy.get('@email').then((email) => {
            cy.loginWithAPI(email, "Test5678")
            cy.visit('/')
        })
        navBarPage.getSignOutLink().should('be.visible')
    })
})