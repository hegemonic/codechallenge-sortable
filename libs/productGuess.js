'use strict';

const Guess = require('./guess');
const Async = require('async');
const Term = require('./term');
const _ = require('lodash');

module.exports = class ProductGuess extends Guess {
  constructor (name) {
    super(name);
    this.terms = [];
  }

  calcWeight (index, length) {
    // TODO: take into account more than one instance
    this.weight = 1 - (index / length);
  }

  addTerm (name, lex) {
    Async.each(this.terms, (term, done) => {
      if (term.name === name) {
        done(term);
      } else {
        done(null);
      }
    }, (foundMatch) => {
      if (!foundMatch) {
        this.terms.push(new Term(name, lex));
      }
    });
  }

  sortTerms () {
    this.terms = _.chain(this.terms)
      .orderBy(s => s.count, 'desc')
      .value();
  }
};
