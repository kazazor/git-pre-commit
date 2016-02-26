# Git pre-commit hook for pros!

[![Build Status](https://travis-ci.org/kazazor/git-pre-commit.svg?branch=master)](https://travis-ci.org/kazazor/git-pre-commit)

## TL;DR
You can run the pre-commit with any build tool (Gulp, Grunt etc..) and it will ignore all the **unstaged changes** that you did NOT ```git add```.

First install you package in your ```devDependencies```:
```shell
npm install git-pre-commit --save-dev
```

Now, add to your ```package.json``` the entry:
```javascript
"precommit": "<task to run>"
```

## What this package is actually solving?
Most of the git pre-commit hooks are WRONG!<br>
Why? Because most of the pre-commit hooks **also take into account the unstaged changes when performing the task**.

Lets take for example the most common pre-commit hook: lint. <br>
So what usually people do?<br>
You try to perform a commit and then your pre-commit hook runs and lints all of your files.

There are 2 issues with that common approach:

\#1 - When you have some unstaged changes and you would like to commit only the staged changes (the ones you performed ```git add``` on) your lint task checks the file itself and doesn't know if the code there will be part of the commit or not.<br>
This resolves into 2 possible situations:
  * **The code in the unstaged changes break the lint task** - why should I care?!? I'm not trying to commit this code!!
  * **The code in the unstaged changes is actualy fixing the lint task, but it is not part of the commit** - so for example you got an eslint error on your commit, you fixed it **but forgot to** ```git add``` **the changes**, now the lint task passes BUT you ended up with the fixing changes **outside of your commit**.
 
\#2 - It lints **all** the files and not just the changed files. This is not addressed in this package as it is not the point of it. (For example on how to lint **only the changed files** you can checkout [my eslint example](https://github.com/kazazor/gulp-eslint-precommit) that also uses the ```git-pre-commit``` package).

Like I said, this package fixes issue #1 by stashing you unstaged changes and returning the changes to the unstaged state once the pre-commit task has finished (with or without errors).

## Using the package
First install you package in your ```devDependencies```:
```shell
npm install git-pre-commit --save-dev
```

Now, add to your ```package.json``` the entry:
```javascript
"precommit": "<task to run>"
```

That is it! No more that you need to do (except for writing the pre-commit task :) )

So for example you can do something like that to run [Gulp](http://gulpjs.com/) task named ```pre-commit```:
```javascript
"precommit": "gulp pre-commit"
```

Or even use [Grunt](http://gruntjs.com/):
```javascript
"precommit": "grunt just-showing-that-the-task-name-doesnt-need-to-be-pre-commit"
```

Have fun!

### P.S
Even in this package repository I'm using the package pre-commit hook to lint all of the js files. <br>
For example on how to address the #2 issue:
> It lints **all** the files and not just the changed files

Take a look at [my eslint example](https://github.com/kazazor/gulp-eslint-precommit) that does just that. It will save you and your team A LOT of time!
