export const splitPnrActions = {
  INIT_APP: 'INIT_APP',
  UPDATE_SELECTED_PASSENGERS: 'UPDATE_SELECTED_PASSENGERS',
  SET_TOAST: 'SET_TOAST',
  SET_POPUP: 'SET_POPUP',
  SET_SPLIT_PNRS: 'SET_SPLIT_PNRS',
  GET_DETAIL: 'SPLIT_PNR_GET_DETAIL',
  SHOW_LOADER: 'SHOW_LOADER',
};

export const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case splitPnrActions.INIT_APP: {
      return {
        ...state,
        isLoading: false,
        main: payload?.main,
        additional: payload?.additional,
        api: payload?.api,
      };
    }

    case splitPnrActions.UPDATE_SELECTED_PASSENGERS: {
      return {
        ...state,
        selectedPassengersList: payload,
      };
    }

    case splitPnrActions.SET_TOAST: {
      return {
        ...state,
        toast: payload,
      };
    }

    case splitPnrActions.SET_POPUP: {
      return {
        ...state,
        popUp: payload,
      };
    }

    case splitPnrActions.SET_SPLIT_PNRS: {
      return {
        ...state,
        splitPnrs: payload,
      };
    }

    case splitPnrActions.GET_DETAIL: {
      return {
        ...state,
        splitPnrDetailResponse: payload.detail,
      };
    }
    case splitPnrActions.SHOW_LOADER: {
      return {
        ...state,
        isLoading: payload,
      };
    }

    default:
      return state;
  }
};
