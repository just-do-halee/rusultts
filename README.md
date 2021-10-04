# `rusultTs`

Rust **_Result Implementation for Typescript_**, simply. i.e. Modern error handling library. (no dependencies, pure Typescript code about 50 lines) 100% <a href="./coverage/lcov-report/index.html">[coverage]</a>
<br>
<br>

![Coverage lines](./coverage/badge-lines.svg)
![Coverage functions](./coverage/badge-functions.svg)
![Coverage branches](./coverage/badge-branches.svg)
![Coverage statements](./coverage/badge-statements.svg)

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![CI](https://github.com/just-do-halee/rusultts/actions/workflows/main.yml/badge.svg)](https://github.com/just-do-halee/rusultts/actions/workflows/main.yml)
[![License][license-image]][license-url]

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
function divide(a: number, b: number): ResultBox<number, number> {
  if (b === 0) {
    return Err.new(`b cannot be 0.`, b);
  }
  return Ok.new(a / b);
}
const ok = divide(4, 2).unwrap() === 2; // true
const err = divide(4, 0).isErr; // true
try {
  err.unwrap();
} catch (e) {
  const value = Err.eSplit(e)[1]; // "0"
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
