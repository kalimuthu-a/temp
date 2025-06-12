import React, { useContext, useMemo, useRef, useState } from 'react';
// import PropTypes from 'prop-types';
// import Loader from '../../../components/common/Loader/Loader';
// import RoundedTabs from '../../../components/common/RoundedTabs/RoundedTabs';
import MyBookingsContext from '../MyBookingsContext';
import HotelItem from './HotelItem';

const NUMBER_ITEM_PER_LOAD = 7;

const HotelsBooking = () => {
  const {
    state: {
      myHotelBookingsData = {}, // Set a default value here
      myBookingsAemData = {},
    },
  } = useContext(MyBookingsContext);

  const [filters, setFilters] = useState({
    displayStatus: 'All',
  });
  const [currentCount, setCurrentCount] = useState(NUMBER_ITEM_PER_LOAD);
  const containerRef = useRef(null);
  const _aem = myBookingsAemData || {};
  const tripTypes = useMemo(() => {
    return [
      {
        key: 'all',
        label: _aem?.allTrips || 'All', // to do
        displayStatus: 'All',
      },
      {
        key: 'upcoming',
        label: _aem?.upcomingBookingsLabel || 'Upcoming',
        displayStatus: 'Upcoming',
      },
      {
        key: 'completed',
        label: _aem?.pastBookingsLabel || 'Past',
        displayStatus: 'Completed',
      },
      {
        key: 'cancelled',
        label: _aem?.cancelledBookingsLabel || 'Cancelled',
        displayStatus: 'Cancelled',
      },
    ];
  }, []);

  const onClickHandler = (e) => {
    const dataset = e.currentTarget?.dataset;
    setCurrentCount(NUMBER_ITEM_PER_LOAD);
    setFilters((prev) => ({
      ...prev,
      displayStatus: dataset.id,
    }));
  };

  const filteredHotel = Array.isArray(myHotelBookingsData)
    ? myHotelBookingsData?.filter((hotel) => (filters.displayStatus !== 'All'
      ? hotel.displayStatus.toLowerCase() === filters.displayStatus.toLowerCase()
      : true)) : [];
  const currentViewableList = filteredHotel?.slice(0, currentCount) || [];
  const noresultStr = myBookingsAemData?.noBookingFound;
  const isShowMoreRequired = filteredHotel?.length > currentViewableList?.length;

  const onClickShowMore = () => {
    setCurrentCount(filteredHotel?.length);
  };

  return (
    <div ref={containerRef}>
      <ul className="trips-status-filter align-items-center d-flex p-2 gap-4 mt-16 mb-6 my-md-10 overflow-auto">
        {tripTypes.map(({ label, key, displayStatus }) => (
          <li
            className="bg-primary-main cursor-pointer   rounded-pill text-center"
            key={key}
          >
            <button
              type="button"
              name="Upcoming Trips"
              className={`rounded-pill px-6 py-4
                tags-small d-block w-100 h-100 
                text-nowrap${
                  displayStatus === filters.displayStatus
                    ? ' bg-secondary-light border-secondary text-primary'
                    : ' bg-white border-primary text-secondary'
                }`}
              onClick={onClickHandler}
              data-id={displayStatus}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>

      {currentViewableList?.map((i, index) => (
        <React.Fragment key={i?.bookingId}>
          <HotelItem
            hotelBookingData={i}
            key={i?.orderId}
            _aem={_aem}
            className={
                !isShowMoreRequired && (index === ((currentViewableList?.length || 0) - 1))
                  ? 'hotel-card-last-item' : ''
              }
          />
        </React.Fragment>
      ))}
      {currentViewableList?.length < 1 && (
        <div className="skyplus-heading d-flex m-30 justify-content-center align-items-center false h5">{noresultStr}</div>
      )}
      { !!isShowMoreRequired && (
      <button type="button" onClick={onClickShowMore} className="btn-link showmore-hotel-items">
        <span>{_aem?.showMoreLabel+' '}</span>
        <i className="icon-accordion-down-simple" />
      </button>
      )}
    </div>
  );
};

HotelsBooking.propTypes = {};

export default HotelsBooking;
