'use strict';

module.exports = class Product {
  constructor (data) {
    this.productName = data.product_name;
    this.manufacturer = data.manufacturer;
    this.model = data.model;
    this.family = data.family || null;
    this.announcedDate = new Date(data['announced-date']);
    this.listings = [];
    this.listingGuesses = [];
  }

  parsedFamilyTerms () {
    return this.family ? parsedTerms(this.family) : [];
  }

  parsedModelTerms () {
    return parsedTerms(this.model);
  }

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

  getManufacturer () {
    return this.manufacturer.toLowerCase();
  }

  getName () {
    return this.productName.toLowerCase();
  }
};

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
