# codechallenge-sortable

This is my humble solution to the coding challenge presented by [Sortable](http://sortable.com/challenge/).

### About
The idea behind this challenge is to take a list of `listings` and sort through them and match a relevant `listing` to a `product` from a given list of `products`. The problem points become when you realise that the list of `listings` is not standardized in that, each of the `values` of the given `keys` on each `listing` object doesn't necessarily have the same data format as any other `listing`. The job then becomes, how best can you extract reliable data from the `listings` so that you can reliably match a `listing` to a given `product` from the list of `products`.

### Usage
1. `$ mkdir my-solution`
2. `$ cd my-solution`
3. `$ git clone https://github.com/mikemimik/codechallenge-sortable.git ./`
4. `$ npm install` **OR** `>$ npm install --only=prod` *(faster)*
5. `$ npm start`
