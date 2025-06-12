/* eslint-disable implicit-arrow-linebreak */
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Pages } from 'skyplus-design-system-app/src/functions/globalConstants';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';

import { AppContextProvider } from './context/AppContext';

import './styles/main.scss';
import { ANALTYTICS, COOKIE_KEYS, customEvents } from './constants';
import HomePageContainer from './pages/Home/HomePageContainer';
import SRPPageContainer from './pages/Srp/SrpPageContainer';
import useAppContext from './hooks/useAppContext';
import pushAnalytics from './utils/analyticsEvent';
import {
  aemAdditionalData,
  aemMainData,
  aemOffersData,
  getWidgetData,
  popularSearches,
} from './services';
import { bookingActions } from './context/reducer';
import Shimmer from './components/Shimmer/Shimmer';
import CargoHomePageContainer from './pages/Cargo/CargoHomePageContainer';

const { HOMEPAGE, SRP, FLIGHT_SELECT_MODIFICATION, XPLORE, CARGO_HOME } = Pages;
const sendApiDatatoExplorePage = (config) =>
  new CustomEvent('WIDGET_DATA_TO_EXPLORE_PAGE', config);

const App = ({ page, time }) => {
  const {
    dispatch,
    state: { loading, isLoyaltyEnabled },
  } = useAppContext();
  const className = `bookingmf-container ${page} ${isLoyaltyEnabled ? 'loyalty-enabled' : ''}`;

  const renderPageContainer = () => {
    if ([SRP, FLIGHT_SELECT_MODIFICATION, XPLORE].includes(page)) {
      return <SRPPageContainer />;
    }

    if (page === CARGO_HOME) {
      return <CargoHomePageContainer />;
    }

    return <HomePageContainer />;
  };

  useEffect(() => {
    // Analytics - Booking Widget Load Event 2 Added
    if (window?._msdv2?.disableBookingRemoteTracking === false) {
      pushAnalytics({
        event: ANALTYTICS.DATA_CAPTURE_EVENTS.BOOKING_REMOTE_LOADED,
        data: {},
      });
    }

    dispatch({ type: bookingActions.SET_LOADER, payload: true });
    const loadBWData = async () => {
      Promise.all([
        aemMainData(),
        aemAdditionalData(),
        aemOffersData(),
        getWidgetData(),
        popularSearches(),
      ])
        .then((response) => {
          pushAnalytics({
            event: ANALTYTICS.DATA_CAPTURE_EVENTS.BOOKING_WIDGET_LOAD,
            data: {},
          });
          const [main, additional, offers, widgetApiData, popSearch] = response;
          if (page === XPLORE) {
            document.dispatchEvent(
              sendApiDatatoExplorePage({
                bubbles: true,
                detail: {
                  value: widgetApiData,
                  main,
                },
              }),
            );
          }
          dispatch({
            type: bookingActions.SET_API_DATA,
            payload: {
              main,
              additional,
              offers,
              widgetApiData,
              popSearch,
            },
          });
        })
        .catch(() => {
          // Error Handler
        });
    };

    loadBWData();
  }, [time]);

useEffect(() => {
  const setNominee = () => {
    let nomineeDetails;
    try {
      nomineeDetails = Cookies.get(COOKIE_KEYS.NOMINEE_DETAILS, true, true) || [];
    } catch (e) {
      nomineeDetails = Cookies.get(COOKIE_KEYS.NOMINEE_DETAILS) || [];
    }

    dispatch({
      type: bookingActions.SET_NOMINEE_DETAILS,
      payload: nomineeDetails,
    });
  };

  document.addEventListener(customEvents.NOMINEE_DETAILS_RECEIVED, setNominee);

  return () => {
    document.removeEventListener(customEvents.NOMINEE_DETAILS_RECEIVED, setNominee);
  };
}, []);

  if (loading) {
    if (![SRP, FLIGHT_SELECT_MODIFICATION, XPLORE].includes(page)) {
      return <Shimmer />;
    }
    return null;
  }

  return (
    <div className={className}>
      {renderPageContainer()}
      <div id="bw-announcer" role="region" aria-live="assertive" />
    </div>
  );
};

App.propTypes = {
  page: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
};

let rootElement = null;

function BookingMainApp(ele, data = {}) {
  if (ele !== undefined && ele !== null) {
    if (rootElement === null) {
      rootElement = createRoot(ele);
    }

    rootElement.render(
      <AppContextProvider additionalData={data}>
        <App page={data.pageType || HOMEPAGE} time={data.time} />
      </AppContextProvider>,
    );
  }
}

if (document.querySelector('#__mf-booking')) {
  // window.BookingMainApp = BookingMainApp;
  BookingMainApp(document.getElementById('__mf-booking'), {
    pageType: window.pageType,
    persona: 'Member',
    time: 1,
  });
}

// eslint-disable-next-line import/prefer-default-export
export { BookingMainApp };
