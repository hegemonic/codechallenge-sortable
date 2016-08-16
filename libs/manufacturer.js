'use strict';

module.exports = class Manufacturer {
  constructor (name) {
    this.name = name;
    this.multiWord = false;
    this.listings = [];
  }

  isMultiWord () {
    this.multiWord = true;
  }

  getName () {
    return this.name.toLowerCase();
  }
};
