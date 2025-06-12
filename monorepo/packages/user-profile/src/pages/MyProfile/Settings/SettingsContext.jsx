import React, { createContext, useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';
import { settingsReducer } from './SettingsReducer';
import { MEMBER } from '../../../constants/common';

const initialState = {
  showPopup: false,
  settingsAemData: {},
  userType: MEMBER,
};

export const SettingsContext = createContext(initialState);

export const SettingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  const value = useMemo(
    () => ({ state, dispatch }),
    [state],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

SettingsProvider.propTypes = {
  children: PropTypes.element,
};

export default SettingsContext;
