import { dux, update } from '../src';
import { ThinGrid } from './thinGrid';

const Pager = (dg, pagesize) =>
  dux(
    {
      first: state => {
        return update(state, { page: 0 });
      },
      last: state => {
        const total = dg.selectors.total(state);
        return update(state, {
          page: Math.floor(total / pagesize)
        });
      },
      previous: state => {
        return update(state, { page: state.page - 1 });
      },
      next: state => {
        return update(state, { page: state.page + 1 });
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
    .extend(grid)
    .extend(filter)
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
