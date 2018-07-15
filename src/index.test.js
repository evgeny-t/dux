/* globals
  describe
  it
  expect
*/

import { combine, dux } from './index';

describe('combine', () => {
  it('should return identity function if nothing is passed', () => {
    const R = combine();
    const foo = {};
    expect(R(foo)).toBe(foo);
  });

  it('should combine two reducers', () => {
    const R = combine(
      state => ({ ...state, first: 1 }),
      state => ({ ...state, second: 2 }),
    );
    const foo = { foo: 42 };
    expect(R(foo)).toEqual({ foo: 42, first: 1 });
  });
});

describe.skip('dux', () => {
  it('should create an action creator and reducer', () => {
    const { foobar, reducer } = dux({
      foobar: (state, a, b, c) => ({
        ...state,
        a,
        b,
        c,
      }),
    });

    expect(reducer({ qwe: 'erty' }, foobar(1, 2, '3')))
      .toEqual({
        qwe: 'erty',
        a: 1,
        b: 2,
        c: '3',
      });
    expect(reducer({ qwe: 'erty' }, { type: 'whatever' }))
      .toEqual({
        qwe: 'erty',
      });
  });
});
