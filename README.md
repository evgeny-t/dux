# Dux for Redux

```
npm i --save redux-dux
```

This is a tiny utility for creating Redux modules.

## Example

```
import { createStore, dux, update } from 'redux-dux';

const store = createStore(s => s);

const grid = dux(
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

grid.setRows([{ a: 1 }, { b: 2 }], 1000);
console.log(grid.selectors.rows(store.getState())) // [{ a: 1 }, { b: 2 }]

```

* [dux](#module_dux)
    * [.update](#module_dux.update) : <code>function</code>
    * [.dux(options)](#module_dux.dux)
    * [.createStore()](#module_dux.createStore)

<a name="module_dux.update"></a>

### dux.update : <code>function</code>
Object immutability helper.
See [update-js](https://github.com/akuzko/update-js).

**Kind**: static constant of [<code>dux</code>](#module_dux)
<a name="module_dux.combine"></a>

### dux.dux(options)
Creates a Redux module.

**Kind**: static method of [<code>dux</code>](#module_dux)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | set of key-value pairs, where key is an action  creator name and value is a reducer function. The reducer function receives a slice of the state, corresponding to the module, and arguments passed to the action creator: (slice, ...args). The reducer function can return either a new slice or a function which receives the whole state and returns a new slice. |

<a name="module_dux.createStore"></a>

### dux.createStore()
Creates Redux store.
See [createStore.md](https://github.com/reduxjs/redux/blob/master/docs/api/createStore.md).

**Kind**: static method of [<code>dux</code>](#module_dux)
