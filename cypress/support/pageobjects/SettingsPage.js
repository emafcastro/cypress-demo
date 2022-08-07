class SettingsPage{
    getImageField(){
        return cy.get('#id_image')
    }

    getUpdateButton(){
        return cy.contains('Update Settings')
    }

    getNameField(){
        return cy.get('#id_name')
    }

    getBioField(){
        return cy.get('#id_bio')
    }

    getEmailField(){
        return cy.get('#id_email')
    }

    getPasswordField(){
        return cy.get('#id_password')
    }
}
export default SettingsPage