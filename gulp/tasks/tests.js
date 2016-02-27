/**
 * @fileoverview Initialization the tasks that are related to the tests
 */

var mocha = require('gulp-mocha');
var path = require('path');
var config = rootRequire('./gulp/config');

/**
 * Runs mocha on the given paths
 * @param {Gulp} gulp - the gulp instance
 * @param  {Array|string} paths the path to execute mocha on
 * @return {Stream} the gulp stream
 */
function runMocha(gulp, paths) {
  return gulp.src(paths, {read: false})
    // gulp-mocha needs filepaths so you can't have any plugins before it
    .pipe(mocha({reporter: 'nyan'}));
}

/**
 * Initialize the gulp tasks regarding the tests
 * @param {Object} gulp - the gulp instance
 */
var registerTasks = function registerTasks(gulp) {
  if (gulp) {
    // A task to test all the cases regarding the git hooks
    gulp.task('hooks:tests', [], function() {
      var hooksTestsPath = path.join(config.paths.tests.folder, config.paths.tests.hooks);
      runMocha(gulp, hooksTestsPath);
    });

    // A task to test all the cases regarding the git manager class
    gulp.task('git-manager:tests', [], function() {
      var gitManagerTestsPath = path.join(config.paths.tests.folder, config.paths.tests.gitManager);
      runMocha(gulp, gitManagerTestsPath);
    });
  }
};

module.exports = registerTasks;
