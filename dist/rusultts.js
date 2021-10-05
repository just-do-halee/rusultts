"use strict";
// rusultTs
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
exports.Err = exports.Ok = exports.ResultBox = void 0;
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
    ResultBox.prototype.unwrap = function () {
        if (this.val.error) {
            this.val.error.message += ':--> ' + String(this.val.value);
            throw this.val.error;
        }
        else {
            return this.val.value;
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
