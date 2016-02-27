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

    process.exit(1);
  }
}

if (!gitRoot) {
  gulpUtils.print("Are you sure this is a git repository..? I'll stop for now..", {color: 'red'});
  process.exit(1);
} else {
  var packageJson = JSON.parse(fs.readFileSync(path.join(gitRoot, 'package.json')));

  // Checks if the command to run exists in the package.json file
  if (!packageJson.precommit) {
    gulpUtils.print("You did not supply any code to run in the 'precommit' field in the package.json file", {color: 'red'});
  } else {
    var command;

    // Ensure that code that isn't part of the prospective commit isn't tested within your pre-commit script
    command = "git stash --quiet --keep-index --include-untracked";
    execCommand(command, gitRoot);

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

      // Only perform the git reset hard if we have an initial commit on this branch.
      // Fix: https://github.com/kazazor/git-pre-commit/issues/8
      if (gitManager.isInitialCommitExists()) {
        command = "git reset --hard";
        execCommand(command, gitRoot);
      }

      command = "git stash pop --quiet --index";
      execCommand(command, gitRoot);

      process.exit(exitCode);
    });
  }
}
