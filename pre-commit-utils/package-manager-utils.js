/**
 *@fileOverview Any package manager decision to be made
 */

/**
 * A class to represent a unified package manager
 * @class
 */
class PackageManager {
  /**
   * @param options.executableCommand
   * @param options.runCommand
   * @constructor
   */
  constructor(options) {
    this.executableCommand = options.executableCommand;
    this.runCommand = options.runCommand;
  }
}

/**
 * Utils around package managers
 * @class
 */
class PackageManagerUtils {
  /**
   * Returns the selected package manager to use
   * @returns {PackageManager}
   */
  static getPackageManager() {
    const path = require('path');
    const PathUtils = require('./path-utils');
    const GitManager = require('./git-manager');
    const gitManager = new GitManager();

    const isYarnProject = PathUtils.doesPathExists(path.join(gitManager.gitRootDirectory, "yarn.lock"));

    if (isYarnProject) {
      return new PackageManager({
        executableCommand: "yarn",
        runCommand: "run"
      });
    } else {
      return new PackageManager({
        executableCommand: "npm",
        runCommand: "run"
      });
    }
  }
}

module.exports = PackageManagerUtils;
