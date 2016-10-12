/**
 * @fileoverview Configuration for all the gulp tasks.
 */
const path = require('path');
const GitManager = rootRequire('./pre-commit-utils/git-manager');
const gitManager = new GitManager();
const config = {};

config.paths = {
  allAppJsFiles: './!(node_modules)/**/*.js',
  gitHooksDirName: '.git/hooks/',
  preCommitHookFileName: 'pre-commit',
  preCommitJsFileName: 'pre-commit.js',
  utilsFolderName: 'pre-commit-utils/',
  scriptsFolder: 'scripts/',
  tests: {
    folder: 'tests/',
    hooks: 'hooks.test.js',
    gitManager: 'git-manager.test.js'
  }
};

// Source paths
config.paths.sourcePreCommitFilePath = path.join(config.paths.scriptsFolder, config.paths.preCommitHookFileName);
config.paths.sourcePrecommitJsFilePath = path.join(config.paths.scriptsFolder, config.paths.preCommitJsFileName);
config.paths.sourceUtilsFolderPath = path.normalize(config.paths.utilsFolderName);

// Destination paths
config.paths.gitHooksFullPath = path.join(gitManager.gitRootDirectory, config.paths.gitHooksDirName);
config.paths.destPrecommitFilePath = path.join(config.paths.gitHooksFullPath, config.paths.preCommitHookFileName);
config.paths.destPrecommitJsFilePath = path.join(config.paths.gitHooksFullPath, config.paths.preCommitJsFileName);
config.paths.destUtilsFolderPath = path.join(config.paths.gitHooksFullPath, config.paths.utilsFolderName);

config.eslintOptions = {};

// Shows a warning when eslint ignores a file - which means we are loading a file that shouldn't
// have been loaded in the first place. Fixing it could result with better performance
config.eslintOptions.warnFileIgnored = true;
config.eslintOptions.fix = false;

config.sources = {
  allJsFilesExcludePackages: [config.paths.allAppJsFiles]
};

module.exports = config;
