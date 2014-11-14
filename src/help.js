'use strict';
var EOL = require('os').EOL;

module.exports = function () {
  return [
    'Usage:',
    '  $ hintme /path/to/.jshintrc [options]',
    '',
    'Options:',
    '  --live  fetch live option data from jshint website'
  ].join(EOL)
};