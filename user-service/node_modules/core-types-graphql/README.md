[![npm version][npm-image]][npm-url]
[![downloads][downloads-image]][npm-url]
[![build status][build-image]][build-url]
[![coverage status][coverage-image]][coverage-url]
[![Language grade: JavaScript][lgtm-image]][lgtm-url]
[![Node.JS version][node-version]][node-url]


# core-types-graphql

This package provides conversion functions between [`core-types`][core-types-github-url] and GraphQL.

*You probably don't want to use this package directly, but rather [`typeconv`][typeconv-github-url] which uses this package to convert between TypeScript, JSON Schema and GraphQL.*

Other conversion packages:
 * [`core-types-ts`][core-types-ts-github-url]
 * [`core-types-json-schema`][core-types-json-schema-github-url]


# Contents

 * [Usage](#usage)
   * [core-types to GraphQL](#core-types-to-graphql)
   * [GraphQL to core-types](#graphql-to-core-types)
 * [Utilities](#utilities)


# Usage

There are two conversion functions, `convertCoreTypesToGraphql` and `convertGraphqlToCoreTypes`, both returning a wrapped value, of the type [`ConversionResult`](https://github.com/grantila/core-types#conversion).


## core-types to GraphQL

Conversion can be done to GraphQL *code* using `convertCoreTypesToGraphql`, but also to GraphQL *AST* using `convertCoreTypesToGraphqlAst`. The arguments to these are the same.

```ts
import { convertCoreTypesToGraphql } from 'core-types-graphql'

let doc; // This core-types document comes from somewhere

const { data: graphQL } = convertCoreTypesToGraphql( doc );
```

You can provide options as a second argument fn the type:

```ts
interface CoreTypesToGraphqlOptions
{
	warn?: WarnFunction;
	filename?: string;
	sourceFilename?: string;
	userPackage?: string;
	userPackageUrl?: string;
	nullTypeName?: string | null;
	nameGenerator?: NameGeneratorFunction;
	unsupported?: 'ignore' | 'warn' | 'error';
	includeComment?: boolean;
}
```

These options are all optional.

 * `warn`: A function callback to be used for warnings, defaults to `console.warn`.
 * `filename` The filename to be written to.<br />This is a hint, no file will be written by the conversion function.
 * `sourceFilename`: The name of the source file from which the core-types comes.
 * `userPackage`: The name of the package using this package.
 * `userPackageUrl`: The url to the package using this package.
 * `nullTypeName`: Optional custom type used for null.
 * `nameGenerator`: A function for generating names.<br />GraphQL doesn't support inline objects or union types,<br />so these must be constructed as separate types.
 * `unsupported`: What to do when detecting an unsupported type
   * `ignore`: Ignore (skip) type
   * `warn`: Ignore type, but warn (default)
   * `error`: Throw an error
 * `includeComment`: Includes a header comment about the auto-generated file.<br />Defaults to `true`.

The `warn` function is of type `WarnFunction` from [`core-types`][core-types-github-url], meaning it takes a message as string, and an optional second argument of type `CoreTypesErrorMeta`, also from [`core-types`][core-types-github-url].

The `nameGenerator` function is of type `NameGeneratorFunction` defined as:

```ts
( baseName: string, nameHint: string, test: NameGeneratorTestFunction ) => string;
```

where `NameGeneratorTestFunction` is a test function to check if the generated name is available, on the form:

```ts
( name: string ) => boolean;
```

If this is specified (instead of letting a default name generator be used), an implementation is supposed to generate a name, potentially based on the `baseName` and a `nameHint` (e.g. an interface name and a property name within that interface), and test this generated name against `test`, altering it if necessary until `test` returns `true`, and then return that string.


## GraphQL to core-types

```ts
import { convertGraphqlToCoreTypes } from 'core-types-graphql'

let graphQL; // This GraphQL string comes from somewhere

const { data: doc } = convertGraphqlToCoreTypes( graphQL );
```

An optional second argument can be provided on the form

```ts
interface GraphqlToCoreTypesOptions
{
	warn?: WarnFunction;
	unsupported?: 'ignore' | 'warn' | 'error';
}
```

 * `warn`: The same warn function as in [CoreTypesToGraphqlOptions](#core-types-to-graphql)
 * `unsupported`: What to do when detecting an unsupported type
   * `ignore`: Ignore (skip) type (default)
   * `warn`: Ignore type, but warn
   * `error`: Throw an error


# Utilities

This package exports two utility functions; `getBreakingChanges` and `getDangerousChanges` which both take two GraphQL source code texts (as strings) semantically meaning an "old" and a "new" version of a schema. The functions return a list of breaking/dangerous changes on the type `BreakingChange`/`DangerousChange` from the [`graphql`][graphql-npm-url] package.


[npm-image]: https://img.shields.io/npm/v/core-types-graphql.svg
[npm-url]: https://npmjs.org/package/core-types-graphql
[downloads-image]: https://img.shields.io/npm/dm/core-types-graphql.svg
[build-image]: https://img.shields.io/github/workflow/status/grantila/core-types-graphql/Master.svg
[build-url]: https://github.com/grantila/core-types-graphql/actions?query=workflow%3AMaster
[coverage-image]: https://coveralls.io/repos/github/grantila/core-types-graphql/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/grantila/core-types-graphql?branch=master
[lgtm-image]: https://img.shields.io/lgtm/grade/javascript/g/grantila/core-types-graphql.svg?logo=lgtm&logoWidth=18
[lgtm-url]: https://lgtm.com/projects/g/grantila/core-types-graphql/context:javascript
[node-version]: https://img.shields.io/node/v/core-types-graphql
[node-url]: https://nodejs.org/en/

[typeconv-github-url]: https://github.com/grantila/typeconv
[core-types-github-url]: https://github.com/grantila/core-types
[core-types-ts-github-url]: https://github.com/grantila/core-types-ts
[core-types-json-schema-github-url]: https://github.com/grantila/core-types-json-schema
[graphql-npm-url]: https://npmjs.org/package/graphql
