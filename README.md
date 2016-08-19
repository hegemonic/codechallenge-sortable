# codechallenge-sortable

This is my humble solution to the coding challenge presented by [Sortable](http://sortable.com/challenge/).

## About
The idea behind this challenge is to take a list of `listings` and sort
through them and match a relevant `listing` to a `product` from a given
list of `products`. The problem points become when you realise that the
list of `listings` is not standardized in that, each of the `values` of the
given `keys` on each `listing` object doesn't necessarily have the same
data format as any other `listing`. The job then becomes, how best can you
extract reliable data from the `listings` so that you can reliably match a
`listing` to a given `product` from the list of `products`.

## Solution
### Solution Criteria
- Each `listing` should be matched with only one `product`.
- Each `product` will have a property `product.listings` which will be an
array, empty or containing `listing` objects.
- A `product` should not have a `listing` object in the array which doesn't
not below to that `product`.

### Solution Description
> I decided to create a `Matcher` class object which would contain all the
relevant information and functions in order to process all the information.
As idea like this could be generalized and extended to be a `Matcher` class
object for each API source for data. If the output produced by the
`Matcher` class objects were to be standardized then, you'd have a way to
collect massive amounts of data together into a singular format to be
processed any way need be. Tests against the API for each `Matcher` could
even be written so that if the API data changed format, some event would be
triggered, so that the way the `Matcher` class object functioned could be
updated.

#### Step One
The solution starts by importing all the data from the supplied files of
product and listing data. From that data, specifically the products
supplied, a list of manufacturers is generated with the
`matcher.createManufacturers` function. I did this because the
`manufacturer` property is the only common property between the `listings`
and the `products`. This serves and simple starting point for the matching
process.

#### Step Two
I broke the matching process down into passes over the data to keep the
code as discrete as possible. The first pass being `matcher.firstPass`,
which is used to match each `listing` to their corresponding
`manufacturer`, and generate a list of `terms` for each `listing` to be
used later in the processing. The `title` property of each `listing` is
`split()` on all non-word characters to create this list of `terms`.

#### Step Three
The second pass over the data goes through the unpaired data; the
`listings` from the first pass that didn't match over their `manufacturer`
property. This pass compares the `terms` from each unpaired `listing`
against a list of `manufacturer` names which are generated from the list of
`Manufacturer` class objects held inside the `Matcher` instance. The second
pass uses a [`lodash`](https://lodash.com/) method called
[`_.intersection`](https://lodash.com/docs#intersection), which returns all
matching elements of an array. If the `listing.terms` array property of a
`listing` contains a `term` which matches any `term` (name) in the list of
`manufacturer` names, then the `length` of the `intersection` array will be
`truthy`.
> This is a fault in the procedure of matching. If the `title` of a
`listing` has more than one (> 1) `term` which matches with the generated
list of manufacturer names, then this `listing` will match on all
`manufacturers`.
```javascript
Example:
{
  "title": "Canon lens made-by Saitek",
  "terms": [ "canon", "lens", "made", "by", "saitek" ]
}               |-----------------------------|
                  Both are manufacturer names
```
This will lead to extrainious processes of data and also potentially false
positives.

#### Step Four
The third pass over the data goes through each of the `products` and gets
the corresponding `manufacturer` instance. For each `listing` on that
`manufacturer` instance the `_.interesection` is done on the list of
`terms` generated from the `product` name and the list of `terms` from the
`listing`. If the `intersection` array has a `length === 1` and the item in
the array isn't simply the manufacturer name (meaning we matched on
something useful) then the `listing` is pushed into a
`product.listingGuesses` array property. Alternately, if the
`intersection` array has a `length > 1` than the `listing` is pushed into
the same `product.listingGuesses` array property.

#### Step Five
The fourth pass over the data is the final pass of my analysis procedure.
For each `product` we look at each `listing` in the `listingGuesses`
array. An `intersection` on the generated `terms` from the `product.model`
property (using the `product.parsedModelTerms()` method) and the
`listing.terms` is done and utilized in a way to infer if the `listing`
belongs to the `product` or not. Yielding `intersection.model`.
- If the list of `terms` generated from the `product.model` property has
`length === 1` than we _can only_ match on one `term`, so we utilize the
`product.family` property, if the `product` has one, to assist in the
matching.
  - If the **is no** `product.family` property to utilize than the
  `intersection.model` must also have `length === 1`, meaning that the
  model of the `product` matched on a `term` from the `listing.title`
  property of the `listing`.
  - If there **is a** `product.family` property to utilize than the
  `intersection` of the `terms` from that property and the `listing.terms`
  array is computed. Yielding `intersection.family`.
    - If `intersection.family.length >= 1`, meaning we matched on `terms`
    from the `product.family` property, we likely have a match.
- If the list of `terms` generated from the `product.model` property has
`length > 1` than we check to see if the `product.family` property exists
for a more conclusive match.
  - If there **is no** `product.family` property to utilize than the
  `intersection.model` must have a `length > 1`, meaning that it's more
  likely this is a relevant `listing`.
  - If there **is a** `product.family` property to utilize than
  `intersection` of the `terms` form that property and the `listing.terms`
  array is computed. Yielding `intersection.family`.
    - If `intersection.family` has `length >= 1`, meaning something in the
    `term` list matched, **and** `intersection.model` has `length > 1`
    than it's likely we have a match.
    - If `intersection.family` has `length === 0`, meaning no `terms`
    matched the `listing.terms` **but** `intersection.model` has a `length
    > 1`, meaning multi `terms` from the `product.model` matched on
    `terms` from `listing.terms`, it's still likely we have a match.

#### Step Six
The last step in the processing of the data is to create the `results.txt`
file. For each of the `products` that were processed, an `item` is created
with the required properties of each result object for the challenge. The
`product_name` is populated and so is a `listings` property, which is an
array of `listing` objects. Each of the `items` is then appended to the
`results.txt` file.

## Usage
1. `$ mkdir my-solution`
2. `$ cd my-solution`
3. `$ git clone https://github.com/mikemimik/codechallenge-sortable.git ./`
4. `$ npm install` **OR** `$ npm install --only=prod` *(faster)*
5. `$ npm start`

## Docs
> (assuming all **Usage** steps have been done)

1. `$ npm run generate-docs`
