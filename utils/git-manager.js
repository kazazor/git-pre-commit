/**
 * @fileoverview Utils class for git operations
 */

const execSync = require('child_process').execSync;

/**
 * A class to hold git operations
 * @class
 */
class GitManager {
  /**
   * The constructor for the GitManager class.
   * By default sets the gitRootDirectory field.
   * @constructor
   */
  constructor() {
    /**
     * The git root directory path
     * @type {string}
     */
    this.gitRootDirectory = GitManager.getGitRootDirectory();
  }

  /**
   * Checks if we have uncommited changes or not
   * @return {Boolean} if the local git has uncommited changes
   */
  static hasChanges() {
    try {
      const diff = execSync('git diff -U0').toString();
      return !!diff;
    } catch (e) {
      return false;
    }
  }

  /**
   * Gets the first commit hash on the current branch
   * @return {string|undefined} The has of the first commit (of one exists)
   */
  static getInitialCommitHash() {
    // TODO - check what happens when there is no commit yet
    // TODO - check what happens when there is commit on master but now we're on a different branch
    try {
      return execSync('git rev-list --quiet --max-parents=0 HEAD').toString().trim();
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Checks if an initial commit exists in the current branch
   * @return {Boolean} True if exists. False - no commits were made on thie branch.
   */
  static isInitialCommitExists() {
    try {
      const initialCommitHash = this.getInitialCommitHash();
      return initialCommitHash !== undefined;
    } catch (e) {
      return false;
    }
  }

  /**
   * Gets the project's git root directory
   * @function
   * @return {string} the git root directory
   */
  static getGitRootDirectory() {
    try {
      return execSync('git rev-parse --show-toplevel').toString().trim();
    } catch (e) {
      return '';
    }
  }
}

module.exports = GitManager;
