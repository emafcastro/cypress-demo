import { maketoken } from "./utils"

Cypress.Commands.add('loginWithCredentials', (email, password)=> {
    cy.get('#id_username').type(email)
    cy.get('#id_password').type(password)
    cy.get('button.btn').click()
})


Cypress.Commands.add('loginWithAPI', (email,password) => {
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
    }).should((response) => {
        cy.log('Check if the user is correctly logged in')
        expect(response.status).to.eq(200)
    })

    cy.visit('/')
})



Cypress.Commands.add('deleteArticle', () => {
    // Delete article option does not exist on the webist, so this method is executed via request
    // The only way I found to delete an article is by setting two cookies before executing the method

    //cy.setCookie('csrftoken', 'Zpe3934sqarqMFa1fh1dvGn994woCikLEJDQniA6ohUsHdCVlX2yjemJ43Ujskob')
    //cy.setCookie('sessionid', 'zf4o9xkownkqpvunmecwf789el6war7d')
    
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

    if (title == undefined) {
        title = "New Article " + Date.now()
    }

    if (description == undefined){
        description = "This is an article created by API"
    }

    if (body == undefined) {
        body = "# Hello World"
    }

    if (tags == undefined) {
        tags = "test"
    }

    // Check if this is necessary for local
    //cy.setCookie('csrftoken', 'Zpe3934sqarqMFa1fh1dvGn994woCikLEJDQniA6ohUsHdCVlX2yjemJ43Ujskob')
    //cy.setCookie('sessionid', 'zf4o9xkownkqpvunmecwf789el6war7d')

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
    
            //Header for Local
            // headers: {
            //     'X-CSRFToken': 'Zpe3934sqarqMFa1fh1dvGn994woCikLEJDQniA6ohUsHdCVlX2yjemJ43Ujskob',
            //     'Content-Type': "multipart/form-data; boundary=--------------------------579482458443764609045166"
            // }
        })
    })
    
})


Cypress.Commands.add('editArticle', (title, description, body, tags) => {

    // TODO Check if all setCookie methods are necessary for local
    //cy.setCookie('csrftoken', 'Zpe3934sqarqMFa1fh1dvGn994woCikLEJDQniA6ohUsHdCVlX2yjemJ43Ujskob')
    //cy.setCookie('sessionid', 'zf4o9xkownkqpvunmecwf789el6war7d')



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
        
        // Check if this is necessary for local
        // cy.setCookie('csrftoken', 'Zpe3934sqarqMFa1fh1dvGn994woCikLEJDQniA6ohUsHdCVlX2yjemJ43Ujskob')
        // cy.setCookie('sessionid', 'zf4o9xkownkqpvunmecwf789el6war7d')

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

                // Values for local
                // headers: {
                //     'X-CSRFToken': 'Zpe3934sqarqMFa1fh1dvGn994woCikLEJDQniA6ohUsHdCVlX2yjemJ43Ujskob',
                //     'Content-Type': "multipart/form-data; boundary=--------------------------579482458443764609045166"
                // }
            })
        })

        cy.reload()

    })
})


Cypress.Commands.add('createUser', ()=>{
    cy.setCookie('csrftoken', 'Zpe3934sqarqMFa1fh1dvGn994woCikLEJDQniA6ohUsHdCVlX2yjemJ43Ujskob')
    cy.setCookie('sessionid', 'zf4o9xkownkqpvunmecwf789el6war7d')

    cy.request({
        method: 'POST',
        url: '/register/',
        body: {
            "email": `automated${Date.now()}@test.com`,
            "name": `automated${Date.now()}`,
            "password": "Test1234"
        },
        form: true,
        headers: {
            'X-CSRFToken': 'Zpe3934sqarqMFa1fh1dvGn994woCikLEJDQniA6ohUsHdCVlX2yjemJ43Ujskob',
            'Content-Type': "multipart/form-data; boundary=--------------------------579482458443764609045166"
        }
    })
})