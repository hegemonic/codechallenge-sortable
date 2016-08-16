'use strict';

const Guess = require('./guess');

module.exports = class ManufacturerGuess extends Guess {
  constructor (name) {
    super(name);
    this.titleMatch = false;
  }

  isTitle () {
    this.titleMatch = true;
  }
};
