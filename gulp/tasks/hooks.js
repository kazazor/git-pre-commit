/**
 * @fileoverview Initialization the tasks that are related to git hooks
 */

const path = require('path');
const del = require('del');
const config = rootRequire('./gulp/config');
const gulpUtils = rootRequire('./pre-commit-utils/gulp-utils');
const chmod = require('gulp-chmod');
const GitManager = rootRequire('./pre-commit-utils/git-manager');
const gitManager = new GitManager();

/**
 * Initialize the gulp tasks regarding the git hooks
 * @param {Object} gulp - the gulp instance
 */
const registerTasks = (gulp) => {
  if (!gulp) { return; }

  const copySources = (sources, dest, base = "./") => {
    return gulp.src(sources, { base })
      .pipe(gulp.dest(dest));
  };

  /**
   * A task to make the pre-commit executable
   */
  function preCommitPermissions() {
    const sources = [
      config.paths.destPrecommitFilePath,
      config.paths.destPrecommitJsFilePath,
      path.join(config.paths.destUtilsFolderPath, "**/*")
    ];

    return gulp.src(sources, { base: './' })
      .pipe(chmod(755))
      .pipe(gulp.dest('./'));
  }

  /**
   * A task to install a pre-commit hook files
   */
  function installPreCommitFiles() {
    const sources = [
      config.paths.sourcePreCommitFilePath,
      config.paths.sourcePrecommitJsFilePath
    ];

    return copySources(sources, config.paths.gitHooksFullPath, "scripts");
  }

  /**
   * A task to install a pre-commit util files
   */
  function installUtilFiles() {
    const sources = [
      path.join(config.paths.sourceUtilsFolderPath, "**/*")
    ];

    return copySources(sources, config.paths.gitHooksFullPath);
  }

  /**
   * A task to delete all the git hooks directory
   */
  function clean() {
    const deletions = [
      config.paths.destPrecommitFilePath,
      config.paths.destPrecommitJsFilePath,
      config.paths.destUtilsFolderPath
    ];

    gulpUtils.print('Deleting file: ' + deletions);
    return del(deletions, { force: true });
  }

  /**
   * A task to check for git repository
   */
  function isGitRepo() {
    if (!gitManager.gitRootDirectory) {
      return Promise.reject("It seems this is not a git repository.. So we're sorry but we won't install your hooks");
    }

    return Promise.resolve();
  }

  gulp.task('hooks:clean', clean);
  gulp.task('hooks:pre-commit-permissions', preCommitPermissions);
  gulp.task('hooks:install-util-files', installUtilFiles);
  gulp.task('hooks:install-pre-commit-files', installPreCommitFiles);

  const install = gulp.series(isGitRepo, 'hooks:clean', 'hooks:install-pre-commit-files', 'hooks:install-util-files', 'hooks:pre-commit-permissions');

  gulp.task('hooks:install', install);
};

module.exports = registerTasks;
