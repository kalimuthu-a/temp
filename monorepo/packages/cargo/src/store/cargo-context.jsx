import { useState, useMemo, useContext, createContext } from 'react';
import PropTypes from 'prop-types';

const defaultState = {};
const CargoContext = createContext(defaultState);

export const CargoContextProvider = ({ children }) => {
  const [cargoData, setCargoData] = useState(null);
  const [feeCodeMapping, setFeeCodeMapping] = useState(null);
  const [ssrCodeMapping, setSsrCodeMapping] = useState(null);
  const [aemData, setAEMData] = useState(null);

  const updateCargoData = (apiData) => {
    setCargoData(apiData);
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

  const storeData = useMemo(
    () => ({
      cargoData,
      feeCodeMapping,
      aemData,
      ssrCodeMapping,
      updateCargoData,
      updateFeeCodeMapping,
      updateAEMData,
      updateSsrCodeMapping,
    }),
    [
      cargoData,
      feeCodeMapping,
      aemData,
      ssrCodeMapping,
      updateCargoData,
      updateFeeCodeMapping,
      updateAEMData,
      updateSsrCodeMapping,
    ],
  );

  return (
    <CargoContext.Provider value={storeData}>
      {children}
    </CargoContext.Provider>
  );
};
export function useCargoContext() {
  const context = useContext(CargoContext);
  if (context === undefined) {
    throw new Error('CargoContext is used outside the context provider');
  }
  return context;
}

CargoContextProvider.propTypes = {
  children: PropTypes.any,
};
export default CargoContext;
