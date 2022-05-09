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

// TODO This command will be used with an API method
Cypress.Commands.add('loginWithCredentials', (email, password)=> {
    cy.get('#id_username').type(email)
    cy.get('#id_password').type(password)
    cy.get('button.btn').click()
})



Cypress.Commands.add('deleteArticle', () => {
    // Delete article option does not exist on the webist, so this method is executed via request
    // The only way I found to delete an article is by setting two cookies before executing the method

    cy.setCookie('csrftoken', 'Zpe3934sqarqMFa1fh1dvGn994woCikLEJDQniA6ohUsHdCVlX2yjemJ43Ujskob')
    cy.setCookie('sessionid', 'zf4o9xkownkqpvunmecwf789el6war7d')
    cy.get('.article-preview > a').eq(0).invoke('attr', 'href').then((attr) => {
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

Cypress.Commands.add('addArticle', (tags) => {
    // TODO Investigate about adding an article with more than one tag
    const title = "New Article " + Date.now()
    const description = "This is an article created by API"
    const body = "# Hello World"

    if (tags == undefined) {
        tags = "test"
    }

    cy.setCookie('csrftoken', 'Zpe3934sqarqMFa1fh1dvGn994woCikLEJDQniA6ohUsHdCVlX2yjemJ43Ujskob')
    cy.setCookie('sessionid', 'zf4o9xkownkqpvunmecwf789el6war7d')

    cy.request({
        method: 'POST',
        url: '/new/',
        body: {
            "title": title,
            "summary": description,
            "content": body,
            "tags": tags
        },
        form: true,
        headers: {
            'X-CSRFToken': 'Zpe3934sqarqMFa1fh1dvGn994woCikLEJDQniA6ohUsHdCVlX2yjemJ43Ujskob',
            'Content-Type': "multipart/form-data; boundary=--------------------------579482458443764609045166"
        }
    })
})

Cypress.Commands.add('addComment', ()=> {
    // This command allows to add a comment on a created article
    cy.get('@createdArticle').then((response) => {
        const pathSplit = response.headers['hx-redirect'].split("/")
        
        cy.setCookie('csrftoken', 'Zpe3934sqarqMFa1fh1dvGn994woCikLEJDQniA6ohUsHdCVlX2yjemJ43Ujskob')
        cy.setCookie('sessionid', 'zf4o9xkownkqpvunmecwf789el6war7d')

        cy.request({
            method: 'POST',
            url: `/comments/add/${pathSplit[2]}/`,
            body: {
                "content": "comment created via API"
            },
            form: true,
            headers: {
                'X-CSRFToken': 'Zpe3934sqarqMFa1fh1dvGn994woCikLEJDQniA6ohUsHdCVlX2yjemJ43Ujskob',
                'Content-Type': "multipart/form-data; boundary=--------------------------579482458443764609045166"
            }
        })

        cy.reload()

    })
})

// TODO Create a command for user creation