/**
 * @fileoverview Initialization the tasks that are related to the js linting
 */

const eslint = require('gulp-eslint');
const gulpUtils = global.rootRequire('./pre-commit-utils/gulp-utils');
const gulpdebug = require('gulp-debug');
const gulpif = require('gulp-if');
const git = require('gulp-git');
const config = global.rootRequire('./gulp/config');
const Q = require('q');
const args = rootRequire('./gulp/args');

/**
 * Checks if the file has been modified by fix or not
 * @param {eslintFIle} file - the eslint file
 * @return {boolean|*} - if the file has been modified by fix or not
 */
const isFixed = (file) => {
  // Has ESLint fixed the file contents?
  return file.eslint !== null && file.eslint.fixed;
};

/* eslint-disable consistent-return */
/**
 * Runs eslint
 * @param {Object} gulp - the gulp instance
 * @param {Array} files - an array of file paths to lint
 * @param {Q.Defer} deferred - The deferred to finish the task. Used when --all is undefined
 *
 * @return {Stream} - returns the stream in case we need it for non deferred mode
 */
const runEslint = (gulp, files, deferred) => {
  let passedLinting = true;
  const stream = gulp.src(files, { base: './' })
    .pipe(gulpif(args.showProccesedFiles, gulpdebug()))
    .pipe(eslint(config.eslintOptions))
    // Prints to the console each row of an error
    .pipe(eslint.format('stylish'))
    .pipe(gulpif(isFixed, gulp.dest('./')))
    // Reports the task as failed if errors were found (so the git commit will fail)
    .pipe(eslint.failAfterError());

  stream.on('error', (error) => {
    passedLinting = false;

    if (deferred) {
      deferred.reject(error);
    }
  });

  stream.on('finish', () => {
    if (passedLinting && deferred) {
      deferred.resolve();
    }
  });

  if (!deferred) {
    return stream;
  }
};
/* eslint-enable consistent-return */

/**
 * Initialize the gulp tasks regarding the js linting
 * @param {Object} gulp - the gulp instance
 */
const registerTasks = (gulp) => {
  if (gulp) {
    // A task for running linting of the js files
    gulp.task('js:lint', () => {
      if (args.fix) {
        config.eslintOptions.fix = true;
      }

      // Checks if we want to lint all of the file and not just the changed rows according to git diff command
      if (args.entire || args.all) {
        config.eslintOptions.quiet = undefined;
      }

      if (args.all) {
        return runEslint(gulp, config.sources.allJsFilesExcludePackages);
      }

      const deferred = Q.defer();

      // Checks if we want to lint a specific path instead of all the changed files
      if (args.path) {
        runEslint(gulp, [args.path], deferred);
      } else {
        git.status({ args: '--porcelain', quiet: true }, (err, stdout) => {
          if (err) {
            throw err;
          } else {
            const gitChangedJsFiles = [];
            const rows = stdout.split('\n');
            const matchWorkspaceFilesOptions = {
              filter: '.+\.js$',
              excludeStatuses: ['d']
            };
            rows.forEach((row) => {
              if (gulpUtils.matchWorkspaceFiles(row, matchWorkspaceFilesOptions)) {
                const statusParts = row.split(' ');
                const filePath = statusParts[statusParts.length - 1];
                gitChangedJsFiles.push(filePath);
              }
            });

            runEslint(gulp, gitChangedJsFiles, deferred);
          }
        });
      }

      return deferred.promise;
    });
  }
};

module.exports = registerTasks;
