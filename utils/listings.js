'use strict';

const Path = require('path');

/**
 * @desc Returns a file path to the listings data
 * @return {String} - Working path to data
 */
exports.getFilePath = function getFilePath () {
  return Path.resolve(__dirname, '..', 'listings.txt');
};
