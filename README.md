# ctng Angular libraries

This is a set of libraries for Angular services, pipes and directives, which can be used in most of the Angular projects.

- The repository consists of multiple libraries, all of them live in the `projects/ctng/` folder:
  - [@ctng/core](projects/ctng/core/README.md)
  - [@ctng/common](projects/ctng/common/README.md)
  - [@ctng/auth](projects/ctng/auth/README.md)
  - [@ctng/auth-jwt-ls](projects/ctng/auth-jwt-ls/README.md)
  - [@ctng/localization](projects/ctng/localization/README.md)
  - [@ctng/testing](projects/ctng/testing/README.md)
  - [@ctng/wordpress](projects/ctng/wordpress/README.md)
- Additionally there is a normal Angular application `ctng-app` as main app. The purpose of this app is to test and develop libraries with a consuming app in a simple way. It should have a seperate route for each library

# Development

## Committing

This repository does automatically increase npm versions, add CHANGELOGS and deploy npm packages to the registry in the CI build. The CHANGELOG entries and automatic npm versions are determined by inspecting the git commit messages. That's why we have to do git message conventions. We will use the [conventional commit convention](https://www.conventionalcommits.org/en/v1.0.0-beta.2/). To simplify the process of creating a commit message you can use `npm run commit` to commit changes to this repository.

## Adding a library

- Add a library by running `npm run add @ctng/lib-name`
- Navigate to your library and use the [karma.base.conf.js](projects/karma.base.conf.js) in the new local karma.conf.js (see other libraries)
- Add a empty `CHANGELOG.md` file to library root directory

## Develop a library internal

You'll need two consoles for library development

1. Run `npm run build:watch ctng/lib-name` to start the watch build for the library
2. In a different console, run `npm start` to serve the `ctng-app`
3. Changes in the library reload the app automatically

## Available NPM Scripts

- `npm install`: Installs all npm dependencies
- `npm start`: Starts the ctng-app
- `npm add`: Adds a library to the repository. Arguments:
  - \$1: `@ctng/library-name`
- `npm build`: Builds the `ctng-app` if no argument is provided. Optional arguments:
  - \$1: A library to build, e.g. `@ctng/library-name`
- `npm build:watch`: Builds the specified library in watching mode. Arguments:
  - \$1: A library to build, e.g. `ctng/library-name`
- `npm build:libs`: Builds all libraries in this repo
- `npm test`: Tests all projects (Attention: This will not work, when all projects are running in watch mode). Optional arguments:
  - \$1: A library to test, e.g. `@ctng/library-name`
- `npm test:app`: Tests the `ctng-app` in watching mode. Optional arguments:
- `npm test:libs`: Runs all tests of all libraries in this repo
- `npm lint`: Lints the `ctng-app` if no argument is provided. Optional arguments:
  - \$1: A library to lint, e.g. `@ctng/library-name`
- `npm lint:libs`: Lints all libraries in this repo
- `npm commit`: Commit any changes via conventional commit messages
- `npm semver`: Checks all versions of all libraries, increases the versions if necessary and tags & pushes them back to repo
- `npm deploy`: Publishes all libraries to the npm registry

## Develop a library with an external application (Not tested!!)

In some cases, we need to develop, debug or test this library within an Angular application, which is consuming it from outside this reposiroty. In this case we need to setup the consuming application to enable live reload.

1. Change the `angular.json` file in the base path of your angular application:

   a) Add a new `build:configuration` section named `libs` below the `production` configuration with the following content: `"libs": { "tsConfig": "src/tsconfig.libs.json"}`. This tells the Typescript compiler to use this Typescript configuration file

   b) Add a new `serve:configuration` section named `libs` below the `production` configuration with the following content: `"libs": {"browserTarget": "ctng-app:build:libs"}`. This tells the Angular serve command with `--configuration=libs` to use the `build:libs` configuration

2. Add a new file named `tsconfig.libs.json` in the `src` folder of the Angular application right next to `tsconfig.app.json` with the following content:

   **NOTE: You have to replace `PATH TO THE LIBRARY DIST FOLDER` with the relative path to the dist folder of the library you want to import**

   {
   "extends": "../tsconfig.json",
   "compilerOptions": {
   "outDir": "../out-tsc/app",
   "types": [],
   "paths": {
   "@ctng/core": [
   "PATH TO THE LIBRARY DIST FOLDER"
   ],
   "_": [
   "node_modules/_"
   ]
   }
   },
   "exclude": [
   "test.ts",
   "**/*.spec.ts"
   ]
   }

3. Add the `src/tsconfig.lib.json` to the `.gitignore` file

4. Start building your library with `npm build:watch @ctng/lib-name`

5. Start serving your application with `ng serve --configuration=libs`
