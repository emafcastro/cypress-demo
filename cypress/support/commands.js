// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Will be used with an API method
Cypress.Commands.add('loginWithCredentials', (email, password)=> {
    cy.get('#id_username').type(email)
    cy.get('#id_password').type(password)
    cy.get('button.btn').click()
})


// Must convert these two commands in functions
Cypress.Commands.add('accessToArticleByName', (name)=>{
    cy.get('a > h1').contains(name).click()
})

Cypress.Commands.add('accessToArticleByIndex', (index) => {
    cy.get('.preview-link > a').eq(index).click()
})

// These two commands will be used with an API method
Cypress.Commands.add('createArticle', (title, description, body, tags)=>{
    cy.contains('New Article').click()
    cy.get('#id_title').type(title)
    cy.get('#id_summary').type(description)
    cy.get('#id_content').type(body)
    cy.get('[name=tags]').type(tags)
    cy.contains('Publish Article').click()
    cy.visit('/')
})

Cypress.Commands.add('deleteLastCreatedArticle', ()=>{
    cy.visit('/')
    cy.accessToArticleByIndex(0)
    cy.contains('Delete Article').click()
})