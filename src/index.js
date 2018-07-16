import * as redux from 'redux';
import snakeCase from 'lodash.snakecase';
import set from 'lodash.set';
import reduce from 'lodash.reduce';
import map from 'lodash.map';
import get from 'lodash.get';
import upd from 'update-js';

let store;
let reducers = [];
let combinedReducer = s => s;

function duxReducer(...args) {
  return combinedReducer(...args);
}

/**
 * Combines an array of reducers into one.
 * If reducer doesn't modify the state it should return its first
 * argument. In the case nothing is passed, the resulting
 *  reducer will be an identity function.
 * @param {Function[]} [reducers] - Reducers to combine into one.
 */
export function combine(...reducers) {
  return (state, action) => {
    for (let i = 0; i < reducers.length; i += 1) {
      const newState = reducers[i](state, action);
      if (newState && newState !== state) {
        return newState;
      }
    }
    return state;
  };
}

function sdbm(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
  }
  hash = hash >>> 0;
  return hash.toString(16);
}

// TODO(ET): deep-freeze slice in dev mode
/**
 * Creates a Redux module.
 * @param {Object} options - set of key-value pairs, where key is an action
 *  creator name and value is a reducer function. The reducer functions differs
 *  from conventional reducer in a way treats arguments: (state, ...args).
 *  Everything passed to the action creator will spread
 *  after first reducer's argument.
 */
export function dux(options, selectors) {
  return (...childrenDux) => {
    const rootSlicer = state => state;
    const hash = sdbm(reduce(options, (acc, __, key) => acc + key, ''));
    const nameToType = key => hash + '/' + snakeCase(key).toUpperCase();
    const slicer = state => get(rootSlicer(state), hash);

    const createReducer = (reduceFn, key) => {
      const actionType = nameToType(key);
      return (state, { type, args }) => {
        if (type !== actionType) return state;
        const slice = slicer(state);
        // bug: result of reduceFn is set back to state[hash] instead of slicer
        return update(state, hash, reduceFn(slice, ...args));
      };
    };

    const createAction = key => (...args) =>
      store.dispatch({
        type: nameToType(key),
        args
      });

    const createSelector = fn => state => fn(slicer(state));

    let self = {
      ...reduce(
        options,
        (acc, val, key) => set(acc, key, createAction(key)),
        {}
      ),
      selectors: reduce(
        selectors,
        (acc, val, key) => set(acc, key, createSelector(val)),
        {}
      )
    };

    reducers.push(combine(...map(options, createReducer)));
    combinedReducer = combine(...reducers);
    return self;
  };
}

export function createStore(reducer, preloadedState, enhancers) {
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  reducers.push(reducer);
  combinedReducer = combine(...reducers);
  return (store = redux.createStore(duxReducer, preloadedState, enhancers));
}

export const update = upd;
