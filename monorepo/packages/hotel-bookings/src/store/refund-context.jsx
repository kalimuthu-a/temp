import { useState, useMemo, useContext, createContext } from 'react';
import PropTypes from 'prop-types';

const defaultState = {};
const RefundContext = createContext(defaultState);

export const RefundContextProvider = ({ children }) => {
  const [refundData, setRefundData] = useState(null);
  const [aemData, setAemData] = useState(null);
  const [aemAdditionalData, setAemAdditionalData] = useState(null);

  const updateRefundData = (apiData) => {
    setRefundData(apiData);
  };

  const updateAemData = (aem) => {
    setAemData(aem);
  };

  const updateAemAdditionalData = (aemAdditional) => {
    setAemAdditionalData(aemAdditional);
  };

  const storeData = useMemo(
    () => ({
      refundData,
      aemData,
      aemAdditionalData,
      updateRefundData,
      updateAemData,
      updateAemAdditionalData,
    }),
    [
      refundData,
      aemData,
      aemAdditionalData,
      updateRefundData,
      updateAemData,
      updateAemAdditionalData,
    ],
  );

  return (
    <RefundContext.Provider value={storeData}>
      {children}
    </RefundContext.Provider>
  );
};
export function useRefundContext() {
  const context = useContext(RefundContext);
  if (context === undefined) {
    throw new Error('RefundContext is used outside the context provider');
  }
  return context;
}

RefundContextProvider.propTypes = {
  children: PropTypes.any,
};
export default RefundContext;
