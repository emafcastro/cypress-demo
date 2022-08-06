class SignInPage {
    getUsernameField(){
        return cy.get('#id_username')
    }

    getPasswordField(){
        return cy.get('#id_password')
    }

    getErrorMessageSection(){
        return cy.get('.error-messages')
    }

    getSignInButton(){
        return cy.get('button.btn')
    }
}
export default SignInPage