import { useEffect, useState } from 'react';
import { getErrorMsgForCode } from 'skyplus-design-system-app/dist/des-system/errorHandling';

import useAppContext from './useAppContext';
import analyticEvents from '../utils/analyticEvents';

import { splitPnrActions } from '../context/reducer';
import { aemMainData, passengersToSplit } from '../services';
import { analyiticProductInfo } from '../utils';
import { EVENTS } from '../constants';

function usePassengersToSplit() {
  const {
    state: { splitPnrs },
    dispatch,
  } = useAppContext();
  const [retrievePnrErrorMsg, setRetrievePnrErrorMsg] = useState('');

  const errorToast = (msg = '') => {
    dispatch({
      type: splitPnrActions.SET_TOAST,
      payload: {
        show: !!msg,
        variation: msg ? 'Error' : '',
        iconClass: msg ? 'icon-close-solid' : '',
        description: msg,
      },
    });
  };

  const errorHandler = (res) => {
    let errorMessage;

    if (!res) {
      errorMessage = getErrorMsgForCode();
    } else {
      const error = res?.errors?.[0] || res?.errors || res?.error;
      const { code, Code } = error || {};

      errorMessage = getErrorMsgForCode(code || Code);
      setRetrievePnrErrorMsg(getErrorMsgForCode('splitPnrApiFailureErrorMsg')?.message || '');
    }

    errorToast(errorMessage?.message);
  };

  const sendToABAnalytic = (api) => {
    const {
      tripType,
      departureDate,
      specialFare,
      totalCount,
      adultCount,
      childrenCount,
      infantCount,
      seniorCitizenCount,
      daysUntilDeparture,
      sector,
      pnr,
      bookingChannel,
    } = analyiticProductInfo(api) || {};

    analyticEvents({
      data: {
        _event: EVENTS.PAGE_LOAD,
        productInfo: {
          tripType,
          departureDates: departureDate,
          specialFare,
          totalPax: totalCount,
          adultPax: adultCount,
          childPax: childrenCount,
          infantPax: infantCount,
          seniorPax: seniorCitizenCount,
          daysUntilDeparture,
          sector,
          pnr,
        },
        bookingChannel,
      },
      event: EVENTS.PAGE_LOAD,
    });
  };

  const getPassengersToSplit = () => {
    const promiseList = [aemMainData()];

    if (!splitPnrs) {
      promiseList.push(passengersToSplit());
    }

    Promise.allSettled(promiseList)
      .then((res) => {
        const [{ value: mainData } = {}, { value: apiRes } = {}] = res || [];
        const { bookingInfo } = apiRes?.data || {};

        dispatch({
          type: splitPnrActions.INIT_APP,
          payload: {
            main: mainData || {},
            api: apiRes?.data || null,
          },
        });

        if (apiRes?.errors || apiRes?.error) {
          errorHandler(apiRes);

          return;
        }

        // analytics for pageLoad
        if (bookingInfo) {
          sendToABAnalytic(bookingInfo);
        }
      })
      .catch(() => {
        dispatch({
          type: splitPnrActions.INIT_APP,
          payload: {
            main: null,
            api: null,
          },
        });

        errorHandler();
      });
  };

  useEffect(() => {
    getPassengersToSplit();
  }, []);

  return { errorToast, errorHandler, retrievePnrErrorMsg };
}

export default usePassengersToSplit;
