'use strict';

const Path = require('path');

/**
 * @desc Returns a file path to the products data
 * @return {String} - String path to data
 */
exports.getFilePath = function getFilePath () {
  return Path.resolve(__dirname, '..', 'products.txt');
};
