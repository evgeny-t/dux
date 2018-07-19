import { dux, update } from '../src';
import { ThinGrid } from './thinGrid';

const Pager = (dg, pagesize) =>
  dux(
    {
      first: slice => {
        return update(slice, { page: 0 });
      },
      last: slice => state => {
        const total = dg.selectors.total(state);
        return update(slice, {
          page: Math.floor(total / pagesize)
        });
      },
      previous: slice => {
        return update(slice, { page: slice.page - 1 });
      },
      next: slice => {
        return update(slice, { page: slice.page + 1 });
      }
    },
    {
      page: state => state.page
    }
  );

const Filter = () =>
  dux(
    {
      setFilter(state, filter) {
        return update(state, { filter });
      }
    },
    {
      filter: state => state.filter
    }
  );

export const ThickGrid = () => {
  const grid = ThinGrid();
  const filter = Filter();
  const page = Pager(grid, 50);
  return page
    .extend(grid, grid.selectors)
    .extend(filter, filter.selectors)
    .extend(
      {},
      {
        query: state => ({
          filter: filter.selectors.filter(state),
          page: page.selectors.page(state)
        })
      }
    );
};
