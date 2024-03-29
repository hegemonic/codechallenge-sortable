'use strict';

const nlp = require('nlp_compromise');

/**
 * @desc Class representing a listing
 */
class Listing {
  /**
   * @desc Create a Listing
   * @param {Object} data The data used to create this instance
   */
  constructor (data) {
    this.title = data.title;
    this.manufacturer = data.manufacturer;
    this.currency = data.currency;
    this.price = data.price;
    this.terms = [];
  }

  /**
   * @desc Get a constructed object of the data used to create this instance
   * @returns {Object} - The data used to create this instance
   */
  getData () {
    let result = {
      title: this.title,
      manufacturer: this.manufacturer,
      currency: this.currency,
      price: this.price
    };
    return result;
  }

  /**
   * @desc Get simplified version of listed manufacturer name
   * @returns {String} - The simplified version of the manufacturer's names
   */
  simpleManufacturerName () {
    let name = null;
    try {
      name = nlp
        .text(this.manufacturer)
        .terms()
        .filter(term => term.constructor.name !== 'Place');

      // INFO: ambiguous cases
      if (name.length > 1) {
        return this.manufacturer;
      } else {
        if (name[0].text.split(' ').length > 1) {
          return name[0].text.split(' ')[0].toLowerCase();
        } else {
          return name[0].text.toLowerCase();
        }
      }
    } catch (e) {
      // INFO: if nlp.text() explodes, the manufacturer name wasn't letters
      return this.manufacturer.toLowerCase();
    }
  }

  /**
   * @desc Define terms from the title of the Listing
   * @returns {undefined}
   */
  defineTerms () {
    let regEx = /\W/g;
    let termList = null;
    termList = this.title.split(regEx);
    termList = termList
      .filter(term => term.trim().length)
      .map(term => term.toLowerCase());
    this.terms = termList;
  }
}

module.exports = Listing;
