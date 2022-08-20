import "./commands";
import { accountAPI } from "../support/api/AccountAPI";
const jsdom = require("jsdom");

before("Check if the users exist in the database", () => {
    cy.fixture("user.json").then((data) => {
        data.users.forEach((user) => {
            console.log(user);
            accountAPI.signInUserWithAPI(user.email, user.password).should((response) => {
                const dom = new jsdom.JSDOM(response.body);
                if (dom.window.document.querySelector(".error-messages") != null) {
                    console.log("Users does not exist. Creating users...");
                    accountAPI.signUpUserWithAPI(user.email, user.name, user.password);
                } else {
                    console.log("User already exist, the else will be deleted");
                }
            });
        });
    });
});
