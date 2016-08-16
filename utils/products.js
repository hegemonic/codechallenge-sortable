'use strict';

const Path = require('path');

/**
 * Returns a file path to the products data
 * @return {string} String path to data
 */
exports.getFilePath = function getFilePath () {
  return Path.resolve(__dirname, '..', 'products.txt');
};
