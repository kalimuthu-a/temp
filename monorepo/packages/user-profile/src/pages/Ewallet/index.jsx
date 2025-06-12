import React, { useContext } from 'react';
import { EwalletContextProvider } from './EwalletContext';
import Ewallet from './Ewallet';
import AEMContext from '../../context/AEMContextProvider';

const NomineePage = () => {
  const { aemLabel } = useContext(AEMContext);

  return (
    <EwalletContextProvider aemLabel={aemLabel}>
      <Ewallet />
    </EwalletContextProvider>
  );
};

export default NomineePage;
