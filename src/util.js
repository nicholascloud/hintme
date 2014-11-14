'use strict';
module.exports = {
  coerce: function (value) {
    var lower = value.toLowerCase();
    if (lower === 'true') {
      return true;
    }
    if (lower === 'false') {
      return false;
    }
    if (isNaN(value)) {
      return value;
    }
    return Number(value);
  },

  contains: function (array, value) {
    return array.indexOf(value) >= 0;
  }
};