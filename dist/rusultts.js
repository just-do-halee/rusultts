"use strict";
// (c) 2021 just-do-halee(=Hwakyeom Kim)
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorSet = exports.ErrSet = exports.Err = exports.Ok = exports.ResultBox = void 0;
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
var ResultBox = /** @class */ (function () {
    function ResultBox(val) {
        this.val = val;
        this.isOk = val.error === undefined;
        this.isErr = !this.isOk;
    }
    /**
     *
     * @returns if isErr is true, throw new `Error` with `${message}:--> ${value<E>}` or `value<T>`
     */
    ResultBox.prototype.unwrap = function () {
        if (this.val.error) {
            this.val.error.message += ':--> ' + String(this.val.value);
            throw this.val.error;
        }
        else {
            return this.val.value;
        }
    };
    /**
     *
     * @param inputValue
     * @returns if isErr is true, returns `inputValue<T>` or stored `value<T>`
     */
    ResultBox.prototype.unwrap_or = function (inputValue) {
        if (this.isErr) {
            return inputValue;
        }
        else {
            return this.val.value;
        }
    };
    /**
     *
     * @param {callback} op - callback (innerValue: `E`) => `T`
     * @returns if isOk is true, returns `value<T>` or computes it from a operating function, contained `value<E> to specific T value`
     */
    ResultBox.prototype.unwrap_or_else = function (op) {
        if (this.val.error) {
            return op(this.val.value);
        }
        else {
            return this.val.value;
        }
    };
    /**
     *
     * @returns if isOk is true, throw new `Error` or `value<E>`
     */
    ResultBox.prototype.unwrap_err = function () {
        if (this.val.error) {
            return this.val.value;
        }
        else {
            throw new Error("this is not an Error: " + this.val.value);
        }
    };
    return ResultBox;
}());
exports.ResultBox = ResultBox;
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
var Ok = /** @class */ (function (_super) {
    __extends(Ok, _super);
    function Ok(value) {
        return _super.call(this, { value: value }) || this;
    }
    Ok.new = function (val) {
        return new Ok(val);
    };
    return Ok;
}(ResultBox));
exports.Ok = Ok;
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
var Err = /** @class */ (function (_super) {
    __extends(Err, _super);
    function Err(message, value) {
        return _super.call(this, { error: new Error(message), value: value }) || this;
    }
    Err.new = function (msg, val) {
        return new Err(msg, val);
    };
    /**
     *
     * @param e Error | unknown
     * @returns [`error.message`, `<E>.toString()`] or ***[error.message, ''] (not found)***
     */
    Err.eSplit = function (e) {
        if (!(e instanceof Error)) {
            return ['', ''];
        }
        var val = e.message.split(':--> ', 2);
        if (val.length !== 2) {
            val = [val[0] || '', ''];
        }
        return val;
    };
    return Err;
}(ResultBox));
exports.Err = Err;
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
var ErrSet = /** @class */ (function () {
    function ErrSet(messagePair) {
        this.messagePair = messagePair;
    }
    ErrSet.prototype.new = function (errorMessageType, val) {
        return Err.new(this.messagePair[errorMessageType], val === undefined ? null : val);
    };
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
    ErrSet.prototype.match = function (e, errorMessageType) {
        if (!(e instanceof Error)) {
            return Err.new("e is unknown type:", e);
        }
        var _a = Err.eSplit(e), message = _a[0], value = _a[1];
        return Ok.new(message === this.messagePair[errorMessageType] ? value : undefined);
    };
    return ErrSet;
}());
exports.ErrSet = ErrSet;
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
var createErrorSet = function (messagePair) {
    return new ErrSet(messagePair);
};
exports.createErrorSet = createErrorSet;
