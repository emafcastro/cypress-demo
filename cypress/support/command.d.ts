/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
        /**
         * Login user manually with @email and @password
         * 
         * @email
         * User email
         * 
         * @password
         * User password
         * 
         * @example
         * cy.loginWithCredentials('email@email.com', 'password')
         */
        loginWithCredentials(email: string, password: string)

        /**
        * Login user via API with @email and @password
        * 
        * @email
        * User email
        * 
        * @password
        * User password
        * 
        * @example
        * cy.loginWithAPI('email@email.com', 'password')
        */
        loginWithAPI(email: string, password: string)


        /**
         * Delete the first article in the list via API
         */
        deleteArticle()

        /**
         * Add a new article via API
         * This article is loaded with data from /fixture/article.json
         */
        addArticle()

        /**
        * Add a new article via API with @title , @description , @body and @tags
        * If there are missing parameters, those are completed with data from /fixture/article.json
        * 
        * @title
        * Title of the article
        * 
        * @description
        * Description of the article
        * 
        * @body
        * Body of the article, this accepts markdown
        * 
        * @tags
        * List of tags, separated by comma
        * 
        * @example
        * cy.addArticle({title:"Hello", description:"Hello World", body:"# This is the body", tags:"tag1,tag2"})
        * cy.addArticle({tags:"tag1,tag2"})
        * 
        */
        addArticle({ title, description, body, tags }: { title: string, description: string, body: string, tags: string })


        /**
        * Edit an article via API with @title , @description , @body and @tags
        * 
        * @title
        * Title of the article
        * 
        * @description
        * Description of the article
        * 
        * @body
        * Body of the article, this accepts markdown
        * 
        * @tags
        * List of tags, separated by comma
        * 
        * @example
        * cy.editArticle("Hello", "Hello World", "# This is the body", "tag1,tag2")
         * 
         */
        editArticle(title: string, description: string, body: string, tags: string)

        /**
         * Add a predefined comment via API
         * A new created article is required to be executed before this method
         */
        addComment()

        /**
         * Creates a new user via API with data from /fixture/user.json
         */
        createUser()

        /**
        * Creates a new user via API with @email , @name, and @password
        * 
        * @email
        * User email
        * 
        * @name
        * User name 
        * 
        * @password
        * User password
        * 
        * @example
        * cy.createUser({email: "test@email.com", name: "test", password: "Test1234"})
        */
        createUser({email, name, password}:{email:string, name: string, password: string})
    }
}