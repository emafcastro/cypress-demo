// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')


// TODO Investigate how to use fixtures and replace hardcoded credentials in the test with data in user.json
// TODO Evaluate if it is necessary to create a new user on every test, or maybe check if the users exists, 
// this is necessary when the database does not have the users automation and like
// also it can be useful if the tester wants to change the test users, with a modification of user.json
// TODO Refactor and remove the additions cy.setCookie that are not needed
// TODO Document the commands in command.d.ts