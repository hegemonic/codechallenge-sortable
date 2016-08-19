# codechallenge-sortable

This is my humble solution to the coding challenge presented by [Sortable](http://sortable.com/challenge/).

### About
The idea behind this challenge is to take a list of `listings` and sort
through them and match a relevant `listing` to a `product` from a given
list of `products`. The problem points become when you realise that the
list of `listings` is not standardized in that, each of the `values` of the
given `keys` on each `listing` object doesn't necessarily have the same
data format as any other `listing`. The job then becomes, how best can you
extract reliable data from the `listings` so that you can reliably match a
`listing` to a given `product` from the list of `products`.

### Solution
#### Solution Criteria
- Each `listing` should be matched with only one `product`.
- Each `product` will have a property `product.listings` which will be an
array, empty or containing `listing` objects.
- A `product` should not have a `listing` object in the array which doesn't
not below to that `product`.

#### Solution Description
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

The solution starts by importing all the data from the supplied files of
product and listing data. From that data, specifically the products
supplied, a list of manufacturers is generated with the
`matcher.createManufacturers` function. I did this because the
`manufacturer` property is the only common property between the `listings`
and the `products`. This serves and simple starting point for the matching
process.

I broke the matching process down into passes over the data to keep the
code as discrete as possible. The first pass being `matcher.firstPass`,
which is used to match each `listing` to their corresponding
`manufacturer`, and generate a list of `terms` for each `listing` to be
used later in the processing. The `title` property of each `listing` is
`split()` on all non-word characters to create this list of `terms`.

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
> This is a fault in the procedure of matching. If the `title` of a `listing` has more than one (> 1) `term` which matches with the generated list of manufacturer names, then this `listing` will match on all `manufacturers`.
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

### Usage
1. `$ mkdir my-solution`
2. `$ cd my-solution`
3. `$ git clone https://github.com/mikemimik/codechallenge-sortable.git ./`
4. `$ npm install` **OR** `>$ npm install --only=prod` *(faster)*
5. `$ npm start`

### Docs
> (assuming all **Usage** steps have been done)

1. `$ npm run generate-docs`
