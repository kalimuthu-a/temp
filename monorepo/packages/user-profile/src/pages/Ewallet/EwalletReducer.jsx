export const ewalletActions = {
  SET_TOAST: 'SET_TOAST',
  SHOW_LOADER: 'SHOW_LOADER',
  RELOAD_DATA: 'RELOAD_DATA',
  SET_FILTER: 'SET_FILTER',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  REMOVE_TRANSACTION: 'REMOVE_TRANSACTION',
};

export const ewalletReducer = (state, action) => {
  const { payload, type } = action;

  switch (type) {
    case ewalletActions.SET_TOAST:
      return {
        ...state,
        toast: payload,
        loading: false,
      };

    case ewalletActions.SHOW_LOADER:
      return {
        ...state,
        loading: payload,
      };

    case ewalletActions.RELOAD_DATA:
      return {
        ...state,
        transactions: payload.transactions,
        loading: false,
      };

    case ewalletActions.SET_FILTER:
      return {
        ...state,
        filter: payload,
      };

    case ewalletActions.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [...state.transactions, payload],
      };

    case ewalletActions.REMOVE_TRANSACTION: {
      const { transactionId } = payload;
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== transactionId,
        ),
      };
    }

    default:
      return state;
  }
};
