# Dux for Redux

$ npm i --save redux-dux

This is a tiny utility for creating Redux modules.

## Example

```
import { createStore } from 'redux'
import { dux } from 'redux-dux'


let { reducer, set, inc, dec } = dux({
  set: (state, val) => Object.assign({}, state, { foo: val }),
  inc: (state) => Object.assign({}, state, { foo: state.foo + 1 }),
  dec: (state) => Object.assign({}, state, { foo: state.foo - 1 }),
})

let store = createStore(reducer, {});

store.dispatch(set(1337))
console.log(store.getState())

store.dispatch(inc())
console.log(store.getState())

store.dispatch(dec())
console.log(store.getState())

/* outputs: 
{ foo: 1337 }
{ foo: 1338 }
{ foo: 1337 }
*/
```

## Functions

<dl>
<dt><a href="#combine">combine([reducers])</a></dt>
<dd><p>Combines an array of reducers into one.
If reducer doesn&#39;t modify the state it should return its first
argument. In the case nothing is passed, the resulting
 reducer will be an identity function.</p>
</dd>
<dt><a href="#dux">dux(options)</a></dt>
<dd><p>Creates a Redux module.</p>
</dd>
</dl>

<a name="combine"></a>

## combine([reducers])
Combines an array of reducers into one.
If reducer doesn't modify the state it should return its first
argument. In the case nothing is passed, the resulting
 reducer will be an identity function.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [reducers] | <code>Array.&lt;function()&gt;</code> | Reducers to combine into one. |

<a name="dux"></a>

## dux(options)
Creates a Redux module.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | set of key-value pairs, where key is an action  creator name and value is a reducer function. The reducer functions differs  from conventional reducer in a way treats arguments: (state, ...args).  Everything passed to the action creator will spread  after first reducer's argument. |

