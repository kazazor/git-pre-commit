const yargs = require('yargs');

module.exports = {
  showProccesedFiles: yargs.argv.show || false,
  all: yargs.argv.all,
  path: yargs.argv.path,
  fix: yargs.argv.fix,
  env: yargs.argv.env ? yargs.argv.env : (process.env.NODE_ENV ? process.env.NODE_ENV : 'production')
};
