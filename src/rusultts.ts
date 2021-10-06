// (c) 2021 just-do-halee(=Hwakyeom Kim)

/**
 * kind of internal subject(ok or err)
 */
export type ResultObject<T> = {
  readonly error?: Error;
  readonly value: T;
};

/**
 * international interface
 */
export interface IResult<T, E> {
  readonly isOk: boolean;
  readonly isErr: boolean;
  // Returning internal value or Throw an error
  unwrap(): T | never;
  unwrap_or(inputValue: T): T;
  unwrap_or_else(op: (innerValue: E) => T): T;
  unwrap_err(): E | never;
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
export abstract class ResultBox<T, E> implements IResult<T, E> {
  readonly isOk: boolean;
  readonly isErr: boolean;
  protected constructor(protected readonly val: ResultObject<T | E>) {
    this.isOk = val.error === undefined;
    this.isErr = !this.isOk;
  }
  /**
   *
   * @returns if isErr is true, throw new `Error` with `${message}:--> ${JSON.stringify(value<E>)}` or returns `value<T>`
   * @that `Error` (this can be splited by eSplit)
   */
  unwrap(): T | never {
    if (this.val.error) {
      this.val.error.message += ':--> ' + JSON.stringify(this.val.value);
      throw this.val.error;
    } else {
      return this.val.value as T;
    }
  }
  /**
   *
   * @param inputValue
   * @returns if isErr is true, returns `inputValue<T>` or stored `value<T>`
   */
  unwrap_or(inputValue: T): T {
    if (this.isErr) {
      return inputValue;
    } else {
      return this.val.value as T;
    }
  }
  /**
   *
   * @param {callback} op - callback (innerValue: `E`) => `T`
   * @returns if isOk is true, returns `value<T>` or computes it from a operating function, contained `value<E> to specific T value`
   */
  unwrap_or_else(op: (innerValue: E) => T): T {
    if (this.val.error) {
      return op(this.val.value as E);
    } else {
      return this.val.value as T;
    }
  }
  /**
   *
   * @returns if isOk is true, throw new `Error` or `value<E>`
   * @that `Error` === 'this is not an Error:--> ' + JSON.stringify(`value<T>`) (this can be splited by eSplit)
   */
  unwrap_err(): E | never {
    if (this.val.error) {
      return this.val.value as E;
    } else {
      throw new Error(
        'this is not an Error:--> ' + JSON.stringify(this.val.value)
      );
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
   * @param e Error | unknown
   * @returns [`error.message`, `value<E>`] or ***[`string`, null] (not found)***
   */
  static eSplit<E>(e: Error | unknown): [string, E | null] {
    if (!(e instanceof Error)) {
      return ['', null];
    }
    let val: string[] = e.message.split(':--> ', 2);
    if (val.length !== 2) {
      return [val[0] || '', null];
    }
    return [val[0], JSON.parse(val[1])];
  }
}

/**
 * easy one, has value of Error as `null`
 */
export type Result<T> = ResultBox<T, null>;

/**
 * error's message pair object
 * ## Example
 * ```ts
 * const mp: MessagePair = {
 *  notFound: 'not found',
 *  somethingWrong: 'something wrong...',
 *  wrongHeader: 'please fix your header.'
 * }
 * ```
 */
export type MessagePair = { [key: string]: string };

/**
 * creates errors that have already been set.
 * ## Example
 * ```ts
 * const err = createErrorSet({
 *  notFound: 'not found',
 *  somethingWrong: 'something wrong...',
 *  wrongHeader: 'please fix your header.'
 * });
 *
 * err.new('wrongHeader'); // === Err.new('please fix your header.', null)
 * ```
 */
export class ErrSet<M extends MessagePair> {
  constructor(public readonly messagePair: M) {}
  /**
   * creates and return the error that have already been set.
   */
  new<T, E>(errorMessageType: keyof M): Err<T, null>;
  new<T, E>(errorMessageType: keyof M, val: E): Err<T, E>;
  new<T>(errorMessageType: keyof M, val?: any): Err<T, any> {
    return Err.new(
      this.messagePair[errorMessageType],
      val === undefined ? null : val
    );
  }
  /**
   *
   * @param {Error} e the error in the scope of try~catch.
   * @param {MessagePair} errorMessageType in the MessagePair.
   * @returns if `e` is not Error type, return Err<, Type>, or returns Ok<string | undefined,> which means `e` equals the error of errorMessageType then returns `error value<E>` or `undefined`.
   *
   * ## Example
   *```ts
   * const test = divide(4, 0);
   * try {
   *  test.unwrap();
   * } catch (e) {
   *  const val = err.match(e, 'dividedByZero').unwrap();
   *  if(val) {
   *    return val; // = 0 <- number type
   *  } else {
   *    return 'unexpected error.';
   *  }
   * }
   * ```
   */
  match<E>(
    e: Error | unknown,
    errorMessageType: keyof M
  ): ResultBox<E | undefined, unknown> {
    if (!(e instanceof Error)) {
      return Err.new(`e is unknown type:`, e);
    }
    const [message, value] = Err.eSplit(e);
    return Ok.new(
      message === this.messagePair[errorMessageType] ? (value as E) : undefined
    );
  }
}

/**
 * creates errors that have already been set.
 * ## Example
 * ```ts
 * const err = createErrorSet({
 *  notFound: 'not found',
 *  somethingWrong: 'something wrong...',
 *  wrongHeader: 'please fix your header.'
 * });
 *
 * err.new('wrongHeader'); // === Err.new('please fix your header.', null)
 * ```
 */
export const createErrorSet = <M extends MessagePair>(
  messagePair: M
): ErrSet<M> => {
  return new ErrSet(messagePair);
};
