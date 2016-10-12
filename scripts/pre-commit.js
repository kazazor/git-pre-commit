#!/usr/bin/env node

const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');
require('shelljs/global');

const relativePrecommitUtilsFolder = "pre-commit-utils";
const GitManager = require(`.${path.sep}${relativePrecommitUtilsFolder}${path.sep}git-manager`);
const PackageManagerUtils = require(`.${path.sep}${relativePrecommitUtilsFolder}${path.sep}package-manager-utils`);
const gulpUtils = require(`.${path.sep}${relativePrecommitUtilsFolder}${path.sep}gulp-utils`);

// Why do we use spawn and not a regular shelljs?
// We want to preserve the colors of the output, so until the feature will be implemented
// in shelljs, we;ll use the spawn way:
// https://github.com/shelljs/shelljs/issues/86
const spawn = require('cross-spawn');

const gitManager = new GitManager();
const gitRoot = gitManager.gitRootDirectory;

/* eslint-disable no-use-before-define */
const restoreTree = () => {
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
  let command = "git reset --hard";
  execCommand(command, gitRoot);

  command = "git stash pop --quiet --index";
  execCommand(command, gitRoot);
};
/* eslint-enable no-use-before-define */

const exit = (exitCode, restore) => {
  if (restore) {
    restoreTree();
  }

  /* eslint-disable no-process-exit */
  process.exit(exitCode);
  /* eslint-enable no-process-exit */
};


const execCommand = (command, root) => {
  try {
    // Fixes the issue the causes SourceTree to not run the pre-commit hook with the error:
    // 'env: node: No such file or directory'
    const cwd = process.cwd() || process.env.PWD;
    execSync(command, { cwd });
  } catch (e) {
    if (e && e.stdout) {
      gulpUtils.print(e.stdout.toString(), { color: 'red' });
    }

    exit(1);
  }
};

if (!gitRoot) {
  gulpUtils.print("Are you sure this is a git repository..? I'll stop for now..", { color: 'red' });
  exit(0);
} else {
  if (!GitManager.isInitialCommitExists()) {
    // 'git stash' command doesn't work when there is no HEAD created yet.
    // In that case we'll just tell the user that the pre-commit hook can't run and give him the command to run without
    // the hook verification
    // Fix: https://github.com/kazazor/git-pre-commit/issues/8
    gulpUtils.print("'git stash' command cannot run without existing HEAD. We're canceling the hook for now.\n" +
    "JUST FOR THIS FIRST COMMIT: please run the command: 'git commit -m \"your message\" --no-verify'");
    exit(1);
  } else {
    let command;
    const hasChanges = GitManager.hasChanges();

    // If we do not have any changes on local git we do not need to stash.
    // This could happen when the user runs 'git commit --amend' when there are no commits cause he just wanted
    // to change the message that he typed in the last commit
    if (hasChanges) {
      // Ensure that code that isn't part of the prospective commit isn't tested within your pre-commit script
      command = "git stash --quiet --keep-index --include-untracked";
      execCommand(command, gitRoot);
    }

    const packageJson = JSON.parse(fs.readFileSync(path.join(gitRoot, 'package.json')));
    const PRE_COMMIT_SCRIPT_KEY = "precommit";

    // Checks if the command to run exists in the package.json file
    if (!(packageJson && packageJson.scripts && packageJson.scripts[PRE_COMMIT_SCRIPT_KEY])) {
      gulpUtils.print("You did not supply any code to run in the 'scripts.precommit' field in the package.json file", { color: 'red' });
      exit(1, hasChanges);
    } else {

      const packageManager = PackageManagerUtils.getPackageManager();

      const commandParts = [packageManager.runCommand, PRE_COMMIT_SCRIPT_KEY];

      // Execute the spawn command using the selected package manager run command
      const cmd = spawn(packageManager.executableCommand, commandParts, { stdio: "inherit", cwd: gitRoot });

      cmd.on('exit', (code) => {
        exit(code, hasChanges);
      });
    }
  }
}
