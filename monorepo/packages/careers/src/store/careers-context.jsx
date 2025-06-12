import { useState, useMemo, useContext, createContext } from 'react';
import PropTypes from 'prop-types';

const defaultState = {};
const CareersContext = createContext(defaultState);

export const CareersContextProvider = ({ children }) => {
  const [careersData, setCareersData] = useState(null);
  const [aemData, setAemData] = useState(null);
  const [aemAdditionalData, setAemAdditionalData] = useState(null);

  const updateCareersData = (apiData) => {
    setCareersData(apiData);
  };

  const updateAemData = (aem) => {
    setAemData(aem);
  };

  const updateAemAdditionalData = (aemAdditional) => {
    setAemAdditionalData(aemAdditional);
  };

  const storeData = useMemo(
    () => ({
      careersData,
      aemData,
      aemAdditionalData,
      updateCareersData,
      updateAemData,
      updateAemAdditionalData,
    }),
    [
      careersData,
      aemData,
      aemAdditionalData,
      updateCareersData,
      updateAemData,
      updateAemAdditionalData,
    ],
  );

  return (
    <CareersContext.Provider value={storeData}>
      {children}
    </CareersContext.Provider>
  );
};
export function useCareersContext() {
  const context = useContext(CareersContext);
  if (context === undefined) {
    throw new Error('CareersContext is used outside the context provider');
  }
  return context;
}

CareersContextProvider.propTypes = {
  children: PropTypes.any,
};
export default CareersContext;
