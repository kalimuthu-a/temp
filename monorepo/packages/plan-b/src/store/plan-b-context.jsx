import { useState, useMemo, useContext, createContext } from 'react';
import PropTypes from 'prop-types';

const defaultState = {};
const PlanBContext = createContext(defaultState);

export const PlanBContextProvider = ({ children }) => {
  const [planBData, setPlanBData] = useState(null);
  const [aemData, setAEMData] = useState(null);

  const updatePlanBData = (apiData) => {
    setPlanBData(apiData);
  };

  const updateAEMData = (aemGraphqlData) => {
    setAEMData(aemGraphqlData);
  };

  const storeData = useMemo(
    () => ({
      planBData,
      aemData,
      updatePlanBData,
      updateAEMData,
    }),
    [
      planBData,
      aemData,
      updatePlanBData,
      updateAEMData,
    ],
  );

  return (
    <PlanBContext.Provider value={storeData}>
      {children}
    </PlanBContext.Provider>
  );
};
export function usePlanBContext() {
  const context = useContext(PlanBContext);
  if (context === undefined) {
    throw new Error('PlanBContext is used outside the context provider');
  }
  return context;
}

PlanBContextProvider.propTypes = {
  children: PropTypes.any,
};
export default PlanBContext;
