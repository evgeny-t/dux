<a name="module_dux"></a>

## dux

* [dux](#module_dux)
    * [.update](#module_dux.update) : <code>function</code>
    * [.combine([reducers])](#module_dux.combine)
    * [.dux(options)](#module_dux.dux)
    * [.createStore()](#module_dux.createStore)

<a name="module_dux.update"></a>

### dux.update : <code>function</code>
Object immutability helper.
See [update-js](https://github.com/akuzko/update-js).

**Kind**: static constant of [<code>dux</code>](#module_dux)  
<a name="module_dux.combine"></a>

### dux.combine([reducers])
Combines an array of reducers into one.
If reducer doesn't modify the state it should return its first
argument. In the case nothing is passed, the resulting
 reducer will be an identity function.

**Kind**: static method of [<code>dux</code>](#module_dux)  

| Param | Type | Description |
| --- | --- | --- |
| [reducers] | <code>Array.&lt;function()&gt;</code> | Reducers to combine into one. |

<a name="module_dux.dux"></a>

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
