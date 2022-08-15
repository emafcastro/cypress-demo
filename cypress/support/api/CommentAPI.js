/// <reference types="cypress" />
import BaseAPI from "./BaseAPI";
class CommentAPI extends BaseAPI {
    addCommentWithAPI() {
        // This command allows to add a comment on a created article
        return cy.get("@createdArticle").then((response) => {
            const pathSplit = response.headers["hx-redirect"].split("/");

            super.getCookie().then((cookie) => {
                cy.request({
                    method: "POST",
                    url: `/comments/add/${pathSplit[2]}/`,
                    body: {
                        content: "comment created via API",
                    },
                    form: true,
                    headers: {
                        "X-CSRFToken": cookie.value,
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                });
            });

            cy.reload();
        });
    }
}

export const commentAPI = new CommentAPI();
