/**
 * @fileoverview Initialization for all the general gulp tasks.
 */

const gulp = require('gulp');
const path = require('path');
const runSequence = require('run-sequence').use(gulp);

global.rootRequire = (name) => {
  return require(path.join(__dirname, name));
};

const args = rootRequire('./gulp/args');

// Register other tasks from separate files
const gulpHooksTasksRegister = rootRequire('./gulp/tasks/hooks');
gulpHooksTasksRegister(gulp);

// Only add these tasks if we're in development mode
if (args.env === "development") {
  const gulpTestsTasksRegister = rootRequire('./gulp/tasks/tests');
  gulpTestsTasksRegister(gulp);
  const gulpLintJsTasksRegister = rootRequire('./gulp/tasks/lint-js');
  gulpLintJsTasksRegister(gulp);
}

// Lint our code
gulp.task('lint', (callback) => {
  // We run the lints using the run-sequence so we won't get all the errors all mixed up with
  // each other when we'll have more than 1 lint task
  runSequence(['js:lint'], () => {
    callback();
  });
});

// Runs every time we'll git commit
gulp.task('pre-commit', ['lint']);

// Runs all the tests in the  system
gulp.task('tests', ['hooks:tests', 'git-manager:tests']);
