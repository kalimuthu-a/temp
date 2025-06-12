import { useState, useMemo, useContext, createContext } from 'react';
import PropTypes from 'prop-types';

const defaultState = {};
const FareSummaryContext = createContext(defaultState);

export const FareSummaryContextProvider = ({ children }) => {
  const [fareSummaryData, setFareSummaryData] = useState(null);
  const [feeCodeMapping, setFeeCodeMapping] = useState(null);
  const [ssrCodeMapping, setSsrCodeMapping] = useState(null);
  const [aemData, setAEMData] = useState(null);
  const [pageType, setPageType] = useState()
  const updateFareSummaryData = (apiData) => {
    setFareSummaryData(apiData);
  };

  const updateFeeCodeMapping = (apiData) => {
    setFeeCodeMapping(apiData);
  };
  const updateSsrCodeMapping = (apiData) => {
    setSsrCodeMapping(apiData);
  };

  const updateAEMData = (aemGraphqlData) => {
    setAEMData(aemGraphqlData);
  };

  const updatePageType = (type) => {    
    setPageType(type);
  }
  const storeData = useMemo(
    () => ({
      fareSummaryData,
      feeCodeMapping,
      aemData,
      ssrCodeMapping,
      pageType,
      updateFareSummaryData,
      updateFeeCodeMapping,
      updateAEMData,
      updateSsrCodeMapping,
      updatePageType,
    }),
    [
      fareSummaryData,
      feeCodeMapping,
      aemData,
      ssrCodeMapping,
      pageType,
      updateFareSummaryData,
      updateFeeCodeMapping,
      updateAEMData,
      updateSsrCodeMapping,
      updatePageType,
    ],
  );

  return (
    <FareSummaryContext.Provider value={storeData}>
      {children}
    </FareSummaryContext.Provider>
  );
};
export function useFareSummaryContext() {
  const context = useContext(FareSummaryContext);
  if (context === undefined) {
    throw new Error('FareSummaryContext is used outside the context provider');
  }
  return context;
}

FareSummaryContextProvider.propTypes = {
  children: PropTypes.any,
};
export default FareSummaryContext;
