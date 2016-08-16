'use strict';

const Async = require('async');
const Path = require('path');
const pos = require('pos');
const _ = require('lodash');

const ManufacturerGuess = require('../libs/manufacturerGuess');
const ProductGuess = require('../libs/productGuess');

/**
 * Returns a file path to the listings data
 * @return {string} String path to data
 */
exports.getFilePath = function getFilePath () {
  return Path.resolve(__dirname, '..', 'listings.txt');
};

exports.determineManufacturers = function determineManufacturers (listings) {
  let output = [];
  Async.each(listings, (listing, doneLinsting) => {
    let potentialNamesFromManu = listing.manufacturer.split(' ').map(i => i.toLowerCase());
    let potentialNamesFromTitle = listing.title.split(' ').map(i => i.toLowerCase());
    potentialNamesFromManu.forEach((name) => {
      // INFO: check if name is already in output
      Async.each(output, (manuItem, doneOutput) => {
        if (manuItem.name === name) {
          doneOutput(manuItem);
        } else {
          doneOutput(null);
        }
      }, (foundMatch) => {
        if (foundMatch) {
          // INFO: check if nameFromManu is in nameFromTitle
          if (_.includes(potentialNamesFromTitle, foundMatch.name)) {
            // INFO: nameFromManu is in nameFromTitle
            foundMatch.isTitle();
          }
          foundMatch.increment();
        } else {
          let tempManu = new ManufacturerGuess(name);
          // INFO: check if nameFromManu is in nameFromTitle
          if (_.includes(potentialNamesFromTitle, name)) {
            // INFO: nameFromManu is in nameFromTitle
            tempManu.isTitle();
          }
          output.push(tempManu);
        }
      });
    });
    doneLinsting(null);
  }, (err) => {
    if (err) console.log(err);
    output = _.chain(output)
      .sortBy(s => s.count)
      // .filter(l => l.name.length > 3)
      .filter(c => c.name.split(/[^a-zA-Z]/).length === 1)
      // .filter(f => !(f.count === 1 && !f.isTitle))
      .value();
    console.log('Done determining manufacturers from listings');
  });
  return output;
};

exports.gleenProductInfo = function gleenProductInfo (listings) {
  let output = [];
  let word = new pos.Lexer();
  let tagger = new pos.Tagger();
  Async.each(listings, (listing, doneListing) => {
    let potentialManufacturer = listing.manufacturer;
    let potentialProductTerms = listing.title.split(' ');
    // INFO: check to see if manufacturer exists in list
    Async.each(output, (item, doneOutput) => {
      if (item.name === potentialManufacturer) {
        doneOutput(item);
      } else {
        doneOutput(null);
      }
    }, (foundMatch) => {
      if (foundMatch) {
        // INFO: use foundMatch
        foundMatch.increment();
        checkTerms(foundMatch, potentialProductTerms);
      } else {
        let newGuess = new ProductGuess(potentialManufacturer);
        output.push(newGuess);
        checkTerms(newGuess, potentialProductTerms);
      }
    });
    doneListing(null);

    function checkTerms (productGuess, termList) {
      termList.forEach((potentialTerm, index, arr) => {
        let isSimple = potentialTerm.split(/[^a-zA-Z]/).length === 1;
        let lowerCaseTerm = isSimple ? potentialTerm.toLowerCase() : null;
        Async.each(productGuess.terms, (term, doneTerm) => {
          // INFO: rule complex data
          if (isSimple) {
            if (term.name === lowerCaseTerm) {
              doneTerm(term);
            } else {
              doneTerm(null);
            }
          } else {
            doneTerm(null);
          }
        }, (foundMatch) => {
          if (foundMatch) {
            foundMatch.increment();
          } else {
            if (isSimple) {
              let termTag = tagger.tag(word.lex(lowerCaseTerm))
                .filter(tag => tag[0] === lowerCaseTerm)
                .map(tag => tag[1])
                .join();
              if (
                lowerCaseTerm.length > 2 &&
                termTag !== 'CC' &&
                termTag !== 'DT' &&
                termTag !== 'IN' &&
                termTag !== 'MD' &&
                termTag !== 'RP' &&
                termTag !== 'WP' &&
                termTag !== 'WDT'
              ) {
                // TODO: calc weight of term
                productGuess.addTerm(lowerCaseTerm, termTag);
              }
            }
          }
        });
      });
      productGuess.sortTerms();
    }
  }, (err) => {
    if (err) console.log(err);
    output = _.chain(output)
      // .filter(l => l.name.length >= 3)
      // .filter(c => c.name.split(/[^a-zA-Z]/).length === 1)
      .value();
    console.log('Done determining potential product terms from listings');
  });
  return output;
};
