import { useState, useMemo, useContext, createContext } from 'react';
import PropTypes from 'prop-types';

const defaultState = {};
const UserSummaryContext = createContext(defaultState);

export const UserSummaryContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [aemData, setAEMData] = useState(null);
  const [retroClaimData, setRetroClaimData] = useState(null);
  const [transactionHistoryData, setTransactionHistoryData] = useState(null);
  const [transactionHistoryAemData, setTransactionHistoryAemData] = useState(null);
  const [voucherAEMData, setVoucherAEMData] = useState(null);
  const [filteredHistoryData, setFilteredHistoryData] = useState([]);

  const updateUserData = (apiData) => {
    setUserData(apiData);
  };

  const updateAEMData = (aemGraphqlData) => {
    setAEMData(aemGraphqlData);
  };
  const updateTransHisAEMData = (aemGraphqlData) => {
    setTransactionHistoryAemData(aemGraphqlData);
  };

  const updateTransHisApiData = (apiData) => {
    setTransactionHistoryData(apiData);
  };

  const updateRetroClaimData = (data) => {
    setRetroClaimData(data);
  };

  const updateVoucherAEMData = (voucherData) => {
    setVoucherAEMData(voucherData);
  };

  const updateFilteredHistoryData = (filteredData) => {
    setFilteredHistoryData(filteredData);
  }

  const storeData = useMemo(
    () => ({
      userData,
      aemData,
      updateAEMData,
      updateUserData,
      retroClaimData,
      updateRetroClaimData,
      transactionHistoryData,
      updateTransHisApiData,
      transactionHistoryAemData,
      updateTransHisAEMData,
      voucherAEMData,
      updateVoucherAEMData,
      filteredHistoryData,
      updateFilteredHistoryData,
    }),
    [
      userData,
      aemData,
      updateAEMData,
      updateUserData,
      retroClaimData,
      updateRetroClaimData,
      transactionHistoryData,
      setTransactionHistoryData,
      transactionHistoryAemData,
      setTransactionHistoryAemData,
      voucherAEMData,
      updateVoucherAEMData,
      filteredHistoryData,
      updateFilteredHistoryData,
    ],
  );

  return (
    <UserSummaryContext.Provider value={storeData}>
      {children}
    </UserSummaryContext.Provider>
  );
};
export function useUserSummaryContext() {
  const context = useContext(UserSummaryContext);

  if (context === undefined) {
    throw new Error('FareSummaryContext is used outside the context provider');
  }
  return context;
}

UserSummaryContextProvider.propTypes = {
  children: PropTypes.any,
};
export default UserSummaryContext;
