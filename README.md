# `rusultTs`

Rust **_Result Implementation for Typescript_**, simply. i.e. Modern error handling library. (no dependencies, pure Typescript code about 200 lines) 100% [[coverage]][ci-url]
<br>
<br>

[![Coverage lines](./badges/badge-lines.svg)][ci-url]
[![Coverage functions](./badges/badge-functions.svg)][ci-url]
[![Coverage branches](./badges/badge-branches.svg)][ci-url]
[![Coverage statements](./badges/badge-statements.svg)][ci-url]

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![CI](https://github.com/just-do-halee/rusultts/actions/workflows/main.yml/badge.svg)][ci-url]
[![License][license-image]][license-url]
[![run on repl.it](https://repl.it/badge/github/just-do-halee/rusultts)](https://replit.com/@justdohalee/rusultts-playground#index.ts)
[[changelog]](CHANGELOG.md)

---

## **Installation**<br>

```js
npm install rusultts
```

or

```js
yarn add rusultts
```

## **Examples**<br>

```ts
import { Result, Ok, Err } from 'rusultts';

// Result<T>: any type can be into it,
// This is just the generic type.

// I chose <T> as object.

type SomeType = { foo: string, bar: number };

// Also these are just some example functions.

function tryParse(token: string): Result<SomeType> {

  // ... doing heavy stuffs ...

  if (somethingWrong) { // happended

    // so returns an Error-Object implementing Result<T>

    return Err.new(`something wrong...`, null);

  }

  // Or returns an Ok Object containing value for <SomeType>

  return Ok.new({ foo: 'any', bar: 999 });

}

// tryParse() wrapping function

function verify(token: string): Result<boolean> {

  // ↓ automatic throwing new Error(), or retuns the <SomeType> directly.

  const someType = tryParse(token).unwrap();

  // ... doing more stuffs ...

  // another unwrap

  const isItGood = tryGetBool(...).unwrap();

  // ...

  return Ok.new(isItGood);
}

try {

  // if unwrap is possible, you get a sign that you can use an obvious try catch statement.

  const bool = verify(someToken).unwrap();

} catch(e) {

  // ↓ can get [`string`, 'E | null'] type value.

  const [msg, value] = Err.eSplit(e);

  // message of error & contained value<E>
  // this value is `null` because of Result<T> = ResultBox<T, null>

  console.log(msg, value);

}
```

### ResultBox

```ts
type Result<T> = ResultBox<T, null>;
```

```ts
import { ResultBox, Ok, Err } from 'rusultts';

// simple example
// ResultBox<T, E>: <E> equals containing user value for Error statement. it can be any type.

function divide(a: number, b: number): ResultBox<number, number> {
  if (b === 0) {
    return Err.new(`b cannot be `, b);
  }
  return Ok.new(a / b);
}

const val = divide(4, 2).unwrap(); // 4 / 2 = 2
const err = divide(4, 0); // 4 / 0, so error statement.

console.log(err.isErr); // true

// returns contained value<number> = 0
const getValueE = err.unwrap_err();

// if state is error, returns input value = 10
const getDefault = err.unwrap_or(10);

// like .map((x) => y) for value<E>
// ↓ will return 1
const getMapped = err.unwrap_or_else((eV: number) => eV + 1);

try {
  err.unwrap();
} catch (e) {
  const [errMessage, valueE] = Err.eSplit(e);

  // print `b cannot be :--> -1` out.
  console.log(errMessage, (-1 + valueE) as number);
}
```

## **Advanced**<br>

#### **./errors.ts**

```ts
import { createErrorSet } from 'rusultts';

// you can easily set all errors.

export default createErrorSet({
  notFound: 'not found',
  somethingWrong: 'something wrong...',
  wrongHeader: 'please fix your header.',
  undefinedValue: 'this value is undefined:',
  dividedByZero: 'do not divide by Zero.',
  dividedByNegative: 'well, you did divide as Negative value.',
});
```

```ts
import { ResultBox, Ok, Err } from 'rusultts';

import err from './errors'; // import errors

function divide(a: number, b: number): ResultBox<number, number> {
  if (b === 0) {
    return err.new('dividedByZero', b); // autocompleted string argument
  } else if (b < 0) {
    return err.new('dividedByNegative', b);
  }
  return Ok.new(a / b);
}

try {
  divide(4, -2).unwrap(); // dividedByNegative error occurs.
} catch (e) {
  // you can do error type matching.
  const val1 = err.match(e, 'dividedByZero').unwrap(); // this will return undefined.
  const val2 = err.match(e, 'dividedByNegative').unwrap(); // this will return value of number type, `-2`
  const val3 = err.match({ is: 'not errorType' }, 'dividedByNegative').unwrap(); // throw new Error
}
```

## **License**<br>

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/rusultts.svg
[npm-url]: https://npmjs.org/package/rusultts
[downloads-image]: https://img.shields.io/npm/dm/rusultts.svg
[downloads-url]: https://npmcharts.com/compare/rusultts?minimal=true
[license-url]: https://opensource.org/licenses/MIT
[license-image]: https://img.shields.io/npm/l/rusultts
[ci-url]: https://github.com/just-do-halee/rusultts/actions/workflows/main.yml
