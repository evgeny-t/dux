/* globals
  expect,
  test
 */
import { createStore } from '../src';

import { dux, update } from '../src';

// dux(dux(), dux())(actions, selectors)

const A = dux({ setA: (state, a) => update(state, { a }) });
const B = dux({ setB: (state, b) => update(state, { b }) });

const X = (A, B) => {
  A = X.mount(A);
  B = X.mount(B);
  const x = dux(
    {
      setX: state => {
        // take a from A
        // take b from B
        let a = A.a;
        let b = B.b;

        return update(state, { x: `${a}-${b}` });
      }
    },
    {
      x: state => state.x
    }
  );
  return x;
};

test('toy example', () => {
  const store = createStore(s => s);
  const x = X();
  expect(x.setX).toBeInstanceOf(Function);
  expect(x.setA).toBeInstanceOf(Function);
  expect(x.setB).toBeInstanceOf(Function);

  x.setA('foo');
  x.setB('bar');
  x.setX();
  expect(x.selectors.x(store.getState())).toEqual('foo-bar');
});
