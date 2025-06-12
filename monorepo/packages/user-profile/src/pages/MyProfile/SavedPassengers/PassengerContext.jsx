// PassengerContext.js
import React, { createContext, useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';
import { passengerReducer } from './PassengerReducer'; // Correct path
import { MEMBER } from '../../../constants/common';

const initialState = {
  profileData: {},
  countryList: [],
  originalProfileData: {},
  userType: MEMBER,
  isOpened: false,
  isOpenedSidebar: false,
  selectedCard: null,
  error: {},
  savedPassengerAemData: {},
  isButtonDisabled: false,
  searchTerm: '',
  filteredCards: [],
  showStateAndNationality: true,
  showPassportDetails: true,
  showGSTDetails: true,
  mode: null,
  formData: {},
  showToast: false,
  toastText: '',
  isRemoveMode: false,
  dataVersion: 0,
};

export const PassengerContext = createContext(initialState);

export const PassengerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(passengerReducer, initialState);

  const value = useMemo(
    () => ({ state, dispatch }),
    [state],
  );

  return (
    <PassengerContext.Provider value={value}>
      {children}
    </PassengerContext.Provider>
  );
};

PassengerProvider.propTypes = {
  children: PropTypes.element,
};

export default PassengerContext;
