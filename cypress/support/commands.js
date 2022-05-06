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

// These two commands will be used with an API method
Cypress.Commands.add('loginWithCredentials', (email, password)=> {
    cy.get('#id_username').type(email)
    cy.get('#id_password').type(password)
    cy.get('button.btn').click()
})


Cypress.Commands.add('createArticle', (title, description, body, tags)=>{
    cy.contains('New Article').click()
    cy.get('#id_title').type(title)
    cy.get('#id_summary').type(description)
    cy.get('#id_content').type(body)
    cy.get('[name=tags]').type(tags)
    cy.contains('Publish Article').click()
    cy.visit('/')
})


Cypress.Commands.add('deleteArticle', () => {
    // There is not exist any option or button to delete an article, this method is executed via request
    // The only way I found to delete an article is by setting two cookies before executing the method

    cy.setCookie('csrftoken', 'Zpe3934sqarqMFa1fh1dvGn994woCikLEJDQniA6ohUsHdCVlX2yjemJ43Ujskob')
    cy.setCookie('sessionid', 'zf4o9xkownkqpvunmecwf789el6war7d')
    cy.get('.article-preview > a').invoke('attr', 'href').then((attr) => {
        // The id from the article is extracted so it can be used in the DELETE method
        console.log(attr)

        const splitUrl = attr.split('/')
        console.log(splitUrl)
        cy.log(`Removing article with id: ${splitUrl[2]}`)
        cy.request({
            method: 'DELETE',
            url: `/article/delete/${splitUrl[2]}/`,
            headers: { 'X-CSRFToken': 'Zpe3934sqarqMFa1fh1dvGn994woCikLEJDQniA6ohUsHdCVlX2yjemJ43Ujskob' }
        }).should((response) => {
            expect(response.status).to.eq(200)
        })
    })
    cy.visit('/')
})


// TODO Create a command for user creation