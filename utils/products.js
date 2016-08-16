'use strict';

const Async = require('async');
const Path = require('path');
const _ = require('lodash');

const Manufacturer = require('../libs/manufacturer');

/**
 * Returns a file path to the products data
 * @return {string} String path to data
 */
exports.getFilePath = function getFilePath () {
  return Path.resolve(__dirname, '..', 'products.txt');
};

exports.determineManufacturers = function determineManufacturers (products) {
  let output = [];
  Async.each(products, (product, doneProduct) => {
    let productName = product.manufacturer.toLowerCase();
    Async.each(output, (item, doneOutput) => {
      if (item.name === productName) {
        doneOutput(item);
      } else {
        doneOutput(null);
      }
    }, (foundMatch) => {
      if (foundMatch) {
        foundMatch.increment();
      } else {
        let tempManu = new Manufacturer(productName);
        if (productName.split(' ').length > 1) {
          tempManu.isMultiWord();
        }
        output.push(tempManu);
      }
    });
    doneProduct(null);
  }, (err) => {
    if (err) console.log(err);
    output = _.chain(output)
      .orderBy(s => s.count, 'desc')
      .value();
  });
  return output;
};
