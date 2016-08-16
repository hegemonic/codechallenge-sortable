'use strict';

const nlp = require('nlp_compromise');

module.exports = class Listing {
  constructor (data) {
    this.title = data.title;
    this.manufacturer = data.manufacturer;
    this.currency = data.currency;
    this.price = data.price;
    this.terms = [];
  }

  getData () {
    let result = {
      title: this.title,
      manufacturer: this.manufacturer,
      currency: this.currency,
      price: this.price
    };
    return result;
  }

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

  defineTerms () {
    let regEx = /\W/g;
    let termList = null;
    termList = this.title.split(regEx);
    termList = termList
      .filter(term => term.trim().length)
      .map(term => term.toLowerCase());
    this.terms = termList;
  }
};
