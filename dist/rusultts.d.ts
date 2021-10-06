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
export declare abstract class ResultBox<T, E> implements IResult<T, E> {
    protected readonly val: ResultObject<T | E>;
    readonly isOk: boolean;
    readonly isErr: boolean;
    protected constructor(val: ResultObject<T | E>);
    /**
     *
     * @returns if isErr is true, throw new `Error` with `${message}:--> ${JSON.stringify(value<E>)}` or returns `value<T>`
     * @that `Error` (this can be splited by eSplit)
     */
    unwrap(): T | never;
    /**
     *
     * @param inputValue
     * @returns if isErr is true, returns `inputValue<T>` or stored `value<T>`
     */
    unwrap_or(inputValue: T): T;
    /**
     *
     * @param {callback} op - callback (innerValue: `E`) => `T`
     * @returns if isOk is true, returns `value<T>` or computes it from a operating function, contained `value<E> to specific T value`
     */
    unwrap_or_else(op: (innerValue: E) => T): T;
    /**
     *
     * @returns if isOk is true, throw new `Error` or `value<E>`
     * @that `Error` === 'this is not an Error:--> ' + JSON.stringify(`value<T>`) (this can be splited by eSplit)
     */
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
     * @returns [`error.message`, `value<E>`] or ***[`string`, null] (not found)***
     */
    static eSplit<E>(e: Error | unknown): [string, E | null];
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
    match<E>(e: Error | unknown, errorMessageType: keyof M): ResultBox<E | undefined, unknown>;
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
