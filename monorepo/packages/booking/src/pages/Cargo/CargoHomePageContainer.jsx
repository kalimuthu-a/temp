import React, { useEffect } from 'react';

import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import useAppContext from '../../hooks/useAppContext';
import Shimmer from '../../components/Shimmer/Shimmer';
import { COOKIE_KEYS } from '../../constants';
import { bookingActions } from '../../context/reducer';
import CargoFormWrapper from '../../components/CargoContainer/CargoFormWrapper';

const CargoHomePageContainer = () => {
  const {
    dispatch,
    state: {
      main,
      loading,
    },
  } = useAppContext();

  // TODO: need to update for cargo
  // const [journies, setJournies] = useState(() => {
  //   const defaultLocationEle = document.getElementById('src-dest-iata');
  //   const defaultSource = defaultLocationEle?.dataset?.originIata || '';
  //   const defaultDestination =
  //     defaultLocationEle?.dataset?.destinationIata || '';

  //   const sourceCity = airportsData.find(
  //     (airport) => airport.stationCode === defaultSource,
  //   );

  //   const destinationCity = airportsData.find(
  //     (airport) => airport.stationCode === defaultDestination,
  //   );

  //   return [
  //     {
  //       destinationCity,
  //       sourceCity,
  //       isNationalityPopup: false,
  //       departureDate: add(new Date(), {
  //         days: 1,
  //       }),
  //       arrivalDate: null,
  //       minDate: new Date(),
  //       key: uniq(),
  //       maxDate: getMaxDateForCalendar(),
  //     },
  //   ];
  // });

  useEffect(() => {
    let authUserData;
    try {
      authUserData = Cookies.get(COOKIE_KEYS.USER, true, true);
    } catch (e) {
      authUserData = Cookies.get(COOKIE_KEYS.USER);
    }
    dispatch({
      type: bookingActions.SET_AUTH_USER,
      payload: authUserData,
    });
  }, []);

  // const onClickHotel = () => {
  //   analyticsEvent({
  //     event: ANALTYTICS.DATA_CAPTURE_EVENTS.BOOK_A_STAY_CLICK,
  //     data: {},
  //   });

  //   gtmPushAnalytic({
  //     event: GTM_ANALTYTICS.EVENTS.BOOK_A_STAY_CLICK,
  //   });
  // };

  // const onClickFlight = () => {
  //   analyticsEvent({
  //     event: ANALTYTICS.DATA_CAPTURE_EVENTS.BOOK_A_FLIGHT_CLICK,
  //     data: {},
  //   });

  //   gtmPushAnalytic({
  //     event: GTM_ANALTYTICS.EVENTS.BOOK_A_FLIGHT_CLICK,
  //   });
  // };

  return loading ? (
    <Shimmer />
  ) : (
    <div className="bookingmf-container--tab-container">
      <div className="bookingmf-container__tabs">
        <div
          className="bookingmf-container__tabs--item active"
          role="presentation"
        >
          <Icon className="icon-Flight" />
          <Text
            variation="body-large-medium"
            mobileVariation="body-small-medium"
            containerClass="tab-link"
          >
            {main.bookFlightLabel}
          </Text>
        </div>
        {/* {main.bookStayLabel && (
            <a
              className="bookingmf-container__tabs--item"
              onClick={onClickHotel}
              href={main.bookStayPath}
              target={main.bookStayOpenInNewTab ? '_blank' : '_self'}
              rel="noreferrer noopener"
            >
              <Icon className="icon-hotel" />
              <Text
                variation="body-large-medium"
                mobileVariation="body-small-medium"
                containerClass="tab-link"
              >
                {main.bookStayLabel}
              </Text>
            </a>
          )} */}
      </div>
      <div className="bookingmf-container__tabs--content">
        {/* {showTempForm && isMobile && (
            <CargoFormWrapper
              context={{
                ...main,
              }}
            />
          )} */}
        <CargoFormWrapper
          context={{
                  ...main,
              }}
        />
      </div>
    </div>
  );
};

export default CargoHomePageContainer;
