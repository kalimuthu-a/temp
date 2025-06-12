import { useState, useMemo, useContext, createContext } from 'react';
import PropTypes from 'prop-types';

const defaultState = {};
const ScratchCardContext = createContext(defaultState);

export const ScratchCardContextProvider = ({ children }) => {
  const [scratchCardApiData, setScratchCardApiData] = useState(null);
  const [aemData, setAemData] = useState(null);
  const [aemAdditionalData, setAemAdditionalData] = useState(null);

  const updateScratchCardApiData = (apiData) => {
    setScratchCardApiData(apiData);
  };

  const updateAemData = (aem) => {
    setAemData(aem);
  };

  const updateAemAdditionalData = (aemAdditional) => {
    setAemAdditionalData(aemAdditional);
  };

  const storeData = useMemo(
    () => ({
      scratchCardApiData,
      aemData,
      aemAdditionalData,
      updateScratchCardApiData,
      updateAemData,
      updateAemAdditionalData,
    }),
    [
      scratchCardApiData,
      aemData,
      aemAdditionalData,
      updateScratchCardApiData,
      updateAemData,
      updateAemAdditionalData,
    ],
  );

  return (
    <ScratchCardContext.Provider value={storeData}>
      {children}
    </ScratchCardContext.Provider>
  );
};
export function useTripSummaryContext() {
  const context = useContext(ScratchCardContext);
  if (context === undefined) {
    throw new Error('ScratchCardContext is used outside the context provider');
  }
  return context;
}

ScratchCardContextProvider.propTypes = {
  children: PropTypes.any,
};
export default ScratchCardContext;
