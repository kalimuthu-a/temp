import React, { useContext, useEffect, useState } from 'react';
import FlightsBookingInit from './FlightsBookingInit';
import RoundedTabs from '../../components/common/RoundedTabs/RoundedTabs';
import MyBookingsContext from './MyBookingsContext';
import analyticEvents from '../../utils/analyticEvents';
import { aaEvents, checkFlag, eventNames } from '../../utils/analyticsConstants';
import MyHotelBookings from './HotelsBookingInit';
import { LOGIN_SUCCESS, webCheckInStatus } from '../../constants/common';
import Cookies from 'skyplus-design-system-app/src/functions/cookies';
import { BROWSER_STORAGE_KEYS } from '../../constants';
import { myBookingsActions } from './MyBookingsReducer';

const defaultTab = 'Flights';

const MyBookingsInit = () => {
  const {
    state: { isLoggedIn, myBookingsData },
    dispatch,
  } = useContext(MyBookingsContext);
  const [whichTab, setWhichTab] = useState(defaultTab);
  const onLoginSuccess = () => {
    dispatch({
      type: myBookingsActions.SET_AUTH,
      payload: Cookies.get(BROWSER_STORAGE_KEYS.AUTH_USER, true, true),
    });
  };

  useEffect(() => {
    // Write pageload analytics here
    document.addEventListener(LOGIN_SUCCESS, onLoginSuccess);
    if (!isLoggedIn) {
      analyticEvents({
        event: aaEvents.MY_BOOKINGS_PAGELOAD,
        data: {
          _event: eventNames.BOOKING_PAGELOAD,
          checkFlag: `${checkFlag.viewBordingPassCount}|${checkFlag.smartCheckinCount}|${checkFlag.autoCheckinCount}|${checkFlag.planBCount}`,
        },
      });
    } else {
      const timeout = setTimeout(() => {
        if (myBookingsData?.currentJourney?.length) {
          checkFlag.viewBordingPassCount =
            myBookingsData?.currentJourney?.filter(
              (item) => item?.journey[0]?.webCheckinInfo?.isAllPaxCheckedIn,
            ).length;
          checkFlag.smartCheckinCount = myBookingsData?.currentJourney?.filter(
            (item) => item?.journey[0]?.webCheckinInfo?.isSmartCheckin,
          ).length;
          checkFlag.autoCheckinCount = myBookingsData?.currentJourney?.filter(
            (item) =>
              item?.journey[0]?.webCheckinInfo?.isAutoCheckedin ||
              (!item?.journey[0]?.webCheckinInfo?.isAllPaxCheckedIn &&
                item?.journey[0]?.webCheckinInfo?.isWebCheckinStatus ===
                  webCheckInStatus.OPEN),
          ).length;
          checkFlag.planBCount = 0;

          analyticEvents({
            event: aaEvents.MY_BOOKINGS_PAGELOAD,
            data: {
              _event: eventNames.BOOKING_PAGELOAD,
              checkFlag: `${checkFlag.viewBordingPassCount}|${checkFlag.smartCheckinCount}|${checkFlag.autoCheckinCount}|${checkFlag.planBCount}`,
            },
          });
        }
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [myBookingsData?.currentJourney?.length]);

  if (!isLoggedIn) {
    return null;
  }

  const setTab = async (e) => {
    setWhichTab(e.target.name);
  };

  const tabsList = [
    {
      title: 'Flights',
      onClickHandler: setTab,
    },
    {
      title: 'Hotels',
      onClickHandler: setTab,
    },
  ];

  return (
    <div>
      <RoundedTabs activeTab={whichTab} list={tabsList} />
      {whichTab === tabsList[0].title ? (
        <FlightsBookingInit />
      ) : (
        <MyHotelBookings />
      )}
    </div>
  );
};

export default MyBookingsInit;
