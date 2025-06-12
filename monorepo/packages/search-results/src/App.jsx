import React, { useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import PropTypes from 'prop-types';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import PopupModalWithContent from 'skyplus-design-system-app/dist/des-system/PopupModalWithContent';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import get from 'lodash/get';
import {
  useCustomEventListener,
  useCustomEventDispatcher,
} from 'skyplus-design-system-app/dist/des-system/customEventHooks';

import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';

import './styles/main.scss';
import Footer from './components/Footer/Footer';
import { AppContextProvider } from './context/AppContext';
import {
  aemAdditionalData,
  aemMainData,
  fetchFareCalendar,
  searchFlight,
} from './services';
import { srpActions } from './context/reducer';
import useAppContext from './hooks/useAppContext';
import {
  COOKIE_KEYS, INVALID_MARKET_CODE,
  LOG_IN_POP_UP_EVENT,
  URLS,
  customEvents,
  dateFormats,
  localStorageKeys,
} from './constants';
import FlightJourneyShimmer from './components/Shimmer/FlightJourneyShimmer';
import NoDataFound from './components/NoDataFound/NoDataFound';
import AppContainer from './components/AppContainer';

import PNRHeading from './components/PNRHeading/PNRHeading';
import FlightSegments from './components/FlightSegments/FlightSegments';
import FlightDateContainer from './components/FlightDateCarousel/FlightDateContainer';
import { screenLiveAnnouncer } from './utils/a11y';
import { isBurn as isBurnFlow } from './utils';

import LoyaltyEnrollPopup from './components/LoyaltyEnrollPopup/LoyaltyEnrollPopup';
import useLoyaltyEnrollment from './hooks/useLoyaltyEnrollment';

const App = () => {
  const {
    state: {
      showFooter,
      trips,
      selectedTripIndex,
      appLoading,
      searchContext,
      segments,
      noDataAvailable,
      main,
      additional: additionalData,
      toast,
      isLoyalty,
      enrollmentPopUp,
      isBurn,
      authUser: user,
      userSignedInSrp,
    },
    dispatch,
  } = useAppContext();
  const firstLoad = useRef(false);
  const { closeEnrollmentPopUp, redeemEligibilityCheck, enrollmentBenefits } = useLoyaltyEnrollment();
  const dispatchModifyPayWith = useCustomEventDispatcher();

  const updateFlightSearch = async (data) => {
    if (data) {
      searchContext.updateContext(data);

      if (isLoyalty && data?.payWith) {
        const burnFlow = isBurnFlow(data?.payWith);
        dispatch({
          type: srpActions.SET_LOYALTY_FLOW,
          payload: { isBurn: burnFlow, isEarn: !burnFlow, payWith: data?.payWith },
        });
      }
    }

    dispatch({
      type: srpActions.APP_UPDATE_SEARCH_CONTEXT,
      payload: searchContext,
    });

    const payload = searchContext.getRequestpayload(data);
    const { payloadPromotionCode, selectedCurrency } = searchContext;

    const calendarApiPromises = searchContext.getSegment().map((segment) => {
      return fetchFareCalendar({
        currencyCode: selectedCurrency?.value,
        destination: segment.destination,
        promoCode: payloadPromotionCode,
        lowestIn: 'W',
        origin: segment.origin,
        startDate: subDays(segment.departureDate, URLS.fareCalStart),
        endDate: format(
          addDays(segment.departureDate, URLS.fareCalEnd),
          dateFormats.yyyyMMdd,
        ),
      });
    });

    Promise.all([searchFlight(payload), ...calendarApiPromises]).then(
      (response) => {
        let [flightsData, ...calendarResponses] = response;
        calendarResponses = new Map(calendarResponses.flatMap((e) => [...e]));

        if (flightsData.data) {
          flightsData = flightsData.data;
        } else {
          const { code } = flightsData.errors;
          const noFlightfoundReason =
            code === INVALID_MARKET_CODE ? 'Route Not Defined' : 'API Error';

          flightsData = {
            trips: [],
            flightSearchData: {},
            noFlightfoundReason,
          };
        }

        dispatch({
          type: srpActions.SET_API_DATA,
          payload: { flightsData, calendarResponses },
        });
      },
    );
  };

  useCustomEventListener(
    customEvents.CALL_SEARCH_RESULT_API,
    updateFlightSearch,
  );

  useEffect(() => {
    const init = async () => {
      const payload = searchContext.getRequestpayload();
      const { payloadPromotionCode, selectedCurrency } = searchContext;

      const calendarApiPromises = searchContext.getSegment().map((segment) => {
        return fetchFareCalendar({
          currencyCode: selectedCurrency?.value,
          destination: segment.destination,
          promoCode: payloadPromotionCode,
          lowestIn: 'W',
          origin: segment.origin,
          startDate: subDays(segment.departureDate, URLS.fareCalStart),
          endDate: format(
            addDays(segment.departureDate, URLS.fareCalEnd),
            dateFormats.yyyyMMdd,
          ),
        });
      });

      Promise.all([
        aemMainData(),
        aemAdditionalData(),
        searchFlight(payload),
        ...calendarApiPromises,
      ])
        .then((response) => {
          const [mainData, additional, api, ...calendarResponses] = response;
          let apiResponse = {};

          if (api.data) {
            apiResponse = api.data;
          } else {
            const { code } = api.errors;
            const noFlightfoundReason =
              code === INVALID_MARKET_CODE ? 'Route Not Defined' : 'API Error';

            apiResponse = {
              trips: [],
              flightSearchData: {},
              noFlightfoundReason,
            };
          }

          dispatch({
            type: srpActions.INIT_APP,
            payload: {
              main: mainData,
              additional,
              api: apiResponse,
              calendarResponses: new Map(
                calendarResponses.flatMap((e) => [...e]),
              ),
            },
          });
        })
        .catch(() => {
          dispatch({
            type: srpActions.INIT_APP,
            payload: {
              main: {},
              additional: {},
              api: { trips: [], flightSearchData: {} },
              calendarResponses: new Map(),
            },
          });
        })
        .finally(() => {
          firstLoad.current = true;
        });
    };

    if (!noDataAvailable) {
      init();
    }

    const setAuthUser = () => {
      let authUser;
      try {
        authUser = Cookies.get(COOKIE_KEYS.USER, true, true);
      } catch (e) {
        authUser = Cookies.get(COOKIE_KEYS.USER);
      }

      dispatch({
        type: srpActions.SET_AUTH_USER,
        payload: authUser,
      });

      if (firstLoad.current && (authUser?.loyaltyMemberInfo?.FFN || authUser?.loyaltyMemberInfo?.tier)) {
        updateFlightSearch();
      }
    };

    const resetAuthUser = () => {
      dispatch({
        type: srpActions.SET_AUTH_USER,
        payload: null,
      });

      updateFlightSearch();
    };

    const setNominee = () => {
      let nomineeDetails;
      try {
        nomineeDetails = Cookies.get(COOKIE_KEYS.NOMINEE_DETAILS, true, true);
      } catch (e) {
        nomineeDetails = Cookies.get(COOKIE_KEYS.NOMINEE_DETAILS);
      }

      dispatch({
        type: srpActions.SET_NOMINEE_DETAILS,
        payload: nomineeDetails,
      });
    };

    // removing reviewsummary persist data from SRP page
    localStorage.removeItem(localStorageKeys.journeyReview);

    document.addEventListener(customEvents.LOYALTY_MEMBER_LOGIN_SUCCESS, setAuthUser);
    document.addEventListener(customEvents.AUTH_LOGIN_SUCCESS, setAuthUser);
    document.addEventListener(customEvents.AUTH_TOKEN_LOGOUT_SUCCESS, resetAuthUser);
    document.addEventListener(customEvents.NOMINEE_DETAILS_RECEIVED, setNominee);

    return () => {
      document.removeEventListener(customEvents.LOYALTY_MEMBER_LOGIN_SUCCESS, setAuthUser);
      document.removeEventListener(customEvents.AUTH_LOGIN_SUCCESS, setAuthUser);
      document.removeEventListener(customEvents.AUTH_TOKEN_LOGOUT_SUCCESS, resetAuthUser);
      document.removeEventListener(customEvents.NOMINEE_DETAILS_RECEIVED, setNominee);
    };
  }, []);

  // should work only during enrollment in progress
  useEffect(() => {
    if (firstLoad?.current && !appLoading) {
      redeemEligibilityCheck();
    }
  }, [redeemEligibilityCheck, firstLoad?.current, appLoading]);

  // should work only during burn flow and user is logged as 6e user
  useEffect(() => {
    if (userSignedInSrp && !appLoading && isBurn && user) {
      const isUserLoggedIn =
        user?.customerNumber || user?.mobileNumber || user?.name;
      const { FFN, tier } = user?.loyaltyMemberInfo || {};
      const isLoyaltyUser = FFN || tier;

      if (isUserLoggedIn && !isLoyaltyUser) {
        const { name, persona, types: { customerEnrollSSO } } = LOG_IN_POP_UP_EVENT;
        const eventObj = { bubbles: true, detail: { loginType: customerEnrollSSO, persona } };
        const toggleLoginPopupEvent = () => { document.dispatchEvent(new CustomEvent(name, eventObj)); };

        // open eroll pop up
        enrollmentBenefits(toggleLoginPopupEvent);
      }
    }
  }, [userSignedInSrp, appLoading, isBurn, user]);

  const { originCityName, destinationCityName, minDate } = useMemo(() => {
    return get(segments, [selectedTripIndex], {
      originCityName: '',
      destinationCityName: '',
      departureDate: '',
      selectedDate: '',
      maxDate: '',
    });
  }, [segments, selectedTripIndex]);

  const tripforCurrentSegment = get(
    trips,
    [selectedTripIndex, 'journeysAvailable'],
    [],
  );

  return (
    <div className="srp-mf-container">
      <PNRHeading />
      <h1
        className="visa-pax-selection-note-block-des visa-srp-head-text"
        dangerouslySetInnerHTML={{
          __html:
            main?.selectRteLabel?.html
              ?.replace('{from}', `<br/><span>${originCityName}</span>`)
              ?.replace('{to}', `<span>${destinationCityName}</span>`) || '',
        }}
      />

      <FlightSegments minDate={minDate} />
      {appLoading ? <FlightJourneyShimmer /> : null}
      {searchContext.isMulticityTrip() ||
      noDataAvailable ||
      appLoading ? null : (
        <FlightDateContainer />
      )}
      <AppContainer tripforCurrentSegment={tripforCurrentSegment} />
      {showFooter && <Footer />}
      {noDataAvailable && <NoDataFound />}
      {toast.show && (
        <Toast
          infoIconClass="icon-info"
          variation={`notifi-variation--${toast.variation}`}
          description={toast.description}
          containerClass="toast-example"
          autoDismissTimeer={5000}
          onClose={() => {
            dispatch({
              type: srpActions.SET_TOAST,
              payload: { show: false, description: '' },
            });
            screenLiveAnnouncer('');
          }}
        />
      )}
      {enrollmentPopUp?.show && enrollmentPopUp?.data?.note && (
        <PopupModalWithContent
          className="srp-loyalty-popup"
          onCloseHandler={closeEnrollmentPopUp}
          modalTitle={additionalData?.loyaltyMemberBenefitsPopup?.heading}
          customPopupContentClassName="srp-loyalty-popup--content"
        >
          <LoyaltyEnrollPopup
            data={enrollmentPopUp?.data}
            updateFlightSearch={() => {
              // update Booking widget payWith to cash
              dispatchModifyPayWith(customEvents.LOYALTY_PAYWITH_EVENT, {
                payWith: 'Cash',
              });

              closeEnrollmentPopUp();
            }}
          />
        </PopupModalWithContent>
      )}
      <div id="srp-announcer" role="region" aria-live="assertive" />
    </div>
  );
};

App.propTypes = {};

let root = null;

function srpAppInit(ele, data = null) {
  if (ele !== undefined && ele !== null) {
    if (root === null) {
      root = createRoot(ele);
    }
    root.render(
      <AppContextProvider {...data}>
        <App />
      </AppContextProvider>,
    );
  }
}

if (document.querySelector('#__searchresultpage__microapp')) {
  srpAppInit(document.getElementById('__searchresultpage__microapp'), {
    pageType: 'srp',
  });
}

App.propTypes = {
  data: PropTypes.shape({ mfData: {}, pageType: '', configJson: { data: {} } }),
};

// eslint-disable-next-line import/prefer-default-export
export { srpAppInit };
