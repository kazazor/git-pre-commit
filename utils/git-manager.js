/**
 * @fileoverview Utils class for git operations
 */

var execSync = require('child_process').execSync;

function getGitRootDirectory() {
  try {
    return execSync('git rev-parse --show-toplevel').toString().trim();
  } catch(e) {
    return undefined;
  }
}

function GitManager() {
  this.gitRootDirectory = getGitRootDirectory();
}

GitManager.prototype.getGitRootDirectory = getGitRootDirectory;

module.exports = new GitManager();
