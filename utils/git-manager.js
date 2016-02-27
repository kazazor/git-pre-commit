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

module.exports = new GitManager();
