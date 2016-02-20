/**
 * @fileoverview Initialization for all the general gulp tasks.
 */

var gulp = require('./node_modules/gulp');
var yargs = require('yargs');
var path = require('path');
var runSequence = require('run-sequence').use(gulp);

var args = {
  showProccesedFiles: yargs.argv.show || false,
  all: yargs.argv.all,
  path: yargs.argv.path,
  fix: yargs.argv.fix
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
