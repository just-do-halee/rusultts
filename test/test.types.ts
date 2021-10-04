import { Result, Ok, Err } from '../src/rusultts';

type StrNode = {
  readonly prev?: StrNode;
  readonly str: string;
};

export interface IStack {
  get length(): number;
  capacity: number;
  push(value: string): Result<IStack>;
  pop(): Result<string>;
  print(): IStack;
}

export class Stack implements IStack {
  #cap: number = 8;
  #len: number = 0;
  #lastNode: StrNode = {
    str: '',
  };
  get length(): number {
    return this.#len;
  }
  set capacity(value: number) {
    if (value > this.#cap) {
      this.#cap = value;
    }
  }
  get capacity(): number {
    return this.#cap;
  }
  protected constructor() {}
  static new(): IStack {
    return new Stack();
  }
  static withCapacity(cap: number): IStack {
    const vec = new Stack();
    vec.#cap = cap < 0 ? 0 : cap;
    return vec;
  }
  push(value: string): Result<IStack> {
    if (this.#len >= this.#cap) {
      return Err.new(`full of stack`, null);
    }
    this.#lastNode = {
      prev: this.#lastNode,
      str: value,
    };
    this.#len++;
    return Ok.new(this);
  }
  pop(): Result<string> {
    if (!this.#lastNode.prev) {
      return Err.new(`out of bounds`, null);
    }
    const str = this.#lastNode.str;
    this.#lastNode = this.#lastNode.prev;
    this.#len--;
    return Ok.new(str);
  }
  print(): IStack {
    let lastNode = this.#lastNode;
    let output = '';
    while (lastNode.prev) {
      output += lastNode.str + ' ';
      lastNode = lastNode.prev;
    }
    console.log(output);
    return this;
  }
}
