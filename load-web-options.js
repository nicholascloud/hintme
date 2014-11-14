'use strict';
var request = require('request');
var jsdom = require('jsdom');
var Q = require('q');

var OPTIONS_PAGE = 'http://www.jshint.com/docs/options/';

module.exports = function () {
  return Q().then(function () {
    console.info('fetching jshint options...');
    var d = Q.defer();
    request(OPTIONS_PAGE, function (err, response, body) {
      if (err) {
        return d.reject(err);
      }
      d.resolve(body.toString());
    });
    return d.promise;
  }).then(function (body) {
    console.info('parsing jshint options...');
    var d = Q.defer();
    jsdom.env(
      body,
      ["http://code.jquery.com/jquery.js"],
      function (errors, window) {
        var $ = window.$;

        var options = [];
        var type = '';
        var defaultValue = 'false';

        $('h3').each(function (i, h3) {
          var $h3 = $(h3);
          type = $h3.text().split(' ')[0].toLowerCase();
          if (type === 'enforcing') {
            defaultValue = 'true';
          } else {
            defaultValue = 'false';
          }
          var $tds = $h3.find('~ table.options:first td.name');
          $tds.each(function (i, e) {
            var $td = $(e);
            var name = $td.text().trim();
            var desc = $td.next().text().trim();
            options.push({
              name: name,
              desc: desc,
              restrict: [],
              type: type,
              defaultValue: defaultValue
            });
          });
        });

        d.resolve(options);
      }
    );
    return d.promise;
  });
};