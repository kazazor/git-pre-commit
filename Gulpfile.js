/**
 * @fileoverview Initialization for all the general gulp tasks.
 */

var gulp = require('gulp');
var yargs = require('yargs');
var path = require('path');
var runSequence = require('run-sequence').use(gulp);

var args = {
  showProccesedFiles: yargs.argv.show || false,
  all: yargs.argv.all,
  path: yargs.argv.path,
  fix: yargs.argv.fix,
  env: yargs.argv.env ? yargs.argv.env : (process.env.NODE_ENV ? process.env.NODE_ENV : 'production')
};

global.args = args;

global.rootRequire = function(name) {
  return require(path.join(__dirname, name));
};

// Register other tasks from separate files
var gulpLintJsTasksRegister = rootRequire('./gulp/tasks/lint-js');
gulpLintJsTasksRegister(gulp);
var gulpHooksTasksRegister = rootRequire('./gulp/tasks/hooks');
gulpHooksTasksRegister(gulp);

// Only add these tasks if we're in development mode
if (args.env === "development") {
  var gulpTestsTasksRegister = rootRequire('./gulp/tasks/tests');
  gulpTestsTasksRegister(gulp);
}

// Lint our code
gulp.task('lint', function(callback) {
  // We run the lints using the run-sequence so we won't get all the errors all mixed up with
  // each other when we'll have more than 1 lint task
  runSequence(['js:lint'], function() {
    callback();
  });
});

// Runs every time we'll git commit
gulp.task('pre-commit', ['lint']);

// Runs all the tests in the  system
gulp.task('tests', ['hooks:tests']);
