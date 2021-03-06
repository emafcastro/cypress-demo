/// <reference types="cypress" />

describe('Settings actions', () => {

    beforeEach(() => {

        // The user will be logged in before each test
        cy.createUser()
        cy.visit('/')
        
    })

    it('should be able to see a profile picture', () => {
        // This test changes the profile picture and verifies the change on the profile
        cy.contains('Settings').click()
        cy.get('#id_image').clear().type('https://www.goarabic.com/vm/wp-content/uploads/2019/05/dummy-profile-pic.jpg')
        cy.contains('Update Settings').click()
        cy.get('img').eq(0).invoke('attr', 'src').should('eq','https://www.goarabic.com/vm/wp-content/uploads/2019/05/dummy-profile-pic.jpg')
    })

    it('should be able to change the username', () => {
        // This test edits the username and verifies the change
        cy.contains('Settings').click()
        cy.get('#id_name').clear().type('EditedName')
        cy.contains('Update Settings').click()
        cy.contains('EditedName').should('be.visible')
    })

    it('should be able to set a bio', () => {
        // This test edits the bio and verifies the change
        cy.contains('Settings').click()
        cy.get('#id_bio').clear().type('New Bio')
        cy.contains('Update Settings').click()
        cy.contains('New Bio').should('be.visible')
    })

    it('should be able to change the email', () => {
        // This test edits the email and verifies the change by logging in with the new email
        const newMail = `edited${Date.now()}@test.com`

        cy.intercept('POST','/settings/').as('updatedProfile')
        cy.contains('Settings').click()
        cy.get('#id_email').clear().type(newMail)
        cy.contains('Update Settings').click()
        cy.wait('@updatedProfile', { timeout: 6000 } )
        
        cy.clearCookies()
        cy.clearLocalStorage()

        cy.loginWithAPI(newMail, "Test1234")
        cy.visit('/')
        
        cy.contains('Settings').click()
        cy.get('#id_email').invoke('attr', 'value').should('eq', newMail)
        
    })

    it('should be able to change the password', () => {
        // This test edits the password and verifies the change by logging in with the new password
        cy.intercept('POST','/settings/').as('updatedProfile')
        cy.contains('Settings').click()
        cy.get('#id_email').invoke('attr', 'value').as('email')
        cy.get('#id_password').clear().type("Test5678")
        cy.contains('Update Settings').click()
        cy.wait('@updatedProfile', { timeout: 6000 } )
        
        cy.clearCookies()
        cy.clearLocalStorage()

        cy.get('@email').then((email) => {
            cy.loginWithAPI(email, "Test5678")
            cy.visit('/')
        })
        cy.contains('Sign Out').should('be.visible')
    })
})