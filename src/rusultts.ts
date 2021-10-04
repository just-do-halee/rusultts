// rusultTs

type ResultObject<T> = {
  readonly error?: Error;
  readonly value: T;
};

/**
 * ## Examples
 *```ts
 * function divide(a: number, b: number): ResultBox<number, number> {
 *  if (b === 0) {
 *    return Err.new(`b cannot be 0.`, b);
 *  }
 *  return Ok.new(a / b);
 * }
 *
 * const ok = divide(4, 2).unwrap() === 2; // true
 * const err = divide(4, 0);
 * console.log(err.isErr); // true
 *
 * try {
 *
 *  err.unwrap();
 *
 * } catch(e) {
 *  const value = Err.eSplit(e)[1]; // "0"
 * }
 *```
 */
export abstract class ResultBox<T, E> {
  readonly isOk: boolean;
  readonly isErr: boolean;
  protected constructor(protected readonly val: ResultObject<T | E>) {
    this.isOk = val.error === undefined;
    this.isErr = !this.isOk;
  }
  unwrap(): T | never {
    if (this.val.error) {
      this.val.error.message += ':--> ' + String(this.val.value);
      throw this.val.error;
    } else {
      return this.val.value as T;
    }
  }
}

/**
 * ## Examples
 *```ts
 * function divide(a: number, b: number): ResultBox<number, number> {
 *  if (b === 0) {
 *    return Err.new(`b cannot be 0.`, b);
 *  }
 *  return Ok.new(a / b);
 * }
 *
 * const ok = divide(4, 2).unwrap() === 2; // true
 * const err = divide(4, 0);
 * console.log(err.isErr); // true
 *
 * try {
 *
 *  err.unwrap();
 *
 * } catch(e) {
 *  const value = Err.eSplit(e)[1]; // "0"
 * }
 *```
 */
export class Ok<T, E> extends ResultBox<T, E> {
  private constructor(value: T) {
    super({ value });
  }
  static new<T, E>(val: T) {
    return new Ok<T, E>(val);
  }
}

/**
 * ## Examples
 *```ts
 * function divide(a: number, b: number): ResultBox<number, number> {
 *  if (b === 0) {
 *    return Err.new(`b cannot be 0.`, b);
 *  }
 *  return Ok.new(a / b);
 * }
 *
 * const ok = divide(4, 2).unwrap() === 2; // true
 * const err = divide(4, 0);
 * console.log(err.isErr); // true
 *
 * try {
 *
 *  err.unwrap();
 *
 * } catch(e) {
 *  const value = Err.eSplit(e)[1]; // "0"
 * }
 *```
 */
export class Err<T, E> extends ResultBox<T, E> {
  private constructor(message: string, value: E) {
    super({ error: new Error(message), value });
  }
  static new<T, E>(msg: string, val: E) {
    return new Err<T, E>(msg, val);
  }
  /**
   *
   * @param e Error
   * @returns [`error.message`, `<E>.toString()`] or ***[error.message, ''] (not found)***
   */
  static eSplit(e: Error): [string, string] {
    let val: string[] = e.message.split(':--> ', 2);
    if (val.length !== 2) {
      val = [val[0] || '', ''];
    }
    return val as [string, string];
  }
}

/**
 * easy one, has value of Error as `null`
 */
export type Result<T> = ResultBox<T, null>;
