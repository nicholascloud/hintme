'use strict';
require('colors');
var path = require('path');
var fs = require('fs');
var Q = require('q');
var loadWebOptions = require('./src/load-web-options');

var OPTIONS_FILE = path.join(__dirname, 'res', 'options.json');

loadWebOptions().then(function (options) {
  console.log('writing options file:', OPTIONS_FILE);
  var writeFile = Q.denodeify(fs.writeFile);
  return writeFile(OPTIONS_FILE, JSON.stringify(options, null, '  '));
}).done(function () {
  console.log('done.');
  process.exit(0);
}, function (err) {
  console.error(err.red);
  process.exit(1);
});