import React from 'react';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import { encryptAESForLogin } from 'skyplus-design-system-app/dist/des-system/loginEncryption';

import useAppContext from '../../hooks/useAppContext';
import analyticEvents from '../../utils/analyticEvents';
import usePassengersToSplit from '../../hooks/usePassengersToSplit';

import Loader from '../Loader/Loader';
import BackButton from '../LinkButton';
import SplitPnrLanding from '../../pages/SplitPnrLanding';
import SplitPnrDetail from '../SplitPnrDetail/SplitPnrDetail';
import SplitPnrPopUp from '../SplitPnrPopUp';

import CONSTANTS, { EVENTS } from '../../constants';
import { passengersToSplit } from '../../services';
import { splitPnrActions } from '../../context/reducer';

const classNameText = 'split_pnr';

function SplitPnrHome() {
  const {
    state: {
      isLoading,
      main,
      selectedPassengersList,
      toast,
      popUp,
      splitPnrs,
    },
    dispatch,
  } = useAppContext();
  const { errorToast, errorHandler, retrievePnrErrorMsg } = usePassengersToSplit();

  // show & hide loader
  const handleLoader = (display = false) => {
    dispatch({
      type: splitPnrActions.SHOW_LOADER,
      payload: display,
    });
  };

  const splitPnrClick = () => {
    dispatch({
      type: splitPnrActions.SET_POPUP,
      payload: {
        show: false,
        data: null,
      },
    });
    //  display Loader
    handleLoader(true);

    const payLoad = {
      passengerKeys: [...selectedPassengersList],
      autoDividePayments: true,
      overrideRestrictions: true,
    };

    passengersToSplit(payLoad)
      .then((res) => {
        if (res?.errors || res?.error) {
          errorHandler();
          return;
        }

        const pnrDetails = res?.data?.pnrDetails || res?.data?.pnrdetails;

        if (pnrDetails) {
          dispatch({
            type: splitPnrActions.SET_SPLIT_PNRS,
            payload: pnrDetails,
          });

          window.location.hash = encryptAESForLogin(JSON.stringify(pnrDetails));

          dispatch({
            type: splitPnrActions.SET_TOAST,
            payload: {
              show: true,
              variation: 'Success',
              iconClass: 'icon-tick-filled text-forest-green',
              description: main?.splitPnrSuccessMessage,
            },
          });
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log('passengersToSplit  err', err);

        errorHandler();
      }).finally(() => {
        // remove loader
        handleLoader();
      });

    // send to Adobe Analytic
    analyticEvents({
      data: {
        _event: EVENTS.CLICK,
        eventInfo: {
          name: CONSTANTS.SELECT_AND_CONTINUE,
          position: '',
        },
      },
      event: EVENTS.CLICK,
    });
  };

  const backToItinerary = () => {
    if (main?.backButtonLink) {
      window.location.href = main?.backButtonLink;
    }

    window.history.go(-1);
  };

  const backToMyTrips = () => {
    window.location.href = main?.myTripBackButtonLink;
  };

  return (
    <div className={`${classNameText}--wrapper`}>
      {isLoading && <Loader />}
      {!isLoading && (
        <>
          <BackButton
            containerClass="back_button--container"
            buttonText={!splitPnrs ? main?.backButtonTitle : main?.myTripBackButtonTitle}
            iconClass="icon-accordion-left-simple"
            onButtonClick={!splitPnrs ? backToItinerary : backToMyTrips}
          />

          {!splitPnrs && (
            <SplitPnrLanding
              classNameText={classNameText}
              errorToast={errorToast}
              retrievePnrErrorMsg={retrievePnrErrorMsg}
            />
          )}

          {splitPnrs && <SplitPnrDetail errorHandler={errorHandler} handleLoader={handleLoader} />}

          {toast?.show && (
            <Toast
              infoIconClass={toast.iconClass}
              variation={`notifi-variation--${toast.variation}`}
              description={toast.description}
              containerClass="split-pnr-toast"
              autoDismissTimeer={3000}
              onClose={() => {
                dispatch({
                  type: splitPnrActions.SET_TOAST,
                  payload: { show: false, description: '' },
                });
              }}
            />
          )}

          {popUp?.show && <SplitPnrPopUp data={popUp?.data} onClick={splitPnrClick} />}
        </>
      )}
    </div>
  );
}

export default SplitPnrHome;
