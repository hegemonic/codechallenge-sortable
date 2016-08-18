'use strict';

/**
 * @desc Class representing a manufacturer
 */
class Manufacturer {
  /**
   * @desc Create a manufacturer
   * @param {String} name The name of the manufacturer
   */
  constructor (name) {
    this.name = name;
    this.multiWord = false;
    this.listings = [];
  }

  /**
   * @desc Setter function for if this manufacturer has more than one word
   *       in the name
   * @returns {undefined}
   */
  isMultiWord () {
    this.multiWord = true;
  }

  /**
   * @desc Getter function for the name of this manufacturer
   * @returns {String} - The lowercase name of this manufacturer
   */
  getName () {
    return this.name.toLowerCase();
  }
}

module.exports = Manufacturer;
