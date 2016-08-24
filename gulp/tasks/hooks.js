/**
 * @fileoverview Initialization the tasks that are related to git hooks
 */

var path = require('path');
var del = require('del');
var config = rootRequire('./gulp/config');
var gulpUtils = rootRequire('./gulp/gulp-utils');
var chmod = require('gulp-chmod');
var vfs = require('vinyl-fs');
var gitManager = rootRequire('./utils/git-manager');

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
    gulp.task('hooks:pre-commit', function () {
      return vfs.src(config.paths.sourcePreCommitFilePath, {followSymlinks: false})
        .pipe(vfs.symlink(config.paths.gitHooksFullPath));
    });

    // A task to install a pre-commit hook js file
    gulp.task('hooks:pre-commit-js', function () {
      return vfs.src(config.paths.sourcePrecommitJsFilePath, {followSymlinks: false})
        .pipe(vfs.symlink(config.paths.gitHooksFullPath));
    });

    // A task to delete all the git hooks directory
    gulp.task('hooks:clean', function() {
      var preCommitHookPath = path.join(config.paths.gitHooksFullPath, config.paths.preCommitHookFileName);
      var preCommitJsPath = path.join(config.paths.destPrecommitJsFilePath);
      var deletions = [preCommitHookPath, preCommitJsPath];
      gulpUtils.print('Deleting file: ' + deletions);
      return del(deletions, {force: true});
    });

    // A task to install all the git hooks after a cleaning the existing git hooks
    gulp.task('hooks:install', function(callback){
      if (!gitManager.gitRootDirectory) {
        gulpUtils.print("It seems this is not a git repository.. So we're sorry but we won't install your hooks");
        callback();
      } else {
        // We would like to run the installation of the pre-commit hook only after the clean task has finished
        runSequence(['hooks:clean'], ['hooks:pre-commit', 'hooks:pre-commit-js'], ['hooks:pre-commit-permissions'], function() {
          callback();
        });
      }
    });
  }
};

module.exports = registerTasks;
