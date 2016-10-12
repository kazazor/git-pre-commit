# Change log
[![NPM](https://nodei.co/npm/git-pre-commit.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/git-pre-commit/)

## Future release
* **Tests**
  * Added [Travis-CI](https://travis-ci.org/kazazor/git-pre-commit) build to the repository in order to run the tests on every push / PR. [Node.js](https://nodejs.org/en/) version to run at build are: 0.12.x, 4.0.x, 4.1.x, 4.2.x, 4.3.x, 5.7.x & 5.x.x - [#11](https://github.com/kazazor/git-pre-commit/issues/11).
  * Added tests to the repository using [mocha](https://mochajs.org/) - [#12](https://github.com/kazazor/git-pre-commit/issues/12).

## v2.1.1
* **Fixes**
  * Fixed the broken version `2.1.0`.

## v2.1.0 - Broken version, fixed on version `2.1.1`
* **Improvements**
  * Added support for [yarn](https://yarnpkg.com/). Now if `yarn.lock` file exists, it will use `yarn` to execute the Node script instead of `npm` - [#29](https://github.com/kazazor/git-pre-commit/issues/29).

## v2.0.1
* **Fixes**
  * Fixed the issue for where uninstalled globally executables didn't work for the pre-commit hook - [#26](https://github.com/kazazor/git-pre-commit/issues/26).

## v2.0.0
* **Breaking changes**
  * The package now supports only Node version >=6.0.0
* **Improvements**
  * Removed the use of `vinyl-fs` for faster installation.
  * Changed the codebase to use ES6 syntax.
* **Fixes**
  * Removing the use of symlink so installing on Windows machine doesn't require administrator permissions - [#19](https://github.com/kazazor/git-pre-commit/issues/19).

## v1.0.2
* **Fixes**
  * When there is no git repository, exit with no error code (0 instead of 1) - [#23](https://github.com/kazazor/git-pre-commit/issues/23)
  * Removed `fs` dependency since it is part of npm core.

## v1.0.1
* **Breaking changes**
  * Moved the `precommit` entry to the `scripts` section in the `package.json` file.

## v0.1.13
* **Fixes**
  * Fixed the issue that you couldn't run `git commit --amend` - [#18](https://github.com/kazazor/git-pre-commit/issues/18).

## v0.1.11
* **Fixes**
  * Fixed the issue where the order of the stashing caused an issue when ```package.json``` file has an issue in it - [#17](https://github.com/kazazor/git-pre-commit/issues/17).

## v0.1.8
* **Fixes**
  * Fixed the issue when there isn't any precommit entry in the package.json file and the git commit command actually commits the code -  [#16](https://github.com/kazazor/git-pre-commit/issues/16).
  * Fixed the issue when you couldn't perform the pre-commit task when the commit was the initial commit in the repository - [#8](https://github.com/kazazor/git-pre-commit/issues/8).
* **Development**
  * Added dev/dependencies monitoring using [https://david-dm.org](https://david-dm.org), to keep the project's dependencies up to date - [#15](https://github.com/kazazor/git-pre-commit/issues/15).

## v0.1.7 (25-Feb-2016)
* **Fixes**
  * Fixed the issue where the pre-commit hook didn't work on SourceTree on OSX machines [#2](https://github.com/kazazor/git-pre-commit/issues/2).

## v0.1.4 (20-Feb-2016)
* **Fixes**
  * Fixed the issue that the package results with an error regarding run-sequence when it was used as a sub module in other projects -  [#7](https://github.com/kazazor/git-pre-commit/issues/7).

## v0.1.1 (19-Feb-2016)
* **Fixes**
  * Removed the DEPRECATED ```gulp-symlink``` package and use ```vinyl-fs``` instead. Now you'll have less warnings in your ```npm install``` log.

## v0.1.0 (16-Feb-2016)
* **New**
  * Released the first working version of the pre-commit hook! Enjoy having you unstaged files ignored :-)
