/**
 * @fileoverview Initialization for all the general gulp tasks.
 */

const gulp = require('gulp');
const path = require('path');

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

  // Lint our code
  gulp.task('lint', gulp.series('js:lint'));

  // // Runs all the tests in the  system
  gulp.task('tests', gulp.series('hooks:tests', 'git-manager:tests'));

  // // Runs every time we'll git commit
  gulp.task('pre-commit', gulp.series('lint'));
}
