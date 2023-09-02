# monorepo-template

> A basic template for creating a library monorepo using Nx

## Get started

- Run `npm i`
- Run `npm run add:lit some-component-name`
- Run `npm start`
- Start developing

## Project structure

`/packages` - Contains the packages to be published. Won't exist until you create your first package
`/docs` - Contains the docs application that serves package documentation and demos. It can(and, if published, _should_) be customized, but should just work(tm) as is to get started.
`/utilities` - Contains shared configurations and nx plugins.

## Commands

- `npm start` - Starts the repo up for development using the `build` command in all apps and packages. NX will first look for `build` in package.json then in project.json.
- `npm run add:<type> <package-name>` - Runs `nx g <type> <package-name>`
  -- Currently the only available type is `lit`.
- `npm run rm <package-name>` - Runs `nx g rm <package-name>`
  -- _Note: if you remove the last package then the packages folder will get removed as well. There's probably a way to prevent it, but you can't check an empty folder into git anyway, so... yeah..._

- `npx nx g add-to-docs <package-name>` - Adds an existing package to the docs app and generates an import helper. Called automatically by component generators.
- `npx nx g lit <package-name>` - Creates a lit component package and runs `add-to-docs`.
- `npx nx g regenerate-lockfile` - Removes `package-lock.json` and `node_modules/.package-lock.json` and re-runs `npm install` to regenerate lockfiles. Because lockfiles get crappy sometimes.
- `npx nx g remove-from-docs <package-name>` - Removes a package from the docs app and deletes its import helper. Called automaticallt by the `rm` generator.
- `npx nx g rm <package-name>` - Removes a packages files and runs `remove-from-docs`.
- `npx nx g update-shared-json` - Copies shared properties from root package.json to docs and packages and copies root `dependencies` to docs and to all packages as `peerDependencies`.
  -- _Note: packages removed from root dependencies will not automatically be removed from workspace package.json files._
