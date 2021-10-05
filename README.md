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

function tryParse(token: string): Result<SomeType> {
  // ... heavy stuffs
  if (somethingWrong) {
    return Err.new(`something wrong...`, null);
  }
  // ...
  return Ok.new({ some: 'type', ...stuffs });
}

function verify(token: string): boolean {
  const someType = tryParse(token).unwrap(); // automatically throw
  // ... more some stuffs
  const isItGood = tryGetBool(...).unwrap();
  // ...
  return isItGood;
}

const bool = verify(someToken);
```

### ResultBox

```ts
type Result<T> = ResultBox<T, null>;
```

```ts
import { ResultBox, Ok, Err } from 'rusultts';

function divide(a: number, b: number): ResultBox<number, number> {
  if (b === 0) {
    return Err.new(`b cannot be `, b);
  }
  return Ok.new(a / b);
}
const ok = divide(4, 2).unwrap() === 2; // true
const err = divide(4, 0); // 4 / 0

console.log(err.isErr); // true
const getEValue = err.unwrap_err(); // 0
const getDefault = err.unwrap_or(10); // 10
const getTrans = err.unwrap_or_else((eV: number) => eV + 1); // 1

try {
  err.unwrap();
} catch (e) {
  const errMessage = Err.eSplit(e); // `b cannot be :--> 0`
}
```

## **Advanced**<br>

```ts
import { createErrorSet } from 'rusultts';

const err = createErrorSet({
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
// and also import our **const `err`**

function divide(a: number, b: number): ResultBox<number, number> => {
  if (b === 0) {
    return err.new('dividedByZero', b); // autocompleted string
  } else if (b < 0) {
    return err.new('dividedByNegative', b);
  }
  return Ok.new(a / b);
};

try {
  divide(4, -2).unwrap();
} catch (e) {
  const val1 = err.match(e, 'dividedByZero').unwrap(); // val1 === undefined
  const val2 = err.match(e, 'dividedByNegative').unwrap(); // val2 === '-2'
  const val3 = err.match({ is: 'not errorType' }, 'dividedByNegative').unwrap(); // throw new Error()
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
