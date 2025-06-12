import { useState, useMemo, useContext, createContext } from 'react';
import PropTypes from 'prop-types';

const defaultState = {};
const CabBookingContext = createContext(defaultState);

export const CabBookingContextProvider = ({ children }) => {
  const [apiData, setApiData] = useState(null);
  const [aemData, setAemData] = useState(null);

  const updateApiData = (apiData) => {
    setApiData(apiData);
  };

  const updateAemData = (aem) => {
    setAemData(aem);
  };

  const storeData = useMemo(
    () => ({
      apiData,
      aemData,
      updateApiData,
      updateAemData,
    }),
    [
      apiData,
      aemData,
      updateApiData,
      updateAemData,
    ],
  );

  return (
    <CabBookingContext.Provider value={storeData}>
      {children}
    </CabBookingContext.Provider>
  );
};
export function useCabBookingContext() {
  const context = useContext(CabBookingContext);
  if (context === undefined) {
    throw new Error('CabBookingContext is used outside the context provider');
  }
  return context;
}

CabBookingContextProvider.propTypes = {
  children: PropTypes.any,
};
export default CabBookingContext;
