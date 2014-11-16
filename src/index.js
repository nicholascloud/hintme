#!/usr/bin/env node
'use strict';
require('colors');
var fs = require('fs');
var path = require('path');
var readline = require('readline');
var Q = require('q');

var help = require('./help');
var util = require('./util');
var loadWebOptions = require('./load-web-options');
var loadFSOptions = require('./load-fs-options');

var args = process.argv.slice(2);
if (args.length === 0) {
  console.log(help());
  process.exit(1);
}

var OUTPUT_FILE = path.resolve(path.normalize(args[0]));
console.log('writing to file:', OUTPUT_FILE);
var LIVE_OPTS = util.contains(args, '--live');

Q().then(function () {
  /**
   * Test output file write permissions first
   */
  var writeFile = Q.denodeify(fs.writeFile);
  return writeFile(OUTPUT_FILE, '');
}).then(function () {
  /**
   * Load the jshintrc options
   */

  if (LIVE_OPTS) {
    return loadWebOptions().catch(function () {
      return loadFSOptions();
    });
  }
  return loadFSOptions();
}).then(function (options) {
  /**
   * Prompt the user for each option setting
   */
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  var choices = {};
  var prompt = 'value (empty for default):';

  var p = Q();
  options.forEach(function (opt) {
    p = p.then(function () {
      console.log(/*newline*/);
      console.log([
        opt.name.yellow,
        '(' + opt.type.green + ')',
        opt.desc,
      ].join(' '));
      if (opt.defaultValue) {
        console.log("default:", opt.defaultValue.cyan);
      }
      var d = Q.defer();
      rl.question(prompt, function (value) {
        value = (value.trim() || opt.defaultValue || '');
        choices[opt.name] = util.coerce(value);
        d.resolve();
      });
      return d.promise;
    })
  });

  return p.then(function () {
    rl.close();
    return choices;
  });
}).then(function (choices) {
  /**
   * Write all choices to the output file
   */
  var writeFile = Q.denodeify(fs.writeFile);
  return writeFile(OUTPUT_FILE, JSON.stringify(choices, null, '  '));
}).done(function () {
  /**
   * All done.
   */
  console.log('Done.');
  process.exit(0);
}, function (err) {
  /**
   * Catch and display any errors
   */
  console.error(err);
  process.exit(1);
});
