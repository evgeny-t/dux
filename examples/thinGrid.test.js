/* globals
  expect,
  test
 */
import { createStore } from '../src';
import { ThinGrid } from './thinGrid';

test('thin grid', () => {
  const store = createStore(s => s);
  const grid = ThinGrid();
  grid.setRows([{ a: 1 }, { b: 2 }], 1000);
  expect(grid.selectors.rows(store.getState())).toEqual([{ a: 1 }, { b: 2 }]);
  expect(grid.selectors.total(store.getState())).toEqual(1000);
});
