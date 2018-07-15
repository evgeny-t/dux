/* globals
  expect,
  test
 */
import { createStore } from '../src';
import { ThickGrid } from './thickGrid';

test('thick grid', () => {
  const store = createStore(s => s);
  const grid = ThickGrid();
  grid.setRows([{ a: 1 }, { b: 2 }], 1000);
  expect(grid.selectors.rows(store.getState())).toEqual([{ a: 1 }, { b: 2 }]);
  expect(grid.selectors.total(store.getState())).toEqual(1000);

  grid.setFilter([{ field: '', value: '' }]);
  grid.first();

  // TODO: selectors are inconsistent, in some cases,
  // the argument (state) is not necessary, in some it is.
  expect(grid.selectors.query(store.getState())).toEqual({
    filter: [{ field: '', value: '' }],
    page: 0
  });
});
