# Change log
[![NPM](https://nodei.co/npm/git-pre-commit.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/git-pre-commit/)

## Future version
* **Development**
  * Added dev/dependencies monitoring using [https://david-dm.org](https://david-dm.org), to keep the project's dependencies up to date - [#15](https://github.com/kazazor/git-pre-commit/issues/15).
* **Tests**
  * Added [Travis-CI](https://travis-ci.org/kazazor/git-pre-commit) build to the repository in order to run the tests on every push / PR. [Node.js](https://nodejs.org/en/) version to run at build are: 0.12.x, 4.0.x, 4.1.x, 4.2.x, 4.3.x, 5.7.x & 5.x.x - [#11](https://github.com/kazazor/git-pre-commit/issues/11).
  * Added tests to the repository using [mocha](https://mochajs.org/) - [#12](https://github.com/kazazor/git-pre-commit/issues/12).

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
