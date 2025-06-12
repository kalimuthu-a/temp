import React, { useContext, useMemo } from 'react';
import { NomieeContextProvider } from './NomieeContext';
import Nominee from './Nominee';
import AEMContext from '../../context/AEMContextProvider';

const NomineePage = () => {
  const { aemLabel } = useContext(AEMContext);

  const { maxNomineeCount } = useMemo(() => {
    return {
      maxNomineeCount: parseInt(aemLabel('addNomineesMaxCount', 5), 10),
    };
  }, [aemLabel]);

  return (
    <NomieeContextProvider maxNomineeCount={maxNomineeCount}>
      <Nominee />
    </NomieeContextProvider>
  );
};

export default NomineePage;
