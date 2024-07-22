import { createPageMetadata, Divide } from './pagination';
import { DataType } from './types';
import { ArrayGroupBy, ArrayIsSubset, ArrayWildCard } from './types/Array';
import {
  ObjectPickProperties,
  ObjectPropertyAddPrefix,
  ObjectPropertyUnset,
  ObjectStringify,
} from './types/Object';

describe('ObjectStringify', () => {
  it('works', () => {
    expect(
      ObjectStringify({ strX: 'string', boolY: false, numZ: 12, zero: 0 }),
    ).toBe(`strX=string, boolY=false, numZ=12, zero=0`);
  });
  it('works', () => {
    expect(
      ObjectStringify(
        { strX: 'string', boolY: false, numZ: 12, zero: 0 },
        { betweenKvs: ':>' },
      ),
    ).toBe(`strX:>string, boolY:>false, numZ:>12, zero:>0`);
  });
});

describe('CheckDataType', () => {
  it('checks null', () => {
    expect(DataType(null)).toBe('$$NIL');
  });
  it('checks undefined', () => {
    expect(DataType(undefined)).toBe('$$NIL');
  });
  it('checks empty array', () => {
    expect(DataType([])).toBe('$$EMPTY_ARRAY');
  });
  it('checks empty object', () => {
    expect(DataType({})).toBe('$$EMPTY_OBJECT');
  });
  it('works', () => {
    expect(DataType({ a: 'b' })).toBe('$$OBJECT');
  });
});

describe('Divide', () => {
  it('works', () => {
    expect(Divide(5, 2)).toEqual([2, 1]);
  });
  it('works', () => {
    expect(Divide(5, 5)).toEqual([1, 0]);
  });
  it('works', () => {
    expect(Divide(3, 10)).toEqual([0, 3]);
  });
});

describe('createPageMetadata', () => {
  it('works', () => {
    expect(
      createPageMetadata(
        [
          { a: 1, b: 2 },
          { a: 1, b: 2 },
          { a: 1, b: 2 },
          { a: 1, b: 2 },
        ],
        1,
        1,
      ),
    ).toEqual({
      current_page: 1,
      is_last_page: false,
      page_capacity: 1,
      page_item_num: 1,
      total_items: 4,
      total_pages: 4,
    });
  });
  it('works', () => {
    expect(
      createPageMetadata(
        [
          { a: 1, b: 2 },
          { a: 1, b: 2 },
          { a: 1, b: 2 },
          { a: 1, b: 2 },
        ],
        10,
        1,
      ),
    ).toEqual({
      current_page: 1,
      is_last_page: true,
      page_capacity: 10,
      page_item_num: 4,
      total_items: 4,
      total_pages: 1,
    });
  });
  it('works', () => {
    try {
      createPageMetadata(
        [
          { a: 1, b: 2 },
          { a: 1, b: 2 },
          { a: 1, b: 2 },
          { a: 1, b: 2 },
        ],
        10,
        10,
      );
    } catch (error) {
      expect(error.message).toBeDefined();
    }
  });
});

describe('ArrayGroupBy', () => {
  it('works', () => {
    expect(
      ArrayGroupBy(
        [
          { a: 1, b: 2 },
          { a: 1, b: 2 },
          { a: 22, b: 2 },
        ],
        (x) => x.a,
      ),
    ).toEqual({
      1: [
        { a: 1, b: 2 },
        { a: 1, b: 2 },
      ],
      22: [{ a: 22, b: 2 }],
    });
  });

  it('works', () => {
    expect(
      ArrayGroupBy(
        [
          { a: 1, b: 2 },
          { a: 1, b: 2 },
          { a: 22, b: 2 },
        ],
        (v) => (v.a % 2 ? 'odd' : 'even'),
      ),
    ).toEqual({
      even: [{ a: 22, b: 2 }],
      odd: [
        { a: 1, b: 2 },
        { a: 1, b: 2 },
      ],
    });
  });

  it('works', () => {
    expect(
      ArrayGroupBy(
        [
          { a: 1, b: 2 },
          { a: 1, b: 2 },
          { a: 22, b: 2 },
        ],
        (v) => (v.a % 2 ? 'odd' : 'even'),
      ),
    ).toEqual({
      even: [{ a: 22, b: 2 }],
      odd: [
        { a: 1, b: 2 },
        { a: 1, b: 2 },
      ],
    });
  });
});

describe('ArrayIsSubset', () => {
  it('works', () => {
    const long = [1, 2, 3];
    const short = [2, 3];
    expect(ArrayIsSubset(short, long, 'loose')).toBe(true);
  });
  it('works', () => {
    const long = [1, 2, 3];
    const short = [2, 3, 5];
    expect(ArrayIsSubset(short, long, 'strict')).toBe(false);
  });
  it('works', () => {
    const short = ['create', 'x'];
    const long = ['create', 'update'];
    expect(ArrayIsSubset(short, long, 'strict')).toBe(false);
  });
});

describe('ArrayWildCard', () => {
  it('works', () => {
    expect(ArrayWildCard(/Many$/, ['findOne', 'findMany', 'getMany'])).toEqual([
      'findMany',
      'getMany',
    ]);
  });
});

describe('ObjectPickProperties', () => {
  it('works', () => {
    expect(ObjectPickProperties({ a: 1, b: 2 }, ['a'])).toEqual({ a: 1 });
  });
  it('works', () => {
    expect(() => ObjectPickProperties({ a: 1, b: 2, c: 3 }, ['d'])).toThrow(
      Error,
    );
  });
  it('works', () => {
    const s = { a: 1, b: 2, c: [1, 2] };
    const res = ObjectPickProperties(s, ['a', 'c']);
    s.c = [56];
    expect(res).toEqual({
      a: 1,
      c: [1, 2],
    });
  });
});

describe('ObjectPropertyAddPrefix', () => {
  it('works', () => {
    expect(ObjectPropertyAddPrefix({ a: 1, b: 2 }, 'ok_')).toEqual({
      ok_a: 1,
      ok_b: 2,
    });
  });
});

describe('ObjectPropertyUnset', () => {
  it('works', () => {
    expect(ObjectPropertyUnset({ a: 1, b: 2 }, ['b'])).toEqual({ a: 1 });
  });
  it('works', () => {
    expect(ObjectPropertyUnset({ a: 1, b: 2 }, ['k'])).toEqual({
      a: 1,
      b: 2,
    });
  });
});
