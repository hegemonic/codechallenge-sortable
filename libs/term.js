'use strict';

/**
 * Class representation of a term
 */
module.exports = class Term {
  /**
   * Create a term
   * @param {String} name The name of the term, which is just the string text
   *                      of the term.
   */
  constructor (name) {
    this.name = name;
    this.lex = '';
  }
};
