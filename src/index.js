import snakeCase from 'lodash.snakecase';
import set from 'lodash.set';
import reduce from 'lodash.reduce';
import map from 'lodash.map';

export const combine = (...reducers) => (state, action) => {
  for (let i = 0; i < reducers.length; i += 1) {
    const newState = reducers[i](state, action);
    if (newState !== undefined && newState !== state) {
      return newState;
    }
  }
  return state;
};

export const dux = (options) => {
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
};
