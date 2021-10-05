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
   * @param e Error | unknown
   * @returns [`error.message`, `<E>.toString()`] or ***[error.message, ''] (not found)***
   */
  static eSplit(e: Error | unknown): [string, string] {
    if (!(e instanceof Error)) {
      return ['', ''];
    }
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
   * @returns if `e` is not Error type, return Err<, Type>, or returns Ok<string | undefined,> which means `e` === the error of errorMessageType then returns `error value<E>` or `undefined`.
   *
   * ## Example
   *```ts
   * const test = divide(4, 0);
   * try {
   *  test.unwrap();
   * } catch (e) {
   *  const val = err.match(e, 'dividedByZero').unwrap();
   *  if(val) {
   *    return val;
   *  } else {
   *    return 'unexpected error.';
   *  }
   * }
   * ```
   */
  match(
    e: Error | unknown,
    errorMessageType: keyof M
  ): ResultBox<string | undefined, unknown> {
    if (!(e instanceof Error)) {
      return Err.new(`e is unknown type:`, e);
    }
    const [message, value] = Err.eSplit(e);
    return Ok.new(
      message === this.messagePair[errorMessageType] ? value : undefined
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
