'use strict';

/**
 * @module product
 * @desc Class representation of a product
 */
module.exports = class Product {
  /**
   * @desc Create a product
   * @param {Object} data The data used to create this instance
   */
  constructor (data) {
    this.productName = data.product_name;
    this.manufacturer = data.manufacturer;
    this.model = data.model;
    this.family = data.family || null;
    this.announcedDate = new Date(data['announced-date']);
    this.listings = [];
    this.listingGuesses = [];
  }

  /**
   * @instance
   * @memberof product#
   * @desc Getter for the terms from the family property
   * @returns {String[]}  Array of terms generated from family property
   */
  parsedFamilyTerms () {
    return this.family ? parsedTerms(this.family) : [];
  }

  /**
   * @instance
   * @desc Getter for the terms from the model property
   * @returns {String[]}  Array of terms generated from model property
   */
  parsedModelTerms () {
    return parsedTerms(this.model);
  }

  /**
   * @instance
   * @desc Getter for the terms from the productName property
   * @returns {String[]} output Generated list of terms from productName property
   */
  parsedNameTerms () {
    let regex = /_/g;
    let terms = this.productName.toLowerCase().split(regex);
    let output = [];
    terms.forEach(term => {
      let split = term.split('-');
      if (split.length > 1) {
        split.forEach(x => output.push(x));
        output.push(split.join(''));
      } else {
        output.push(term);
      }
    });
    return output;
  }

  /**
   * @instance
   * @desc Getter for the manufacturer of this product instance
   * @return {String}  The lowercase name of the manufacturer for this product
   */
  getManufacturer () {
    return this.manufacturer.toLowerCase();
  }

  /**
   * @instance
   * @desc Getter for the name of this product instance
   * @returns {String}  The lowercase version of the productName property
   */
  getName () {
    return this.productName.toLowerCase();
  }
};

/**
 * @instance
 * @desc Function for parsing terms from the given input
 * @param  {String} input The string to parse
 * @return {String[]} output Array of parsed terms
 */
function parsedTerms (input) {
  let output = [];
  let terms = input.toLowerCase().split(' ');
  terms.forEach(term => {
    let split = term.split('-');
    if (split.length > 1) {
      split.forEach(x => output.push(x));
      output.push(split.join(''));
    } else {
      output.push(term);
    }
  });
  return output;
}
