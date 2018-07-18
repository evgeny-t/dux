/* globals
  describe
  it
  expect
*/

import { combine, dux, createStore } from './index';

describe('combine', () => {
  it('should return identity function if nothing is passed', () => {
    const R = combine();
    const foo = {};
    expect(R(foo)).toBe(foo);
  });

  it('should combine two reducers', () => {
    const R = combine(
      state => ({ ...state, first: 1 }),
      state => ({ ...state, second: 2 })
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
        c
      })
    });

    expect(reducer({ qwe: 'erty' }, foobar(1, 2, '3'))).toEqual({
      qwe: 'erty',
      a: 1,
      b: 2,
      c: '3'
    });
    expect(reducer({ qwe: 'erty' }, { type: 'whatever' })).toEqual({
      qwe: 'erty'
    });
  });
});

test('should pass only slice related to module', () => {
  const store = createStore(s => s);
  const a = dux(
    { foo: (state, value) => ({ ...state, value }) },
    { root: state => state }
  );

  a.foo('foobar');

  expect(store.getState()).not.toHaveProperty('value');
  expect(a.selectors.root(store.getState())).toEqual({
    value: 'foobar'
  });
});

test('should be possible to use another dux selectors', () => {
  const store = createStore(s => s);
  const a = dux(
    { baz: (state, value) => ({ ...state, value }) },
    { root: state => state }
  );
  const b = dux(
    {
      bar: slice => state => {
        return { ...slice, value: '123' + a.selectors.root(state).value };
      }
      // bar: slice =>
      //   bindSelectors(a.selectors, a => {
      //     return { ...slice, value: a.root.value };
      //   })
    },
    { root: state => state }
  );

  a.baz('bazbaz');
  b.bar();

  expect(b.selectors.root(store.getState()).value).toBe('123bazbaz');
});
