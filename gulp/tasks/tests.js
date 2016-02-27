/**
 * @fileoverview Initialization the tasks that are related to the tests
 */

var mocha = require('gulp-mocha');
var path = require('path');
var config = rootRequire('./gulp/config');

/**
 * Initialize the gulp tasks regarding the tests
 * @param {Object} gulp - the gulp instance
 */
var registerTasks = function registerTasks(gulp) {
  if (gulp) {
    // A task to test all the cases regarding the git hooks
    gulp.task('hooks:tests', [], function() {
      var hooksTestsPath = path.join(config.paths.tests.folder, config.paths.tests.hooks);
      return gulp.src(hooksTestsPath, {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'nyan'}));
    });
  }
};

module.exports = registerTasks;
