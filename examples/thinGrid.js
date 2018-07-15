import { dux, update } from '../src';

export const ThinGrid = () =>
  dux(
    {
      setRows: (state, rows, total) => {
        return update(state, {
          rows,
          total
        });
      },
      selectRow: (state, index) => {
        return update(state, {
          selected: state.rows[index]
        });
      }
    },
    {
      rows: state => state.rows,
      total: state => state.total,
      selected: state => state.selected
    }
  );
