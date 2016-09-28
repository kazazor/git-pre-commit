/**
 * @fileoverview Initialization the tasks that are related to git hooks
 */

const path = require('path');
const del = require('del');
const config = rootRequire('./gulp/config');
const gulpUtils = rootRequire('./gulp/gulp-utils');
const chmod = require('gulp-chmod');
const GitManager = rootRequire('./utils/git-manager');
const gitManager = new GitManager();

/**
 * Initialize the gulp tasks regarding the git hooks
 * @param {Object} gulp - the gulp instance
 */
const registerTasks = (gulp) => {
  if (gulp) {
    // Handeling the case when using a different gulp reference than the intended one of the package:
    // https://www.npmjs.com/package/run-sequence#using-within-gulp-submodules
    const runSequence = require('run-sequence').use(gulp);

    const copySources = (sources, dest) => {
      return gulp.src(sources)
        .pipe(gulp.dest(dest));
    };

    // A task to make the pre-commit executable
    gulp.task('hooks:pre-commit-permissions', () => {
      const sources = [
        config.paths.destPrecommitFilePath,
        config.paths.destPrecommitJsFilePath,
        path.join(config.paths.destUtilsFolderPath, "*")
      ];

      return gulp.src(sources, { base: './' })
        .pipe(chmod(755))
        .pipe(gulp.dest('./'));
    });

    // A task to install a pre-commit hook
    gulp.task('hooks:pre-commit', () => {
      const sources = [
        config.paths.sourcePreCommitFilePath,
        config.paths.sourcePrecommitJsFilePath
      ];

      return copySources(sources, config.paths.gitHooksFullPath);
    });

    // A task to install a pre-commit hook
    gulp.task('hooks:pre-commit-utils', () => {
      const sources = [
        config.paths.gitManagerFilePath,
        config.paths.gulpUtilsFilePath
      ];

      return copySources(sources, config.paths.destUtilsFolderPath);
    });

    // A task to delete all the git hooks directory
    gulp.task('hooks:clean', () => {
      const deletions = [
        config.paths.destPrecommitFilePath,
        config.paths.destPrecommitJsFilePath,
        config.paths.destUtilsFolderPath
      ];

      gulpUtils.print('Deleting file: ' + deletions);
      return del(deletions, { force: true });
    });

    // A task to install all the git hooks after a cleaning the existing git hooks
    gulp.task('hooks:install', (callback) => {
      if (!gitManager.gitRootDirectory) {
        gulpUtils.print("It seems this is not a git repository.. So we're sorry but we won't install your hooks");
        callback();
      } else {
        // We would like to run the installation of the pre-commit hook only after the clean task has finished
        runSequence(['hooks:clean'], ['hooks:pre-commit', 'hooks:pre-commit-utils'], ['hooks:pre-commit-permissions'], () => {
          callback();
        });
      }
    });
  }
};

module.exports = registerTasks;
