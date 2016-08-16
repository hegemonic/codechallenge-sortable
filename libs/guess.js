'use strict';

module.exports = class Guess {
  constructor (name) {
    this.name = name;
    this.count = 1;
    this.weight = null;
  }

  increment () {
    this.count++;
  }
};
