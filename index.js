'use strict';

const Matcher = require('./libs/matcher');
const Utils = require('./utils');
const Fs = require('fs');

// INFO: create the path to the data file
let productFilePath = Utils.products.getFilePath();
let listingFilePath = Utils.listings.getFilePath();

// INFO: get raw string data from products file
let rawProductData = Fs.readFileSync(productFilePath, { encoding: 'utf8' });
let rawListingData = Fs.readFileSync(listingFilePath, { encoding: 'utf8' });

// INFO: turn raw string data into array of strings
let products = Utils.getArray(rawProductData);
let listings = Utils.getArray(rawListingData);

// INFO: get subset of data for testing purposes
let workingProductData = Utils.getSubset(products, 743); // INFO: max = 743
let workingListingData = Utils.getSubset(listings, 20196); // INFO: max = 20196

// INFO: convert each string item into javascript object
workingProductData = workingProductData.map(Utils.convertToObj);
workingListingData = workingListingData.map(Utils.convertToObj);

// INFO: create matcher object
let matcher = new Matcher();

matcher.setProducts(workingProductData);
matcher.setListings(workingListingData);
matcher.createManufacturers();
matcher.firstPass(); // listings -> manufacturers
matcher.secondPass(); // unparied listings -> manufacturers
matcher.thirdPass(); // manufacturer.listings -> products.listingGuesses
matcher.forthPass(); // products.listingGuesses -> products.listings

matcher.resultFile(); // create result file
