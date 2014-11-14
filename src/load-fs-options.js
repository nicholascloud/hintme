'use strict';
var path = require('path');
var fs = require('fs');
var Q = require('q');

var OPTIONS_FILE = path.join(__dirname, '..', 'res', 'options.json');

module.exports = function () {
  return Q().then(function () {
    /**
     * Load the jshintrc options
     */
    var readFile = Q.denodeify(fs.readFile);
    return readFile(OPTIONS_FILE, 'utf-8').then(function (content) {
      return JSON.parse(content);
    });
  });
};