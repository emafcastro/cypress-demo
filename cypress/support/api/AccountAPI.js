/// <reference types="cypress" />
import BaseAPI from "./BaseAPI";

class AccountAPI extends BaseAPI {
    signUpUserWithAPI({ email, name, password } = {}) {
        //Create user via API

        if (email == undefined) {
            email = `automated${Date.now()}@test.com`;
        }

        if (name == undefined) {
            name = `automated${Date.now()}`;
        }

        if (password == undefined) {
            password = "Test1234";
        }

        return super.setCookie().request({
            method: "POST",
            url: "/register/",
            body: {
                email: email,
                name: name,
                password: password,
            },
            form: true,
            headers: {
                "X-CSRFToken": this.csrftoken,
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
        });
    }

    signInUserWithAPI(email, password) {
        return super.setCookie().request({
            method: "POST",
            url: "/login/",
            body: {
                username: email,
                password: password,
                csrfmiddlewaretoken: this.csrftoken,
            },
            form: true,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
        });
    }

    signInAPIWithFirstUserFromFixture(){
        cy.clearCookies();
        cy.fixture("user.json").then((data) => {
            this.signInUserWithAPI(data.users[0].email, data.users[0].password);
        });
    }

    signInAPIWithSecondUserFromFixture(){
        cy.fixture("user.json").then((data) => {
            this.signInUserWithAPI(data.users[1].email, data.users[1].password);
        });
    }
}

export const accountAPI = new AccountAPI();
