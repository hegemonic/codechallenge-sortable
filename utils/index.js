'use strict';

const _ = require('lodash');

/**
 * Returns an array of items
 * @param  {string} data    String context of read file
 * @return {string[]}       Array of strings
 */
exports.getArray = function getArray (data) {
  return data.split('\n');
};

/**
 * Returns a subset of the array data provided
 * @param {string[]} data [description]
 * @param {number} setSize  Size of subset
 * @return {string[]}   Subset array
 */
exports.getSubset = function getSubset (data, setSize) {
  return _.slice(data, 0, setSize);
};

/**
 * Returns javascript objects
 * @param  {string} data Array of JSON string objects
 * @return {Object}      Javascript object
 */
exports.convertToObj = function convertToObj (data) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return { error: 'error parsing' };
  }
};

exports.products = require('./products');
exports.listings = require('./listings');
