import {
  Result,
  ResultBox,
  Ok,
  Err,
  createErrorSet,
  ErrSet,
} from '../src/rusultts';
import { Stack } from './test.types';

describe('make some results', () => {
  let createResultTest: <T, E>(okValue?: T, errValue?: E) => Result<T | E>;

  beforeAll(() => {
    createResultTest = <T, E>(okValue?: T, errValue?: E): Result<T | E> => {
      let Result0: ResultBox<T, E>;
      if (okValue) {
        Result0 = Ok.new(okValue);
      } else if (errValue) {
        Result0 = Err.new('some error message', errValue);
      } else {
        return Err.new(`testing error.`, null);
      }
      expect(Result0).toBeInstanceOf(ResultBox);
      expect(Result0.isOk).toEqual(okValue !== undefined);
      expect(Result0.isErr).toEqual(errValue !== undefined);
      try {
        expect(Result0.unwrap()).toEqual(okValue);

        return Ok.new(Result0.unwrap());
      } catch (e) {
        expect(errValue).toBeDefined();
        if (errValue) {
          return Ok.new(errValue);
        } else {
          return Err.new(`testing error.`, null);
        }
      }
    };
  });

  it('should be ok before entire testing', () => {
    // types
    expect(createResultTest('ok string').isOk).toEqual(true);
    expect(createResultTest(999).unwrap()).toEqual(999);
    expect(createResultTest(undefined, 'err').unwrap()).toEqual('err');
    expect(createResultTest(undefined, 111).unwrap()).toEqual(111);
    const test1: object = { obj: 'value', some: [2, true] };
    expect(createResultTest(test1).unwrap()).toEqual(test1);
    const test2 = ['array', 23, true, 1.5];
    expect(createResultTest(test2).unwrap()).toEqual(test2);
    type SomeType = {
      name: string;
      age: number;
      hasAJob: boolean;
    };
    const test = {
      name: 'Name',
      age: 12,
      hasAJob: true,
    };
    expect(createResultTest<SomeType, undefined>(test).unwrap()).toEqual(test);
  });

  let divide: (a: number, b: number) => ResultBox<number, number>;
  let err: ErrSet<{
    dividedByZero: 'do not divide by Zero.';
    dividedByNegative: 'well, you did divide as Negative value.';
  }>;
  beforeEach(() => {
    err = createErrorSet({
      dividedByZero: 'do not divide by Zero.',
      dividedByNegative: 'well, you did divide as Negative value.',
    });
    expect(err.messagePair.dividedByZero).toEqual('do not divide by Zero.');
    expect(err.messagePair.dividedByNegative).toEqual(
      'well, you did divide as Negative value.'
    );

    divide = (a: number, b: number): ResultBox<number, number> => {
      if (b === 0) {
        return err.new('dividedByZero', b);
      } else if (b < 0) {
        return err.new('dividedByNegative', b);
      }
      return Ok.new(a / b);
    };
  });

  describe('unwrap_err', () => {
    it('should be passed', () => {
      expect(divide(4, 0).unwrap_err()).toEqual(0);
      expect(divide(4, -2).unwrap_err()).toEqual(-2);
      expect(() => divide(6, 2).unwrap_err()).toThrowError(
        `this is not an Error: 3`
      );
    });
    it('should return a number', () => {
      const someErr = Err.new<string, number>('T: number, E: string', 5);
      expect(someErr.unwrap_err()).toEqual(5);
    });
    it('should throw an Error', () => {
      const someOk = Ok.new<string, number>('string');
      expect(() => someOk.unwrap_err()).toThrowError(
        `this is not an Error: string`
      );
    });
  });

  describe('unwrap_or', () => {
    it('should be passed', () => {
      expect(divide(4, 0).unwrap_or(23)).toEqual(23);
      expect(divide(4, -2).unwrap_or(999)).toEqual(999);
      expect(divide(4, 2).unwrap_or(999)).toEqual(2);
    });
    it('should return a string', () => {
      const someErr = Err.new<string, number>('T: number, E: string', 5);
      expect(someErr.unwrap_or('string')).toEqual('string');
    });
    it('should return a string', () => {
      const someOk = Ok.new<string, number>('string');
      expect(someOk.unwrap_or('another string')).toEqual('string');
    });
  });

  describe('unwrap_or_else', () => {
    it('should be passed', () => {
      expect(divide(4, 0).unwrap_or_else((eV: number) => eV + 1)).toEqual(1);
      expect(divide(4, -2).unwrap_or_else((eV: number) => eV - 8)).toEqual(-10);
      expect(divide(4, 2).unwrap_or_else((eV: number) => eV - 100)).toEqual(2);
    });
    it('should return a string', () => {
      const someErr = Err.new<string, number>('T: number, E: string', 5);
      expect(someErr.unwrap_or_else((eV: number) => 'string')).toEqual(
        'string'
      );
    });
    it('should return a number', () => {
      const someOk = Ok.new<string, number>('string');
      expect(someOk.unwrap_or_else((eV: number) => 'string')).toEqual('string');
    });
  });

  it('should be passed', () => {
    const testResultNull = (a: number, b: number): Result<number> => {
      if (b === 0) {
        return err.new('dividedByZero');
      }
      return Ok.new(a / b);
    };
    expect(() => testResultNull(4, 0).unwrap()).toThrowError(
      'do not divide by Zero.:--> null'
    );
  });

  it('divides-> 4 / 2', () => {
    const test = divide(4, 2);
    expect(test.isOk).toEqual(true);
    expect(test.isErr).toEqual(false);
    expect(test.unwrap()).toEqual(2);
  });

  it('divides-> 4 / 0', () => {
    const test = divide(4, 0);
    expect(test.isOk).toEqual(false);
    expect(test.isErr).toEqual(true);
    try {
      test.unwrap();
      throw new Error(`testing error.`);
    } catch (e) {
      expect(Err.eSplit({ this: 'is unknown' })).toEqual(['', '']);
      expect(Err.eSplit(new Error(``))).toEqual(['', '']);
      expect(Err.eSplit(new Error(`fake Error`))[1]).toEqual('');
      expect(Err.eSplit(e)[1]).toEqual(String(0));
    }
  });

  it('divides-> 4 / -2', () => {
    const test = divide(4, -2);
    try {
      test.unwrap();
    } catch (e) {
      expect(() =>
        err.match({ type: 'unknown' }, 'dividedByNegative').unwrap()
      ).toThrowError('e is unknown type::--> [object Object]');
      expect(err.match(e, 'dividedByNegative').unwrap()).toEqual('-2');
      expect(err.match(e, 'dividedByZero').unwrap()).toBeUndefined();
    }
  });

  it('should be ok after entire testing', () => {
    // just for fun
    let stack = Stack.withCapacity(-10);
    expect(stack.capacity).toEqual(0);
    expect(stack.length).toEqual(0);
    stack.capacity = -1;
    expect(stack.capacity).toEqual(0);
    expect(stack.push('some').isErr).toEqual(true);
    stack.capacity = 5;
    expect(stack.capacity).toEqual(5);
    stack = Stack.withCapacity(10);
    expect(stack.capacity).toEqual(10);

    stack = Stack.new();

    expect(stack).toBeDefined();

    let res = stack.push('0');
    expect(res.isErr).toBeFalsy();
    expect(res.isOk).toBeTruthy();

    let res2 = res.unwrap();
    expect(res2).toBe(stack);
    expect(res2.pop().unwrap()).toEqual('0');
    try {
      res2.pop().unwrap();
    } catch (e) {
      expect(Err.eSplit(e)[1]).toEqual('null');
    }
    stack
      .push('1')
      .unwrap()
      .push('2')
      .unwrap()
      .print()
      .push('3')
      .unwrap()
      .push('4')
      .unwrap()
      .push('5')
      .unwrap()
      .print();
    expect(stack.pop().unwrap()).toEqual('5');
    expect(stack.pop().unwrap()).toEqual('4');
    expect(stack.pop().unwrap()).toEqual('3');
    expect(stack.pop().unwrap()).toEqual('2');
    expect(stack.pop().unwrap()).toEqual('1');
  });
});
