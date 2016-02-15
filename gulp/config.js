/**
 * @fileoverview Configuration for all the gulp tasks.
 */
var config = {};
config.paths = {
  allAppJsFiles: './**/*.js',
  gitHooksDir: '.git/hooks/',
  preCommitHookFile: 'pre-commit',
  nodeModules: './node_modules'
};

config.eslintOptions = {};

// Shows a warning when eslint ignores a file - which means we are loading a file that shouldn't
// have been loaded in the first place. Fixing it could result with better performance
config.eslintOptions.warnFileIgnored = true;
config.eslintOptions.fix = false;

config.sources = {
  allJsFilesExcludePackages: ['!' + config.paths.nodeModules, config.paths.allAppJsFiles]
};

module.exports = config;
