#!/user/bin/env node

var chalk = require('chalk');
var Zuul = require('zuul');
var config = require('../zuul.config');

var zuul = Zuul(Object.assign({
  concurrency: 1,
  files: [
    __dirname + '/../test/pastaSpec.js',
  ],
  phantom: true,
  tunnel: 'ngrok',
  prj_dir: __dirname + '/../src',
}, config));

zuul.on('browser', function(browser) {
  browser.on('done', function(results) {
    var log = [
      chalk.green(`passed: ${results.passed}`),
      chalk.red(`failed: ${results.failed}`),
    ].join('  ');
    console.log(`\n${log}`);
    process.exit();
  });
});

zuul.run(function() {});
