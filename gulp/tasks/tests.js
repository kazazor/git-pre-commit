/**
 * @fileoverview Initialization the tasks that are related to the tests
 */

const mocha = require('gulp-mocha');
const path = require('path');
const config = rootRequire('./gulp/config');

/**
 * Runs mocha on the given paths
 * @param {Gulp} gulp - the gulp instance
 * @param  {Array|string} paths the path to execute mocha on
 * @return {Stream} the gulp stream
 */
const runMocha = (gulp, paths) => {
  return gulp.src(paths, { read: false })
    // gulp-mocha needs filepaths so you can't have any plugins before it
    .pipe(mocha({ reporter: 'nyan' }));
};

/**
 * Initialize the gulp tasks regarding the tests
 * @param {Object} gulp - the gulp instance
 */
const registerTasks = (gulp) => {
  if (!gulp) { return; }

  // A task to test all the cases regarding the git hooks
  gulp.task('hooks:tests', () => {
    const hooksTestsPath = path.join(config.paths.tests.folder, config.paths.tests.hooks);
    return runMocha(gulp, hooksTestsPath);
  });

  // A task to test all the cases regarding the git manager class
  gulp.task('git-manager:tests', () => {
    const gitManagerTestsPath = path.join(config.paths.tests.folder, config.paths.tests.gitManager);
    return runMocha(gulp, gitManagerTestsPath);
  });
};

module.exports = registerTasks;
