export const corpConnectActions = {
  SET_CORP_CONNECT: 'SET_CORP_CONNECT',
  SET_CORP_CONNECT_AEM_DATA: 'SET_CORP_CONNECT_AEM_DATA',
  SET_LOADER: 'SET_LOADER',
  SET_VALUE: 'SET_VALUE',
  SET_COUNTRY_LIST: 'SET_COUNTRY_LIST',
};

export const corpConnectReducer = (state, action) => {
  const { payload, type } = action;

  switch (type) {
    case corpConnectActions.SET_CORP_CONNECT: {
      return {
        ...state,
        corpConnectData: payload,
      };
    }

    case corpConnectActions.SET_CORP_CONNECT_AEM_DATA: {
      return {
        ...state,
        corpConnectAemData: payload,
      };
    }

    case corpConnectActions.SET_LOADER: {
      return {
        ...state,
        loader: payload,
      };
    }

    case corpConnectActions.SET_VALUE: {
      return {
        ...state,
        corpConnectData: {
          ...state.corpConnectData,
          [payload.key]: payload.value,
        },
      };
    }

    case corpConnectActions.SET_COUNTRY_LIST: {
      return {
        ...state,
        countryList: payload,
      };
    }

    default:
      return state;
  }
};
