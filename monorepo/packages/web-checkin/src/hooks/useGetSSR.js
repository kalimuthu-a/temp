import { useEffect } from 'react';
import useAppContext from './useAppContext';
import { getSSR } from '../services';
import { webcheckinActions } from '../context/reducer';

const useGetSSR = () => {
  const { dispatch } = useAppContext();

  useEffect(() => {
    const getSSRS = async () => {
      const response = await getSSR();
      dispatch({
        type: webcheckinActions.SET_SSR,
        payload: response,
      });
    };

    getSSRS();
  }, []);
};

export default useGetSSR;
