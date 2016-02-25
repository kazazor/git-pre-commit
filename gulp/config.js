/**
 * @fileoverview Configuration for all the gulp tasks.
 */
var path = require('path');
var gulpUtils = rootRequire('./gulp/gulp-utils');
var config = {};

config.paths = {
  allAppJsFiles: './!(node_modules)/**/*.js',
  gitHooksDirName: '.git/hooks/',
  preCommitHookFileName: 'pre-commit',
  preCommitJsFileName: 'pre-commit.js',
  scriptsFolder: 'scripts/'
};

config.paths.sourcePreCommitFilePath = path.join(config.paths.scriptsFolder, config.paths.preCommitHookFileName);
config.paths.sourcePrecommitJsFilePath = path.join(config.paths.scriptsFolder, config.paths.preCommitJsFileName);
config.paths.gitHooksFullPath = path.join(gulpUtils.getGitRootDirectory(), config.paths.gitHooksDirName);
config.paths.destPrecommitJsFilePath = path.join(config.paths.gitHooksFullPath, config.paths.preCommitJsFileName);

config.eslintOptions = {};

// Shows a warning when eslint ignores a file - which means we are loading a file that shouldn't
// have been loaded in the first place. Fixing it could result with better performance
config.eslintOptions.warnFileIgnored = true;
config.eslintOptions.fix = false;

config.sources = {
  allJsFilesExcludePackages: [config.paths.allAppJsFiles]
};

module.exports = config;
