/// <reference types="cypress" />
import { maketoken } from "../utils";

class BaseAPI {
    constructor() {
        this.csrftoken = "";
    }

    setCookie() {
        this.csrftoken = maketoken(64);
        return cy.setCookie("csrftoken", this.csrftoken);
    }

    getCookie(){
        return cy.getCookie("csrftoken")
    }
}

export default BaseAPI;
