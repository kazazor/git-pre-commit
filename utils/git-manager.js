/**
 * @fileoverview Utils class for git operations
 */

var execSync = require('child_process').execSync;

/**
 * Gets the project's git root directory
 * @function
 * @return {string} the git root directory
 */
function getGitRootDirectory() {
  try {
    return execSync('git rev-parse --show-toplevel').toString().trim();
  } catch(e) {
    return undefined;
  }
}

/**
 * The constructor for the GitManager class.
 * By default sets the gitRootDirectory field.
 * @constructor
 */
function GitManager() {
  this.gitRootDirectory = getGitRootDirectory();
}

/**
 * The git root directory path
 * @type {string}
 */
GitManager.prototype.gitRootDirectory = undefined;

/**
 * Gets the first commit hash on the current branch
 * @return {string|undefined} The has of the first commit (of one exists)
 */
GitManager.prototype.getInitialCommitHash = function getInitialCommitHash() {
  // TODO - check what happens when there is no commit yet
  // TODO - check what happens when there is commit on master but now we're on a different branch
  try {
    return execSync('git rev-list --quiet --max-parents=0 HEAD').toString().trim();
  } catch(e) {
    return undefined;
  }
};

/**
 * Checks if an initial commit exists in the current branch
 * @return {Boolean} True if exists. False - no commits were made on thie branch.
 */
GitManager.prototype.isInitialCommitExists = function isInitialCommitExists() {
  try {
    var initialCommitHash = this.getInitialCommitHash();
    return initialCommitHash !== undefined;
  } catch(e) {
    return false;
  }
};

module.exports = new GitManager();
