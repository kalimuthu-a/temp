import { useState, useMemo, useContext, createContext } from 'react';
import PropTypes from 'prop-types';

const defaultState = {};
const VisaServiceContext = createContext(defaultState);

export const VisaServiceContextProvider = ({ children }) => {
  const [apiData, setApiData] = useState(null);
  const [aemData, setAemData] = useState(null);

  // eslint-disable-next-line no-shadow
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
    <VisaServiceContext.Provider value={storeData}>
      {children}
    </VisaServiceContext.Provider>
  );
};
export function useVisaServiceContext() {
  const context = useContext(VisaServiceContext);
  if (context === undefined) {
    throw new Error('VisaServiceContext is used outside the context provider');
  }
  return context;
}

VisaServiceContextProvider.propTypes = {
  children: PropTypes.any,
};
export default VisaServiceContext;
