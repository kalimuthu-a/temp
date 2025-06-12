import { useEffect, useContext } from 'react';
import { getAemContent } from '../services';
import { PAGES } from '../constants';
import { AppContext } from '../context/AppContext';
import { visaServiceActions } from '../context/reducer';

const useVisaInitalData = () => {
  const { dispatch } = useContext(AppContext);

  // Fetch Visa AEM Content
  const fetchVisaAemContent = async () => {
    try {
      const { data } = await getAemContent(PAGES.VISA_AEM_MAIN);
      return data?.visaMainByPath?.item || {};
    } catch (error) {
      throw new Error('Failed to fetch AEM content');
    }
  };

  // Execute API calls and dispatch results or errors
  const apiCalls = async () => {
    try {
      const results = await Promise.allSettled([fetchVisaAemContent()]);
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          if (index === 0) {
            // The first call is for Visa AEM content
            dispatch({
              type: visaServiceActions.SET_VISA_AEM_MAIN_CONTENT,
              payload: result.value,
            });
          }
        } else {
          // Handle errors for individual promises
          dispatch({
            type: visaServiceActions.SET_VISA_API_ERROR,
            payload: result.reason,
          });
        }
      });
    } catch (error) {
      dispatch({
        type: visaServiceActions.SET_VISA_API_ERROR,
        payload: 'An unexpected error occurred during API calls', // General error handling
      });
    }
  };

  useEffect(() => {
    apiCalls();
  }, []); // Add dispatch to the dependency array to avoid unnecessary re-renders
};

export default useVisaInitalData;
