import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const useAppContext = () => {
  const { state, dispatch, aemLabel, formattedAEMLabel, loaderImage } =
    useContext(AppContext);

  return { state, dispatch, aemLabel, formattedAEMLabel, loaderImage };
};

export default useAppContext;
