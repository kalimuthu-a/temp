import React, { createContext, useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';
import { myGSTDetailsReducer } from './MyGSTDetailsReducer';
import { AGENT } from '../../../constants/common';

const initialState = {
  profileData: {},
  originalProfileData: {},
  myGSTDetailsAemData: {},
  isOpenedSidebar: false,
  isOpenedEditSidebar: false,
  selectedCard: null,
  isRemoveGSTModalOpened: false,
  userType: AGENT,
  isButtonDisabled: false,
  mode: null,
  formData: {},
  toast: {
    show: false,
    description: '',
    variation: null,
  },
};

const MyGSTDetailsContext = createContext(initialState);

export const MyGSTDetailsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(myGSTDetailsReducer, initialState);

  const value = useMemo(
    () => ({ state, dispatch }),
    [state],
  );

  return (
    <MyGSTDetailsContext.Provider value={value}>
      {children}
    </MyGSTDetailsContext.Provider>
  );
};

MyGSTDetailsProvider.propTypes = {
  children: PropTypes.element,
};

export default MyGSTDetailsContext;
