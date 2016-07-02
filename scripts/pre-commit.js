#!/usr/bin/env node

var execSync = require('child_process').execSync;
var fs = require('fs');
var path = require('path');
require('shelljs/global');
var gitManager = require('../utils/git-manager');
var gulpUtils = require('../gulp/gulp-utils');

// Why do we use spawn and not a regular shelljs?
// We want to preserve the colors of the output, so until the feature will be implemented
// in shelljs, we;ll use the spawn way:
// https://github.com/shelljs/shelljs/issues/86
var spawn = require('cross-spawn');

var exitCode = 0;
var gitRoot = gitManager.gitRootDirectory;

function execCommand(command, root) {
  try {
    // Fixes the issue the causes SourceTree to not run the pre-commit hook with the error:
    // 'env: node: No such file or directory'
    var cwd = process.cwd() || process.env.PWD;
    execSync(command, { cwd: cwd });
  } catch(e) {
    if (e && e.stdout) {
      gulpUtils.print(e.stdout.toString(), {color: 'red'});
    }

    exit(1);
  }
}

function restoreTree() {
  /**
  Let's consider this case:
  You have a lint task that runs on pre-commit hook.
  You're modifying the file x.js and you git add it.
  Now you left to do something else and didn't commit yet.
  You then return to this file and perform more changes that should not be part of the commit on x.js.
  You're trying to commit the stagged changes you git add and your lint task fails the commit.
  If you haven't restored the tree what will happen is the stash pop command will try to auto merge x.js and then
  it will have the unstagged changes now be in the stagged changes - which is something you did not want.

  So running git reset --hard command is to take care of situations where you have the same files in the stagged and unstagged changes.
   */
  var command = "git reset --hard";
  execCommand(command, gitRoot);

  command = "git stash pop --quiet --index";
  execCommand(command, gitRoot);
}

function exit(exitCode, restore) {
  if (restore) {
    restoreTree();
  }

  process.exit(exitCode);
}

if (!gitRoot) {
  gulpUtils.print("Are you sure this is a git repository..? I'll stop for now..", {color: 'red'});
  exit(1);
} else {
  if (!gitManager.isInitialCommitExists()) {
    // 'git stash' command doesn't work when there is no HEAD created yet.
    // In that case we'll just tell the user that the pre-commit hook can't run and give him the command to run without
    // the hook verification
    // Fix: https://github.com/kazazor/git-pre-commit/issues/8
    gulpUtils.print("'git stash' command cannot run without existing HEAD. We're canceling the hook for now.\n" +
    "JUST FOR THIS FIRST COMMIT: please run the command: 'git commit -m \"your message\" --no-verify'");
    exit(1);
  } else {
    var command;
    var hasChanges = gitManager.hasChanges();

    // If we do not have any changes on local git we do not need to stash.
    // This could happen when the user runs 'git commit --amend' when there are no commits cause he just wanted
    // to change the message that he typed in the last commit
    if (hasChanges) {
      // Ensure that code that isn't part of the prospective commit isn't tested within your pre-commit script
      command = "git stash --quiet --keep-index --include-untracked";
      execCommand(command, gitRoot);
    }

    var packageJson = JSON.parse(fs.readFileSync(path.join(gitRoot, 'package.json')));

    // Checks if the command to run exists in the package.json file
    if (!packageJson.precommit) {
      gulpUtils.print("You did not supply any code to run in the 'precommit' field in the package.json file", {color: 'red'});
      exit(1, hasChanges);
    } else {
      var commandParts = packageJson.precommit.split(" ");

      // Gets the executable to run
      var exec = commandParts[0];

      // Leaves only the params in the array
      commandParts.splice(0, 1);

      var cmd = spawn(exec, commandParts, {stdio: "inherit", cwd: gitRoot });

      cmd.on('exit', function(code) {
        if (code !== undefined && code !== null && code !== 0) {
          exitCode = 1;
        }

        exit(exitCode, hasChanges);
      });
    }
  }
}
