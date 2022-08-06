import { maketoken } from "./utils";
import SignInPage from "../support/pageobjects/SignInPage";

Cypress.Commands.add('loginWithCredentials', (email, password)=> {
    // Manual log in
    const signInPage = new SignInPage();
    signInPage.getUsernameField().type(email)
    signInPage.getPasswordField().type(password)
    signInPage.getSignInButton().click()
})


Cypress.Commands.add('loginWithAPI', (email,password) => {
    // Log in via API
    const csrftoken = maketoken(64)


    cy.setCookie('csrftoken', csrftoken)

    cy.request({
        method: 'POST',
        url: '/login/',
        body: {
            "username": email,
            "password": password,
            "csrfmiddlewaretoken": csrftoken
        },
        form: true,
        headers: {
            'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8"
        }
    })

})



Cypress.Commands.add('deleteArticle', () => {
    // Delete article via API
    
    cy.getCookie('csrftoken').then((cookie) => {

        cy.get('.article-preview > a').eq(0).invoke('attr', 'href').then((attr) => {
            // The id from the article is extracted so it can be used in the DELETE method
    
            const splitUrl = attr.split('/')
            cy.log(`Removing article with id: ${splitUrl[2]}`)
            cy.request({
                method: 'DELETE',
                url: `/article/delete/${splitUrl[2]}/`,
                headers: { 'X-CSRFToken': cookie.value }
            }).should((response) => {
                expect(response.status).to.eq(200)
            })
        })
        cy.visit('/')
    })
    
})

Cypress.Commands.add('addArticle', ({title, description, body, tags} = {}) => {

    // Add article via API

    cy.fixture('article.json').then((article) => {
        if (title == undefined) {
            title = article.title + Date.now()
        }
    
        if (description == undefined){
            description = article.summary
        }
    
        if (body == undefined) {
            body = article.content
        }
    
        if (tags == undefined) {
            tags = article.tags
        }
    })
    

    cy.getCookie('csrftoken').then((cookie) => {
        cy.request({
            method: 'POST',
            url: '/new/',
            body: {
                "title": title,
                "summary": description,
                "content": body,
                "tags": tags,
                "csrfmiddlewaretoken": cookie.value
            },
            form: true,
            headers: {
                'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
    })
    
})


Cypress.Commands.add('editArticle', (title, description, body, tags) => {

    // Edit article via API

    cy.getCookie('csrftoken').then((cookie) => {

        cy.get('.article-preview > a').eq(0).invoke('attr', 'href').then((attr) => {
            // The id from the article is extracted so it can be used in the DELETE method

            const splitUrl = attr.split('/')
            cy.log(`Removing article with id: ${splitUrl[2]}`)
            cy.request({
                method: 'POST',
                url: `/article/edit/${splitUrl[2]}/`,
                body: {
                    "title": title,
                    "summary": description,
                    "content": body,
                    "tags": tags,
                    "csrfmiddlewaretoken": cookie.value
                },
                form: true,
                headers: {
                    'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8"
                }
            })
        })
        
    })
    
})


Cypress.Commands.add('addComment', ()=> {
    // This command allows to add a comment on a created article
    cy.get('@createdArticle').then((response) => {
        const pathSplit = response.headers['hx-redirect'].split("/")
        
        cy.getCookie('csrftoken').then((cookie) => {
            cy.request({
                method: 'POST',
                url: `/comments/add/${pathSplit[2]}/`,
                body: {
                    "content": "comment created via API"
                },
                form: true,
                headers: {
                    'X-CSRFToken': cookie.value,
                    'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8"
                }

            })
        })

        cy.reload()

    })
})


Cypress.Commands.add('createUser', ({email, name, password}= {})=>{

    //Create user via API
    const csrftoken = maketoken(64)

    cy.setCookie('csrftoken', csrftoken)


    if (email == undefined){
        email = `automated${Date.now()}@test.com`
    }

    if (name == undefined){
        name = `automated${Date.now()}`
    }

    if (password == undefined){
        password = "Test1234"
    }

    cy.request({
        method: 'POST',
        url: '/register/',
        body: {
            "email": email,
            "name": name,
            "password": password
        },
        form: true,
        headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8"
        }
    })
})