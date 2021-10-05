/**
 * kind of internal subject(ok or err)
 */
export declare type ResultObject<T> = {
    readonly error?: Error;
    readonly value: T;
};
/**
 * international interface
 */
export interface IResult<T, E> {
    readonly isOk: boolean;
    readonly isErr: boolean;
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
export declare abstract class ResultBox<T, E> implements IResult<T, E> {
    protected readonly val: ResultObject<T | E>;
    readonly isOk: boolean;
    readonly isErr: boolean;
    protected constructor(val: ResultObject<T | E>);
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
export declare class Ok<T, E> extends ResultBox<T, E> {
    private constructor();
    static new<T, E>(val: T): Ok<T, E>;
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
export declare class Err<T, E> extends ResultBox<T, E> {
    private constructor();
    static new<T, E>(msg: string, val: E): Err<T, E>;
    /**
     *
     * @param e Error | unknown
     * @returns [`error.message`, `<E>.toString()`] or ***[error.message, ''] (not found)***
     */
    static eSplit(e: Error | unknown): [string, string];
}
/**
 * easy one, has value of Error as `null`
 */
export declare type Result<T> = ResultBox<T, null>;
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
export declare type MessagePair = {
    [key: string]: string;
};
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
export declare class ErrSet<M extends MessagePair> {
    readonly messagePair: M;
    constructor(messagePair: M);
    /**
     * creates and return the error that have already been set.
     */
    new<T, E>(errorMessageType: keyof M): Err<T, null>;
    new<T, E>(errorMessageType: keyof M, val: E): Err<T, E>;
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
    match(e: Error | unknown, errorMessageType: keyof M): ResultBox<string | undefined, unknown>;
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
export declare const createErrorSet: <M extends MessagePair>(messagePair: M) => ErrSet<M>;
