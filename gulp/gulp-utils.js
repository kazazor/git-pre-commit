/**
 * @fileoverview Utils functions for all the gulp tasks.
 */

var gutil = require('gulp-util');
var execSync = require('child_process').execSync;

var gulpUtils = {};

/**
 * Prints to the console
 * @param {String} message - the message to print
 * @param {Object} options - Extra option for the printing (like color)
 */
gulpUtils.print = function print(message, options) {
  if (message) {
    message = JSON.stringify(message);
    var color = options && options.color || 'white';
    gutil.log(gutil.colors[color](message));
  } else {
    gutil.log(gutil.colors.red('Warning! Trying to print an undefined message'));
  }
};

/**
 * Matches 'git status --porcelain' with a given filters
 * @param {String} statusRow - the 'git status --porcelain' status row
 * @param {Object} options - Extra option for the filtering (like excludeStatuses, filter)
 *
 * @return {Boolean} if the file matched the filters
 */
gulpUtils.matchWorkspaceFiles = function matchWorkspaceFiles(statusRow, options) {
  var excludeStatuses = options.excludeStatuses;
  var filter = options.filter;
  var isMatched = true;

  if (statusRow && statusRow !== '') {
    var stagedStatus = statusRow[0].toUpperCase();
    var unStagedStatus = statusRow[1].toUpperCase();

    excludeStatuses.forEach(function(status) {
      status = status.toUpperCase();
      if (stagedStatus === status || unStagedStatus === status) {
        isMatched = false;
        return false;
      }
    });

    if (isMatched && filter) {
      var filterRegex = new RegExp(filter, 'gi');
      isMatched = filterRegex.test(statusRow);
    }
  } else {
    isMatched = false;
  }

  return isMatched;
};

module.exports = gulpUtils;
