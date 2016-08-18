'use strict';

const _ = require('lodash');

/**
 * @desc Returns an array of items
 * @param  {String} data String context of read file
 * @return {String[]} - Array of strings
 */
exports.getArray = function getArray (data) {
  return data.split('\n');
};

/**
 * @desc Returns a subset of the array data provided
 * @param {String[]} data Array of data to create a subset from
 * @param {Number} setSize Size of subset
 * @return {String[]} - Subset array
 */
exports.getSubset = function getSubset (data, setSize) {
  return _.slice(data, 0, setSize);
};

/**
 * @desc Returns javascript objects
 * @param  {String} data Array of JSON string objects
 * @return {Object} - Javascript object
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
