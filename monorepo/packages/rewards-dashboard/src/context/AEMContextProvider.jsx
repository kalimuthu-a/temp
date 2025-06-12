import React, { useState, useMemo, useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { formattedMessage } from 'skyplus-design-system-app/dist/des-system/utils';

const defaultState = {};
const AEMContext = createContext(defaultState);

export const AEMContextProvider = ({ children }) => {
  const [aemData, setAEMData] = useState(null);

  const aemLabel = (key, defaultValue = '') => {
    return get(aemData, key, defaultValue);
  };

  const formattedAEMLabel = (key, obj) => {
    const aemString = aemLabel(key);
    return formattedMessage(aemString, obj);
  };

  const value = useMemo(
    () => ({
      aemData,
      setAEMData,
      aemLabel,
      formattedAEMLabel,
    }),
    [aemData],
  );

  return <AEMContext.Provider value={value}>{children}</AEMContext.Provider>;
};
export function useAEMContext() {
  return useContext(AEMContext);
}

AEMContextProvider.propTypes = {
  children: PropTypes.any,
};
export default AEMContext;
