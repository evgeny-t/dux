import * as redux from 'redux';
import snakeCase from 'lodash.snakecase';
import set from 'lodash.set';
import reduce from 'lodash.reduce';
import map from 'lodash.map';
import get from 'lodash.get';
import assign from 'lodash.assign';
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

function hashKeys(o) {
  return sdbm(reduce(o, (acc, __, key) => acc + key, ''));
}

const createReducerCreator = (nameToActionType, sliceKey) => (
  reduceFn,
  key
) => {
  const actionType = nameToActionType(key);
  return (state, { type, args }) => {
    if (type !== actionType) return state;
    let slice = reduceFn(get(state, sliceKey), ...args);
    if (slice instanceof Function) {
      slice = slice(state);
    }
    return update(state, sliceKey, slice);
  };
};

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
  const hash = hashKeys(options);
  const nameToActionType = key => hash + '/' + snakeCase(key).toUpperCase();

  const createReducer = createReducerCreator(nameToActionType, hash);

  const createAction = key => (...args) =>
    store.dispatch({
      type: nameToActionType(key),
      args
    });

  const createSelector = fn => state => fn(get(state, hash));

  let self = reduce(
    options,
    (acc, val, key) => set(acc, key, createAction(key)),
    {}
  );
  self.selectors = reduce(
    selectors,
    (acc, val, key) => {
      const selector = createSelector(val);
      return set(acc, key, selector);
    },
    {}
  );
  self.extend = function(duck, selectors) {
    const { selectors: __, ...actions } = duck;
    assign(this, actions);
    assign(this.selectors, selectors);
    return this;
  };

  reducers.push(combine(...map(options, createReducer)));
  combinedReducer = combine(...reducers);
  return self;
}

export function bindSelectors(...args) {
  const selectorsArr = args.slice(0, args.length - 1);
  const cb = args[args.length - 1];
  return state => {
    const sliceGetters = selectorsArr.map(selectors => {
      return Object.defineProperties(
        {},
        reduce(
          selectors,
          (acc, selector, name) =>
            set(acc, name, { get: () => selector(state) }),
          {}
        )
      );
    });
    return cb(...sliceGetters);
  };
}

export function createStore(reducer, preloadedState, enhancers) {
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancers = preloadedState;
    preloadedState = undefined;
  }

  // TODO: what if createStore is called multiple times?
  reducers.push(reducer);
  combinedReducer = combine(...reducers);
  return (store = redux.createStore(duxReducer, preloadedState, enhancers));
}

export const update = upd;
