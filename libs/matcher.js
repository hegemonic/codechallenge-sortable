'use strict';

const Manufacturer = require('./manufacturer');
const Winston = require('winston');
const Product = require('./product');
const Listing = require('./listing');
const Async = require('async');
const Fs = require('fs');
const _ = require('lodash');

/**
 * @desc Class representation of a matcher tool
 */
class Matcher {
  /**
   * @desc Create a matcher
   */
  constructor () {
    this.manufacturers = [];
    this.products = [];
    this.listings = [];
    this.unpaired = [];
    this.logInfo = {
      levels: {
        setProducts: 0, setListings: 1,
        createManufacturers: 2, passStart: 3,
        passEnd: 4, write: 5, test: 6
      },
      colors: {
        setProducts: 'grey', setListings: 'blue',
        createManufacturers: 'cyan', passStart: 'green',
        passEnd: 'yellow', write: 'cyan', test: 'red'
      }
    };
    this.logger = new Winston.Logger({
      level: 'test',
      transports: [
        new Winston.transports.Console({
          colorize: true,
          prettyPrint: true,
          depth: 3
        })
      ],
      levels: this.logInfo.levels,
      colors: this.logInfo.colors
    });
  }

  /**
   * @desc Takes in an array of javascript objects of all the products
   *       to be used. Converts all the items into an instance of type
   *       Product.
   * @param {Object[]} data Array of objects
   * @returns {Product[]} - Array of Product objects
   */
  setProducts (data) {
    this.logger.setProducts('initiated');
    if (!data) { throw new Error('invalid function call'); }
    if (!Array.isArray(data)) { throw new Error('invalid function input'); }
    Async.each(data, (item, doneItem) => {
      let newProduct = new Product(item);
      this.products.push(newProduct);
      doneItem(null);
    }, (err) => {
      if (err) console.log(err);
    });
    this.logger.setProducts('completed');
    return this.products;
  }

  /**
   * @desc Takes in array of javascript objects of all the listings to
   *       be used. Converts all the items into an instances of type
   *       Listing.
   * @param {Object[]} data Array of objects
   * @returns {Listing[]} - Array of Listing objects
   */
  setListings (data) {
    this.logger.setListings('initiated');
    if (!data) { throw new Error('invalid function call'); }
    if (!Array.isArray(data)) { throw new Error('invalid function input'); }
    Async.each(data, (item, doneItem) => {
      let newListing = new Listing(item);
      this.listings.push(newListing);
      doneItem(null);
    }, (err) => {
      if (err) console.log(err);
    });
    this.logger.setListings('completed');
    return this.listings;
  }

  /**
   * @desc Create array of Manufacturer instances from list of products
   * @returns {undefined}
   */
  createManufacturers () {
    this.logger.createManufacturers('initiated');
    if (this.products.length === 0) {
      throw new Error('no prodcuts set');
    }
    if (this.manufacturers.length > 0) {
      throw new Error('already created manufacturers');
    }
    Async.each(this.products, (product, doneProduct) => {
      Async.each(this.manufacturers, (manufacturer, doneManufacturer) => {
        if (manufacturer.name === product.manufacturer) {
          doneManufacturer(manufacturer);
        } else {
          doneManufacturer(null);
        }
      }, (foundMatch) => {
        if (!foundMatch) {
          let newManufacturer = new Manufacturer(product.manufacturer);
          if (newManufacturer.name.split(' ').length > 1) {
            newManufacturer.isMultiWord();
          }
          this.manufacturers.push(newManufacturer);
        }
        doneProduct(null);
      });
    }, (err) => {
      if (err) console.log(err);
      this.logger.createManufacturers('completed');
    });
  }

  /**
   * @desc Initially matches each listings manufacturer value with the
   *       corresponding manufacturer instances created by
   *       `createManufacturers()`. Also creates a list of 'terms' on
   *       each listing. The title of the listing is `split()` on all
   *       non-word characters (regex: `/\W/g`) to create the list of
   *       'terms'.
   * @returns {undefined}
   */
  firstPass () {
    this.logger.passStart('first');
    Async.each(this.listings, (listing, doneListing) => {
      let simpleManufacturerName = listing.simpleManufacturerName();
      Async.each(this.manufacturers, (manufacturer, doneManufacturer) => {
        if (manufacturer.getName() === simpleManufacturerName) {
          doneManufacturer(manufacturer);
        } else {
          doneManufacturer(null);
        }
      }, (foundMatch) => {
        listing.defineTerms();
        if (foundMatch) {
          foundMatch.listings.push(listing);
        } else {
          this.unpaired.push(listing);
        }
        doneListing(null);
      });
    }, (err) => {
      if (err) console.log(err);
      this.logger.passEnd('first');
    });
  }

  /**
   * @desc Goes through the unpaired listings and compares the
   *       intersection of the list of terms with a list of manufacturers.
   *       If the intersection has one (1) match, that listing is added
   *       to the corresponding manufacturer instance. If the intersection
   *       has multi matches (> 1) than the array of matches is looped
   *       over and the listing is added to each of the corresponding
   *       manufacturer instances. If there are no matches (< 1) than
   *       the listing is left in the `unparied` array list.
   * @returns {undefined}
   */
  secondPass () {
    this.logger.passStart('second');
    let unpaired = [];
    let manufacturerList = this.manufacturers.map(x => x.name);
    Async.each(this.unpaired, (listing, doneListing) => {
      let intersection = _.intersection(manufacturerList, listing.terms);
      if (intersection.length === 0) {
        unpaired.push(listing);
      }
      if (intersection.length === 1) {
        this.getManufacturers(intersection).forEach((manufacturer) => {
          manufacturer.listings.push(listing);
        });
      }
      if (intersection.length > 1) {
        this.getManufacturers(intersection).forEach((manufacturer) => {
          manufacturer.listings.push(listing);
        });
      }
      doneListing(null);
    }, (done) => {
      this.unpaired = unpaired;
      this.logger.passEnd('second');
    });
  }
  /**
   * @desc Goes through all of the products and gets their respective
   *       manufacturer. For each listing associated with that manufacturer
   *       intersect the terms from each listing, with the terms from
   *       the product. The terms from the product are a combination of
   *       regex splits on `_` and `-`. When the intersection array
   *       has one match (== 1), the term is compared against the
   *       manufacturer name, and if it doesnt match (!==) then the
   *       listing is added to a list of guesses on the product object
   *       avoid irrelivant matches. If the intersection array has
   *       multiple matches (> 1), the listing is added to a list of
   *       guesses on the product.
   * @returns {undefined}
   */
  thirdPass () {
    this.logger.passStart('third');
    let noMatch = 0; // TESTING
    let oneMatch = 0; // TESTING
    let multiMatch = 0; // TESTING
    // let product = this.products[4];
    Async.each(this.products, (product, doneProduct) => {
      // this.logger.test('product name:', product.productName);
      // this.logger.test('search terms:', product.parsedNameTerms().join(', '));
      let manufacturer = this.getManufacturers(product.manufacturer.split())[0];
      // this.logger.test('associated listings:', manufacturer.listings.length);
      // if (product.productName === 'Fujifilm_FinePix_1500') {
      //   this.logger.test('FUCKING FOUND IT');
      // }
      Async.each(manufacturer.listings, (listing, doneListing) => {
        let intersection = _.intersection(product.parsedNameTerms(), listing.terms);
        if (intersection.length === 0) {
          noMatch++;
        }
        if (intersection.length === 1) {
          // if (product.productName === 'Fujifilm_FinePix_1500') {
          //   console.log(intersection, product.getManufacturer());
          // }
          if (intersection[0] !== product.getManufacturer()) {
            product.listingGuesses.push(listing);
          }
          oneMatch++;
        }
        if (intersection.length > 1) {
          product.listingGuesses.push(listing);
          multiMatch++;
        }
        doneListing(null);
      }, (err) => {
        if (err) console.log(err);
        // this.logger.test(`${product.productName} >> noMatch: ${noMatch}, oneMatch: ${oneMatch}, mutliMatch: ${multiMatch}`);
        // this.logger.test('--------------------------------------');
        noMatch = 0; // TESTING
        oneMatch = 0; // TESTING
        multiMatch = 0; // TESTING
        doneProduct(null);
        // console.log(product);
      });
    }, (err) => {
      if (err) console.log(err);
      this.logger.passEnd('third');
    });
  }

  // TODO: sort through listingGuesses
  // TODO: compare model/family against listing.defineTerms()
  /**
   * @desc info about 4th passStart
   * @returns {undefined}
   */
  forthPass () {
    this.logger.passStart('forth');
    // INFO: setup
    let intersection = {};
    // TESTING items
    // let counts = { noMatch: 0, oneMatch: 0, multiMatch: 0 };
    // let matches = {
    //   model: Object.create(counts),
    //   family: Object.create(counts),
    //   both: Object.create(counts)
    // };
    let likelyMatch = 0;
    Async.each(this.products, (product, doneProduct) => {
      // this.logger.test('product name:', product.getName());
      // this.logger.test('product model:', product.model);
      // this.logger.test('product model terms:', product.parsedModelTerms());
      // this.logger.test('product family:', product.family);
      // this.logger.test('product family terms:', product.parsedFamilyTerms());
      // this.logger.test('product listing guesses:', product.listingGuesses.length);
      Async.each(product.listingGuesses, (listingGuess, doneListingGuess) => {
        switch (product.parsedModelTerms().length) {
          case 1:
            // modelTermLength = 1
            intersection.model = _.intersection(product.parsedModelTerms(), listingGuess.terms);
            if (product.parsedFamilyTerms().length) {
              // familyTermLength = 1 || familyTermLength > 1
              intersection.family = _.intersection(product.parsedFamilyTerms(), listingGuess.terms);
              if (intersection.model.length === 1 && intersection.family.length >= 1) {
                likelyMatch++;
                product.listings.push(listingGuess);
              }
            } else {
              // familyTermLength = 0
              if (intersection.model.length === 1) {
                likelyMatch++;
                product.listings.push(listingGuess);
              }
            }
            break;
          default:
            // modelTermLength > 1
            intersection.model = _.intersection(product.parsedModelTerms(), listingGuess.terms);
            if (product.parsedFamilyTerms().length) {
              // familyTermLength = 1 || familyTermLength > 1
              intersection.family = _.intersection(product.parsedFamilyTerms(), listingGuess.terms);
              if (intersection.model.length > 1 && intersection.family.length >= 1) {
                likelyMatch++;
                product.listings.push(listingGuess);
              } else if (intersection.model.length > 1) {
                likelyMatch++;
                product.listings.push(listingGuess);
              }
            } else {
              // familyTermLength = 0
              if (intersection.model.length > 1) {
                likelyMatch++;
                product.listings.push(listingGuess);
              }
            }
            break;
        }
        // TESTING BELOW
        // intersection.model = _.intersection(product.parsedModelTerms(), listingGuess.terms);
        // intersection.family = _.intersection(product.parsedFamilyTerms(), listingGuess.terms);
        // if (intersection.model.length === 0) {
        //   matches.model.noMatch++;
        //   if (intersection.family.length === 0) {
        //     matches.both.noMatch++;
        //   }
        // }
        // if (intersection.model.length === 1) {
        //   matches.model.oneMatch++;
        //   // this.logger.test('listingGuess', listingGuess);
        //   if (intersection.family.length === 1) {
        //     matches.both.oneMatch++;
        //   }
        // }
        // if (intersection.model.length > 1) {
        //   matches.model.multiMatch++;
        //   if (intersection.family.length > 1) {
        //     matches.both.multiMatch++;
        //   }
        // }
        // if (intersection.family.length === 0) { matches.family.noMatch++; }
        // if (intersection.family.length === 1) { matches.family.oneMatch++; }
        // if (intersection.family.length > 1) { matches.family.multiMatch++; }
        doneListingGuess(null);
      }, (err) => {
        if (err) console.log(err);
        intersection = {};
        // TESTING BELOW
        // this.logger.test(`MODEL >> noMatch: ${matches.model.noMatch}, oneMatch: ${matches.model.oneMatch}, mutliMatch: ${matches.model.multiMatch}`);
        // this.logger.test(`FAMILY >> noMatch: ${matches.family.noMatch}, oneMatch: ${matches.family.oneMatch}, mutliMatch: ${matches.family.multiMatch}`);
        // this.logger.test(`BOTH >> noMatch: ${matches.both.noMatch}, oneMatch: ${matches.both.oneMatch}, mutliMatch: ${matches.both.multiMatch}`);
        // this.logger.test(`LIKELY MATCHES >> ${likelyMatch}`);
        // this.logger.test('--------------------------------------');
        // matches = { model: Object.create(counts), family: Object.create(counts), both: Object.create(counts) };
        likelyMatch = 0;
        doneProduct(null);
      });
    }, (err) => {
      if (err) console.log(err);
      this.logger.passEnd('forth');
    });
  }

  /**
   * @desc For each product, creates an item object which conform to the JSON
   *       object spec for the challenge. Creates a file `results.txt` and
   *       appends the `JSON.strinify` form of each of those item objects
   *       to the file.
   * @returns {undefined}
   */
  resultFile () {
    this.logger.write('initiated');
    Async.each(this.products, (product, doneProduct) => {
      let item = {
        'product_name': product.productName,
        'listings': []
      };
      product.listings.forEach(listing => {
        item['listings'].push(listing.getData());
      });
      // TODO: append created object to results.json file
      Fs.appendFile('results.txt',
        JSON.stringify(item) + '\n',
        { encoding: 'utf8' },
        doneProduct
      );
    }, (err) => {
      if (err) console.log(err);
      this.logger.write('completed');
    });
  }

  // INFO: Below are helper functions attached to this object.
  /**
   * @desc Returns a list of Manufacturer instances that have a name that matches
   *       the given list in `data`.
   * @param {String[]} data Array of manufacturer names
   * @returns {Manufacturer[]} - An array of Manufacturer instances
   */
  getManufacturers (data) {
    let output = [];
    data.forEach((name) => {
      this.manufacturers.forEach((manufacturer) => {
        if (manufacturer.getName() === name.toLowerCase()) {
          output.push(manufacturer);
        }
      });
    });
    return output;
  }
}

module.exports = Matcher;
