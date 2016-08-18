'use strict';

/**
 * @class
 * @module Term
 * @desc Class representation of a term
 */
module.exports = class Term {
  /**
   * @desc Create a term
   * @param {String} name The name of the term, which is just the string text
   *                      of the term.
   */
  constructor (name) {
    this.name = name;
    this.lex = '';
  }
};
