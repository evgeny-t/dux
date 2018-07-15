/* globals
  expect,
  test
 */
import { createStore } from '../src';

import { dux, update } from '../src';

const A = () => dux({ setA: (state, a) => update(state, { a }) });
const B = () => dux({ setB: (state, b) => update(state, { b }) });
const X = () => {
  return dux(
    {
      setX: state => {
        // take a from A
        // take b from B
        let a;
        let b;
        return update(state, { x: `${a}-${b}` });
      }
    },
    {
      x: state => state.x
    }
  );
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
