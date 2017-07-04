import snakeCase from 'lodash.snakecase';
import set from 'lodash.set';
import reduce from 'lodash.reduce';
import map from 'lodash.map';

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

/**
 * Creates a Redux module.
 * @param {Object} options - set of key-value pairs, where key is an action
 *  creator name and value is a reducer function. The reducer functions differs
 *  from conventional reducer in a way treats arguments: (state, ...args).
 *  Everything passed to the action creator will spread
 *  after first reducer's argument.
 */
export function dux(options) {
  return {
    ...reduce(options, (acc, val, key) =>
      set(acc, key, (...args) => ({
        type: snakeCase(key).toUpperCase(),
        args,
      })), {}),
    reducer: combine(
      ...map(options, (val, key) =>
        (state, { type, args }) =>
          type === snakeCase(key).toUpperCase() ? val(state, ...args) : state)),
  };
}
