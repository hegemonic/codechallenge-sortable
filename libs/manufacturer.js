'use strict';

/**
 * Class representing a manufacturer
 */
module.exports = class Manufacturer {
  /**
   * Create a manufacturer
   * @param {String} name The name of the manufacturer
   */
  constructor (name) {
    this.name = name;
    this.multiWord = false;
    this.listings = [];
  }
  /**
   * Setter function for if this manufacturer has more than one word in the name
   */
  isMultiWord () {
    this.multiWord = true;
  }
  /**
   * Getter function for the name of this manufacturer
   * @returns {String}  The lowercase name of this manufacturer
   */
  getName () {
    return this.name.toLowerCase();
  }
};
