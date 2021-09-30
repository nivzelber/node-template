# Node template

This is a template project made for your needs!  
Fork me and save a ton of time on boilerplate and environment bootstrapping!
> Meant to be used by projects running `node.js`

## Fork Me!

### What's included?

* Typescript
* Configuration
* Linting with `eslint` and `prettier`
* Unit tests
* Logs with `winston`
* Git `pre-commit` and `pre-push` hooks
* Hot reloading

### What do I need to do to use this piece of heaven?

Just fork this project into another one, change the relevant fields (everything in \<this-format\>) in `package.json` and `package-lock.json` and you're good to go!

#### The Scripts

##### The ones you'll use

* `dev:once` run in development mode
* `test` run unit test

You can use `dev:watch` or `test:watch` for hot reloading.

##### The heroes that run in the background

* `build` compile code to javascript
* `start` run in production mode (`NODE_ENV` needs to be set)
* `lint` lint code files

To run in production mode just set `NODE_ENV` to your desired environment then run `npm run build && npm start`.

## Have fun!

This is a very powerful toll, however it is reasonable it won't satisfy every single one of your needs.  
I highly recommend forking this repository and editing it's settings or adding more instead of creating a new project from scratch.

## FAQ

> Q - How should I name my test files?  
> A - `some-name.spec.ts`

> Q - What if I want to add a `test` directory instead of having my test files next to the code files?  
> A - Edit `jest.config.js` *roots* field, `nodemon.json` *watch* field and `tsconfig.production.json` *exclude* field accordingly

> Q - Do I really need to go over all the fields in `package-lock.json`?  
> A - No, just change the *name* field in line 2

> Q - How do I change the pre commit and pre push git hooks?  
> A - Change the `pre-commit` and `pre-push` scripts in `package.json`
> 