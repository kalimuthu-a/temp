import Nominee from './Models/Nominee';
import { isNomineeValid } from './nomineeUtils';

export const nomieeActions = {
  SET_TOAST: 'SET_TOAST',
  INIT: 'INIT',
  UPDATE_FORM: 'UPDATE_FORM',
  ADD_NOMINEE: 'ADD_NOMINEE',
  SET_SELECTED_INDEX: 'SET_SELECTED_INDEX',
  SAVE_NOMINEE: 'SAVE_NOMINEE',
  SHOW_LOADER: 'SHOW_LOADER',
  DELETE_NOMINEE: 'DELETE_NOMINEE',
  RELOAD_DATA: 'RELOAD_DATA',
};

export const nomineeReducer = (state, action) => {
  const { payload, type } = action;

  switch (type) {
    case nomieeActions.SET_TOAST:
      return {
        ...state,
        toast: payload,
        loading: false,
      };

    case nomieeActions.INIT: {
      const { maxNominee } = state;
      const { api } = payload;
      const { nominees = [] } = api;

      return {
        ...state,
        ...payload.api,
        loading: false,
        nominees,
        ...(nominees.length === 0 && {
          nominees: [new Nominee({ isNew: true })],
          showFooter: true,
          initalActiveIndexes: [0],
        }),
        disableAdd: maxNominee <= nominees.length,
      };
    }

    case nomieeActions.SET_SELECTED_INDEX: {
      const { initalActiveIndexes, nominees } = state;
      const prevSelected = initalActiveIndexes[0];

      const newNominessIndexes = [];

      nominees.forEach((nominee, index) => {
        if (nominee.isNew) {
          newNominessIndexes.push(index);
        }
      });

      return {
        ...state,
        initalActiveIndexes:
          payload === prevSelected
            ? [...newNominessIndexes]
            : [payload, ...newNominessIndexes],
      };
    }

    case nomieeActions.SHOW_LOADER: {
      return {
        ...state,
        loading: payload,
      };
    }

    case nomieeActions.UPDATE_FORM: {
      const { nominees } = state;
      const { index, key, value } = payload;

      const nomineeNewValue = { ...nominees[index], [key]: value };
      const nominee = new Nominee({
        ...nomineeNewValue,
        ...isNomineeValid(nomineeNewValue),
      });

      console.log({ nominee });

      return {
        ...state,
        nominees: [
          ...nominees.slice(0, index),
          nominee,
          ...nominees.slice(index + 1),
        ],
      };
    }

    case nomieeActions.ADD_NOMINEE: {
      const { maxNominee } = state;
      return {
        ...state,
        nominees: state.nominees.concat(new Nominee({ isNew: true })),
        selectedNomineeIndex: state.nominees.length,
        disableAdd: maxNominee <= state.nominees.length + 1,
        showFooter: true,
        initalActiveIndexes: [
          ...state.initalActiveIndexes,
          state.nominees.length,
        ],
      };
    }

    case nomieeActions.SAVE_NOMINEE: {
      return {
        ...state,
        loading: true,
      };
    }

    case nomieeActions.DELETE_NOMINEE: {
      const { nominees } = state;
      const { index } = payload;

      return {
        ...state,
        nominees: [...nominees.slice(0, index), ...nominees.slice(index + 1)],
        disableAdd: false,
      };
    }

    case nomieeActions.RELOAD_DATA: {
      const { maxNominee } = state;
      const { nominees = [] } = payload;

      return {
        ...state,
        ...payload,
        loading: false,
        disableAdd: maxNominee <= nominees.length,
        nominees:
          nominees.length > 0 ? nominees : [new Nominee({ isNew: true })],
        showFooter: nominees.length === 0,
        initalActiveIndexes: nominees.length > 0 ? [] : [0],
      };
    }

    default:
      return state;
  }
};
