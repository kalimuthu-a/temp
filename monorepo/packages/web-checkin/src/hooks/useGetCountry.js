import { useEffect } from 'react';
import useAppContext from './useAppContext';
import { getCountriesData } from '../services';
import { webcheckinActions } from '../context/reducer';

const useGetCountry = () => {
  const { dispatch } = useAppContext();

  useEffect(() => {
    const getCountries = async () => {
      const response = await getCountriesData();
      dispatch({
        type: webcheckinActions.SET_COUNTRIES,
        payload: response?.countries,
      });
    };

    getCountries();
  }, []);
};

export default useGetCountry;
