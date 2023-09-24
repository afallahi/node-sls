[![npm version][npm-image]][npm-url]
[![downloads][downloads-image]][npm-url]
[![build status][build-image]][build-url]
[![coverage status][coverage-image]][coverage-url]
[![Language grade: JavaScript][lgtm-image]][lgtm-url]
[![Node.JS version][node-version]][node-url]


# short-tree

`ShortTree` is a class extending `RBTree` from [bintrees][bintrees-npm-url], and **works explicitly on nodes of arrays**.

The `ShortTree< T >` class extends `RBTree< Array< T > >`.

`insert` is overloaded and behaves differently. When adding a node, it will first check if there is another shorter node being the beginning of the to-be-inserted node, and if so, won't insert. It also checks if there are existing longer nodes which begin with the newly inserted node, and deletes them.

A new function is added `values()` which returns `Array< Array< T > >`, i.e. an array of all nodes (and again, each node is an array of `T`).


# Algorithm


When inserting `[ 'a', 'b', 'c', 'd' ]`, **one** node is inserted with this value.

Inserting  `[ 'x', 'y' ]`, will insert **one** new node.

If later, `[ 'a', 'b', 'c', 'd', 'e' ]` is inserted, it won't be - there's already a "shorter" version of this node (the first one inserted).

If later, `[ 'a', 'b' ]` is inserted, the first node `[ 'a', 'b', 'c', 'd' ]` will be removed (or "chopped off" after `b`).


# API

Construct a `ShortTree` by giving the comparison function for `T`.

If `T` is `number` e.g., this could be `(a, b) => a - b`.


## Example

```ts
import { ShortTree } from 'short-tree'

// T is deduced to {string}
const tree = new ShortTree( ( a: string, b: string ) => a.localeCompare( b ) );

tree.insert( [ 'a', 'b', 'c', 'd' ] );
tree.insert( [ 'x', 'y' ] );
// This will "chop off" (i.e. remove) [ 'a', 'b', 'c', 'd' ]
tree.insert( [ 'a', 'b' ] );

tree.values( ); // [ [ 'a', 'b' ], [ 'x', 'y' ] ]
```


[npm-image]: https://img.shields.io/npm/v/short-tree.svg
[npm-url]: https://npmjs.org/package/short-tree
[downloads-image]: https://img.shields.io/npm/dm/short-tree.svg
[build-image]: https://img.shields.io/github/workflow/status/grantila/short-tree/Master.svg
[build-url]: https://github.com/grantila/short-tree/actions?query=workflow%3AMaster
[coverage-image]: https://coveralls.io/repos/github/grantila/short-tree/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/grantila/short-tree?branch=master
[lgtm-image]: https://img.shields.io/lgtm/grade/javascript/g/grantila/short-tree.svg?logo=lgtm&logoWidth=18
[lgtm-url]: https://lgtm.com/projects/g/grantila/short-tree/context:javascript
[node-version]: https://img.shields.io/node/v/short-tree
[node-url]: https://nodejs.org/en/

[bintrees-npm-url]: https://npmjs.org/package/bintrees
