/* globals
  expect,
  test
 */
import { createStore } from '../src';

import { dux, update } from '../src';

const X = (A, B) => {
  const x = dux(
    {
      setX: state => {
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

test.skip('toy example', () => {
  const store = createStore(s => s);
  const A = dux(
    { setA: (state, a) => update(state, { a }) },
    { a: state => state.a }
  );
  const B = dux(
    { setB: (state, b) => update(state, { b }) },
    { b: state => state.b }
  );

  const x = X(A, B);
  expect(x.setX).toBeInstanceOf(Function);

  A.setA('foo');
  B.setB('bar');
  x.setX();
  expect(x.x).toEqual('foo-bar');
});
