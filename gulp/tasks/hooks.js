/**
 * @fileoverview Initialization the tasks that are related to git hooks
 */

var path = require('path');
var del = require('del');
var config = rootRequire('./gulp/config');
var gulpUtils = rootRequire('./gulp/gulp-utils');
var chmod = require('gulp-chmod');
require('shelljs/global');

/**
 * Copies a file to a dest folder and creates the needed path if doesn't exists
 * @param  {String} sourceFile - The path to the source file to copy
 * @param  {String} distFolder - The path for the destination folder
 * @param {Function} callback - The callback to call when done
 */
function copyFile(sourceFile, distFolder, callback) {
  var pathExists = require('path-exists');
  pathExists(distFolder).then(function (exists) {
    if (!exists) {
      mkdir('-p', distFolder); // eslint-disable-line no-undef
    }

    cp('-f', sourceFile, distFolder); // eslint-disable-line no-undef
    callback();
  });
}

/**
 * Initialize the gulp tasks regarding the git hooks
 * @param {Object} gulp - the gulp instance
 */
var registerTasks = function registerTasks(gulp) {
  if (gulp) {
    // Handeling the case when using a different gulp reference than the intended one of the package:
    // https://www.npmjs.com/package/run-sequence#using-within-gulp-submodules
    var runSequence = require('run-sequence').use(gulp);

    // A task to make the pre-commit executable
    gulp.task('hooks:pre-commit-permissions', function() {
      var sources = [config.paths.sourcePreCommitFilePath, config.paths.sourcePrecommitJsFilePath];
      return gulp.src(sources, {base: './'})
        .pipe(chmod(755))
        .pipe(gulp.dest('./'));
    });

    // A task to install a pre-commit hook
    gulp.task('hooks:pre-commit', function (done) {
      copyFile(config.paths.sourcePreCommitFilePath, config.paths.gitHooksFullPath, done);
    });

    // A task to install a pre-commit hook js file
    gulp.task('hooks:pre-commit-js', function (done) {
      copyFile(config.paths.sourcePrecommitJsFilePath, config.paths.gitHooksFullPath, done);
    });

    // A task to delete all the git hooks directory
    gulp.task('hooks:clean', function() {
      var preCommitHookPath = path.join(config.paths.gitHooksFullPath, config.paths.preCommitHookFileName);
      var preCommitJsPath = path.join(config.paths.destPrecommitJsFilePath);
      var deletions = [preCommitHookPath, preCommitJsPath];
      gulpUtils.print('Deleting files: ' + deletions);
      return del(deletions, {force: true});
    });

    // A task to install all the git hooks after a cleaning the existing git hooks
    gulp.task('hooks:install', ['hooks:clean'], function(callback){
      // We would like to run the installation of the pre-commit hook only after the clean task has finished
      runSequence(['hooks:pre-commit'], ['hooks:pre-commit-js'], ['hooks:pre-commit-permissions'], function() {
        callback();
      });
    });
  }
};

module.exports = registerTasks;
