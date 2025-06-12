const combineReducers = (slices) => (state, action) => {
  return Object.keys(slices).reduce((acc, prop) => {
    return {
      ...acc,
      ...slices[prop](acc, action),
    };
  }, state);
};

export default combineReducers;
