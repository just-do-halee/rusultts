export declare type ResultObject<T> = {
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
export declare abstract class ResultBox<T, E> {
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
