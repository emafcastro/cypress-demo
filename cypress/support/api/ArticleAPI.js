/// <reference types="cypress" />
import BaseAPI from "./BaseAPI";
class ArticleAPI extends BaseAPI {
    addArticleWithAPI({ title, description, body, tags } = {}) {
        // Add article via API

        cy.fixture("article.json").then((article) => {
            if (title == undefined) {
                title = article.title + Date.now();
            }

            if (description == undefined) {
                description = article.summary;
            }

            if (body == undefined) {
                body = article.content;
            }

            if (tags == undefined) {
                tags = article.tags;
            }
        });

        return super.getCookie().then((cookie) => {
            cy.request({
                method: "POST",
                url: "/new/",
                body: {
                    title: title,
                    summary: description,
                    content: body,
                    tags: tags,
                    csrfmiddlewaretoken: cookie.value,
                },
                form: true,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
            });
        });
    }

    deleteArticleWithAPI() {
        return super.getCookie().then((cookie) => {
            cy.get(".article-preview > a")
                .eq(0)
                .invoke("attr", "href")
                .then((attr) => {
                    // The id from the article is extracted so it can be used in the DELETE method

                    const splitUrl = attr.split("/");
                    cy.log(`Removing article with id: ${splitUrl[2]}`);
                    cy.request({
                        method: "DELETE",
                        url: `/article/delete/${splitUrl[2]}/`,
                        headers: { "X-CSRFToken": cookie.value },
                    }).should((response) => {
                        expect(response.status).to.eq(200);
                    });
                });
            cy.visit("/");
        });
    }

    editArticleWithAPI(title, description, body, tags) {
        // Edit article via API

        return super.getCookie().then((cookie) => {
            cy.get(".article-preview > a")
                .eq(0)
                .invoke("attr", "href")
                .then((attr) => {
                    // The id from the article is extracted so it can be used in the DELETE method

                    const splitUrl = attr.split("/");
                    cy.log(`Removing article with id: ${splitUrl[2]}`);
                    cy.request({
                        method: "POST",
                        url: `/article/edit/${splitUrl[2]}/`,
                        body: {
                            title: title,
                            summary: description,
                            content: body,
                            tags: tags,
                            csrfmiddlewaretoken: cookie.value,
                        },
                        form: true,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        },
                    });
                });
        });
    }
}

export const articleAPI = new ArticleAPI();
