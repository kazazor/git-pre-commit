/**
 * @fileoverview Path extra functions
 */

/**
 * Extra utils around the use of the path module
 * @class
 */
class PathUtils {

  /**
   * Checks if a given path exists or not
   * @param path
   * @returns {boolean}
   */
  static doesPathExists(path) {
    const fs = require('fs');
    try {
      // Query the entry
      fs.lstatSync(path);

      return true;
    }
    catch (e) {
      return false;
    }
  }
}

module.exports = PathUtils;
