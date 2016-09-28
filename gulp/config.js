/**
 * @fileoverview Configuration for all the gulp tasks.
 */
const path = require('path');
const GitManager = rootRequire('./utils/git-manager');
const gitManager = new GitManager();
const config = {};

config.paths = {
  allAppJsFiles: './!(node_modules)/**/*.js',
  gitHooksDirName: '.git/hooks/',
  preCommitHookFileName: 'pre-commit',
  preCommitJsFileName: 'pre-commit.js',
  destUtilsFolderName: 'pre-commit-utils',
  scriptsFolder: 'scripts/',
  gitManagerFileName: 'git-manager.js',
  gulpUtilsFileName: 'gulp-utils.js',
  tests: {
    folder: 'tests/',
    hooks: 'hooks.test.js',
    gitManager: 'git-manager.test.js'
  }
};

config.paths.sourcePreCommitFilePath = path.join(config.paths.scriptsFolder, config.paths.preCommitHookFileName);
config.paths.sourcePrecommitJsFilePath = path.join(config.paths.scriptsFolder, config.paths.preCommitJsFileName);
config.paths.gitHooksFullPath = path.join(gitManager.gitRootDirectory, config.paths.gitHooksDirName);
config.paths.destPrecommitFilePath = path.join(config.paths.gitHooksFullPath, config.paths.preCommitHookFileName);
config.paths.destPrecommitJsFilePath = path.join(config.paths.gitHooksFullPath, config.paths.preCommitJsFileName);
config.paths.destUtilsFolderPath = path.join(config.paths.gitHooksFullPath, config.paths.destUtilsFolderName);
config.paths.gulpUtilsFilePath = path.join("gulp", config.paths.gulpUtilsFileName);
config.paths.gitManagerFilePath = path.join("utils", config.paths.gitManagerFileName);

config.eslintOptions = {};

// Shows a warning when eslint ignores a file - which means we are loading a file that shouldn't
// have been loaded in the first place. Fixing it could result with better performance
config.eslintOptions.warnFileIgnored = true;
config.eslintOptions.fix = false;

config.sources = {
  allJsFilesExcludePackages: [config.paths.allAppJsFiles]
};

module.exports = config;
