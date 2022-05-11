# cypress-demo

This is a demo run using Cypress framework. \
This demo is using The RealWorld application, specifically an implementation done in Django. If you want to test locally, you can clone the repository following the instructions in the next link:

https://github.com/danjac/realworld

Or you can the baseUrl I'm using on cypress.json, it's the same project  but I deployed it on Heroku.
<br />
<br />
## How this demo works

After you clone this repository, simply execute

> npm install

And to run the tests against the heroku app
> npm run cypress 

or if you want to run it against the local url (remember to follow the steps from the realworld repository first)

> npm run cy:run:local