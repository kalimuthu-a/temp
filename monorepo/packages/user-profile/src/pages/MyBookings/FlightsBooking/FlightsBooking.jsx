/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { uniq } from 'skyplus-design-system-app/src/functions/utils';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import BookingCard from './BookingCard/BookingCard';
import BookingInfo from './BookingInfo/BookingInfo';
import MyBookingsContext from '../MyBookingsContext';
import RoundedTabs from '../../../components/common/RoundedTabs/RoundedTabs';
import { getMyBookings } from '../../../services/myBooking.service';
import { myBookingsActions } from '../MyBookingsReducer';
import createMyBookingsCardData from './BookingInfoData';
import Loader from '../../../components/common/Loader/Loader';
import CancelledInfo from './CancelledInfo/CancelledInfo';
import { AGENT, FLIGHT_BOOKING } from '../../../constants/common';

const FlightsBooking = () => {
  const {
    state: {
      myBookingsAemData,
      // initGetBookingDone,
      userType,
      myBookingsData: {
        completedJourney = [],
        currentJourney = [],
        cancelledJourney = [],
        allBookings = [],
      } = {},
      myBookingsAemData: {
        upcomingTripsLabel,
        pastTripsLabel,
        cancelledTripsLabel,
        noPastTripsMsg,
        noCurrentTripsMsg,
        noCancelledTripsMsg,
        showMoreBtnLabel,
        codeShare,
        paginationSizeNumber = 50,
      },
    },
    dispatch,
  } = useContext(MyBookingsContext);
  const isAgent = userType === AGENT;

  const setTab = async (e) => {
    setWhichTab(e.target.name);
  };

  const list = [
    {
      title: upcomingTripsLabel,
      onClickHandler: setTab,
    },
    {
      title: pastTripsLabel,
      onClickHandler: setTab,
    },
    {
      title: cancelledTripsLabel,
      onClickHandler: setTab,
    },
  ];

  const [whichTab, setWhichTab] = useState(() => (isAgent ? undefined : list[0].title));
  const [noBookingMsg, setNoBookingMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShowMoreVisible, setIsShowVisible] = useState(false);
  const pageLastIndex = useRef(0);
  const lastBookingListItemRef = useRef(null);

  useEffect(() => {
    if (!isAgent) {
      setWhichTab(list[0].title);
    }
  }, [upcomingTripsLabel]);

  useEffect(() => {
    if (allBookings.length > paginationSizeNumber) {
      const { offsetTop, offsetLeft } = lastBookingListItemRef?.current || {};
      if (offsetLeft && offsetTop) {
        window.scrollTo(offsetLeft, offsetTop - 80);
      }
    }
  }, [allBookings]);

  useEffect(() => {
    if (whichTab === list?.[0]?.title && !currentJourney?.length) {
      setNoBookingMsg(noCurrentTripsMsg);
    } else if (whichTab === list?.[1]?.title && !completedJourney?.length) {
      setNoBookingMsg(noPastTripsMsg);
    } else if (whichTab === list?.[2]?.title && !cancelledJourney?.length) {
      setNoBookingMsg(noCancelledTripsMsg);
    } else if (!whichTab && isAgent && !allBookings?.length) {
      setNoBookingMsg(noCurrentTripsMsg);
    } else {
      setNoBookingMsg('');
    }
  }, [completedJourney, currentJourney, cancelledJourney, whichTab]);

  useEffect(() => {
    const getBookingData = async () => {
      setIsLoading(true);
      let searchFilterParam; // this well get all booking

      if (whichTab === list?.[0]?.title) {
        searchFilterParam = 0; // this well get upcoming bookins
      } else if (whichTab === list?.[1]?.title) {
        searchFilterParam = 1; // this will get past bookings
      } else if (whichTab === list?.[2]?.title) {
        searchFilterParam = 2; // this will get cancelled booking
      }

      let pageLastIndexParam = null;
      if (isAgent) {
        searchFilterParam = 4;
        pageLastIndexParam = 0;
      }
      const getMyBookingsData = await getMyBookings(
        searchFilterParam,
        pageLastIndexParam,
        isAgent,
        paginationSizeNumber,
      ); // 10 sec
      if (isAgent) {
        const {
          currentJourney: apiCurrentJourney,
          completedJourney: apiCompletedJourney,
          cancelledJourney: apiCancelledJourney,
        } = getMyBookingsData || {
          currentJourney: [],
          completedJourney: [],
          cancelledJourney: [],
        };
        const allBookingsData = [...apiCurrentJourney, ...apiCompletedJourney, ...apiCancelledJourney];
        getMyBookingsData.allBookings = allBookingsData;
        // setPageLastIndex((prevIndex) => prevIndex + 1);
        pageLastIndex.current += 1;
        if (allBookingsData.length === paginationSizeNumber) {
          setIsShowVisible(true);
        }
      }

      dispatch({
        type: myBookingsActions.SET_MY_BOOKINGS,
        payload: getMyBookingsData,
      });
      setIsLoading(false);
    };
    getBookingData();
  }, [whichTab]);

  const onShowMorehandler = async (e) => {
    e.preventDefault();
    if (isAgent) {
      const searchFilterParam = 4;
      dispatch({
        type: myBookingsActions.SET_LOADER,
        payload: true,
      });
      try {
        const getMyBookingsData = await getMyBookings(
          searchFilterParam,
          pageLastIndex?.current,
          isAgent,
          paginationSizeNumber,
        );
        const {
          currentJourney: apiCurrentJourney,
          completedJourney: apiCompletedJourney,
          cancelledJourney: apiCancelledJourney,
        } = getMyBookingsData || {
          currentJourney: [],
          completedJourney: [],
          cancelledJourney: [],
        };
        const paginationBookingData = [
          ...apiCurrentJourney,
          ...apiCompletedJourney,
          ...apiCancelledJourney,
        ];
        const allBookingsData = [
          ...allBookings,
          ...paginationBookingData,
        ];
        getMyBookingsData.allBookings = allBookingsData;

        if (paginationBookingData.length < paginationSizeNumber) setIsShowVisible(false);

        dispatch({
          type: myBookingsActions.SET_MY_BOOKINGS,
          payload: getMyBookingsData,
        });
        // setPageLastIndex((prevIndex) => prevIndex + 1);
        pageLastIndex.current += 1;
      } catch (error) {
        // console.warning(error);
      }

      dispatch({
        type: myBookingsActions.SET_LOADER,
        payload: false,
      });
    }
  };

  /* Cancelled Journey Function */
  const cancelledJourneyTrips = (cancelledJourneys, i) => {
    return cancelledJourneys?.map((journey) => {
      const bookingData = createMyBookingsCardData(
        journey,
        myBookingsAemData,
        false,
      );
      const bookingRef = i === allBookings.length - paginationSizeNumber ? lastBookingListItemRef : null;
      return (
        <div className="mb-10" key={uniq()} ref={bookingRef}>
          <BookingCard bookingData={bookingData} labels={myBookingsAemData}>
            <div className="rounded-3">
              <CancelledInfo
                bookingData={bookingData}
                labels={myBookingsAemData}
              />
            </div>
          </BookingCard>
        </div>
      );
    });
  };

  /* Current Journey Function */
  const currentJourneyTrips = (currentJourneys, i) => {
    return currentJourneys?.map((journey) => {
      const bookingData = createMyBookingsCardData(
        journey,
        myBookingsAemData,
        false,
      );
      const bookingRef = i === allBookings.length - paginationSizeNumber ? lastBookingListItemRef : null;
      return (
        <div className="mb-10" key={uniq()} ref={bookingRef}>
          <BookingCard
            bookingData={bookingData}
            labels={myBookingsAemData}
            isUpcomingTrip
            isPastTrip={false}
          >
            <div className="rounded-3">
              {bookingData?.bookingInfo?.map((data, index) => (
                <BookingInfo
                  paymentStatus={bookingData?.paymentStatus}
                  bookingStatus={bookingData?.bookingStatus}
                  holdExpiry={bookingData?.holdExpiry}
                  lastName={bookingData?.lastName}
                  isOneWay={bookingData?.isOneWay}
                  bookingData={data}
                  key={uniq()}
                  bottomDivider={index > 0}
                  labels={myBookingsAemData}
                  isUpcomingTrip
                  isPastTrip={false}
                  partnerPNR={data?.partnerPnr}
                  codeShare={codeShare}
                />
              ))}
            </div>
          </BookingCard>
        </div>
      );
    });
  };

  const completedJourneyTrip = (completedJourneys, i) => {
    return completedJourneys?.map((journey) => {
      const bookingData = createMyBookingsCardData(
        journey,
        myBookingsAemData,
        true,
      );
      const bookingRef = i === allBookings.length - paginationSizeNumber ? lastBookingListItemRef : null;
      return (
        <div className="mb-10" key={uniq()} ref={bookingRef}>
          <BookingCard
            bookingData={bookingData}
            labels={myBookingsAemData}
            isPastTrip
          >
            <div className="rounded-3">
              {bookingData?.bookingInfo?.map((data, index) => (
                <BookingInfo
                  paymentStatus={bookingData?.paymentStatus}
                  bookingStatus={bookingData?.bookingStatus}
                  holdExpiry={bookingData?.holdExpiry}
                  lastName={bookingData?.lastName}
                  isOneWay={bookingData?.isOneWay}
                  bookingData={data}
                  anyMultiNoShow={bookingData?.anyMultiNoShow}
                  key={uniq()}
                  bottomDivider={index > 0}
                  labels={myBookingsAemData}
                  isPastTrip
                  isUpcomingTrip={false}
                  partnerPNR={data?.partnerPnr}
                  codeShare={codeShare}
                />
              ))}
            </div>
          </BookingCard>
        </div>
      );
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (noBookingMsg) {
    return (
      <div className="mb-25">
        {!isAgent && <RoundedTabs activeTab={whichTab} list={list} variation="capsule" />}
        <Heading
          heading="h5"
          mobileHeading="h5"
          containerClass={`d-flex m-30 justify-content-center align-items-center ${isAgent && 'mt-10'}`}
        >
          {noBookingMsg}
        </Heading>
      </div>
    );
  }

  /* Agent Bookings - includes current, cancelled and completed bookings. */
  if (isAgent && allBookings.length) {
    return (
      <div className="pt-10">
        {/* all booking list */}
        {allBookings.map((allBooking, index) => {
          if (allBooking.bookingCategory === FLIGHT_BOOKING.CURRENT) {
            return currentJourneyTrips([allBooking], index);
          }
          if (allBooking.bookingCategory === FLIGHT_BOOKING.CANCELLED) {
            return cancelledJourneyTrips([allBooking], index);
          }
          return completedJourneyTrip([allBooking], index);
        })}
        {/* show more button */}
        {userType === AGENT && isShowMoreVisible ? (
          <div className="d-flex justify-content-center mb-8">
            <button
              className="align-items-center body-large-medium d-flex text-decoration-none
            text-primary-main text-uppercase show-more-button"
              onClick={onShowMorehandler}
              type="button"
            >
              <span className="text-decoration-underline">
                {showMoreBtnLabel}
              </span>
              <span className="icon-size-md icon-accordion-down-simple" />
            </button>
          </div>
        ) : null}
      </div>

    );
  }

  return (
    <div>
      <RoundedTabs activeTab={whichTab} list={list} variation="capsule" />
      {whichTab === list?.[0]?.title
        && currentJourneyTrips(currentJourney)}
      {whichTab === list?.[1]?.title && completedJourneyTrip(completedJourney)}
      {whichTab === list?.[2]?.title && cancelledJourneyTrips(cancelledJourney)}
    </div>
  );
};

export default FlightsBooking;
