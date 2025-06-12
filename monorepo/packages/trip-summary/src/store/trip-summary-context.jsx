import { useState, useMemo, useContext, createContext } from 'react';
import PropTypes from 'prop-types';

const defaultState = {};
const TripSummaryContext = createContext(defaultState);

export const TripSummaryContextProvider = ({ children }) => {
  const [tripSummaryData, setTripSummaryData] = useState(null);
  const [aemData, setAemData] = useState(null);
  const [aemAdditionalData, setAemAdditionalData] = useState(null);
  const [ssrCodeMapping, setSsrCodeMapping] = useState(null);

  const updateTripSummaryData = (apiData) => {
    setTripSummaryData(apiData);
  };

  const updateAemData = (aem) => {
    setAemData(aem);
  };

  const updateAemAdditionalData = (aemAdditional) => {
    setAemAdditionalData(aemAdditional);
  };
  const updateSsrCodeMapping = (apiData) => {
    setSsrCodeMapping(apiData);
  };

  const storeData = useMemo(
    () => ({
      tripSummaryData,
      aemData,
      aemAdditionalData,
      ssrCodeMapping,
      updateTripSummaryData,
      updateAemData,
      updateAemAdditionalData,
      updateSsrCodeMapping,
    }),
    [
      tripSummaryData,
      aemData,
      aemAdditionalData,
      ssrCodeMapping,
      updateTripSummaryData,
      updateAemData,
      updateAemAdditionalData,
      updateSsrCodeMapping,
    ],
  );

  return (
    <TripSummaryContext.Provider value={storeData}>
      {children}
    </TripSummaryContext.Provider>
  );
};
export function useTripSummaryContext() {
  const context = useContext(TripSummaryContext);
  if (context === undefined) {
    throw new Error('TripSummaryContext is used outside the context provider');
  }
  return context;
}

TripSummaryContextProvider.propTypes = {
  children: PropTypes.any,
};
export default TripSummaryContext;
