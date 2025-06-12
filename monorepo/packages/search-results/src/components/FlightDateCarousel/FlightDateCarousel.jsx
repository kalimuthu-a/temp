import React, { useEffect, useMemo, useRef } from 'react';
import SwiperComponent from 'skyplus-design-system-app/dist/des-system/SwiperComponent';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import isSameDay from 'date-fns/isSameDay';
import format from 'date-fns/format';
import get from 'lodash/get';
import merge from 'lodash/merge';

import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { useCustomEventDispatcher } from 'skyplus-design-system-app/dist/des-system/customEventHooks';
import PropTypes from 'prop-types';

import FlightDateCarouselItem from './FlightDateCarouselItem';

import { getAllDatesBetweenWithRestriction } from '../../utils/flight';
import useAppContext from '../../hooks/useAppContext';
import { ANALTYTICS, customEvents, dateFormats } from '../../constants';
import pushAnalytics from '../../utils/analyticsEvent';
import { searchFlight } from '../../services';
import { srpActions } from '../../context/reducer';
import { screenLiveAnnouncer } from '../../utils/a11y';
import { formatPoints } from '../../utils';

const FlightDateCarousel = ({
  segment,
  selectedTripIndex,
  swiperSelectorClass,
  containerClass,
  index,
}) => {
  const {
    state: {
      analyticsContext,
      searchContext,
      segments,
      segmentLoading,
      calendarResponses,
      isBurn,
      loyaltyAnalyticsData,
    },
    dispatch,
  } = useAppContext();

  const ref = useRef();

  // Dispatch Modify Date Search to notify booking widget date changes
  const dispatchModifyDate = useCustomEventDispatcher();

  const {
    selectedDate,
    departureDate,
    minDate,
    destination,
    origin,
    maxDate,
    calenderSelectedDate,
  } = segment;

  const [isMobile] = useIsMobile();

  const onClickDate = async (value) => {
    try {
      const contextSegments = searchContext.getSegment();
      let indexToReset = [selectedTripIndex];
      let resetRoundTrip = false;

      if (selectedTripIndex === 0 && searchContext.isRoundTrip()) {
        const returnDate = segments[1].selectedDate;
        const differenceInCalDays = differenceInCalendarDays(
          value.d,
          returnDate,
        );

        if (differenceInCalDays > -7) {
          if (differenceInCalDays > 0) {
            contextSegments[1].selectedDate = value.d;
            indexToReset = [0, 1];
          }
          resetRoundTrip = true;
        }
      }

      contextSegments[selectedTripIndex].selectedDate = value.d;
      searchContext.updateSearchContextFromCalender(
        contextSegments,
        resetRoundTrip,
      );

      dispatchModifyDate(customEvents.DATE_CHANGE_EVENT, {
        index: 0,
        date: new Date(value.d),
        dates: contextSegments.map((seg) => seg.selectedDate),
      });

      dispatch({ type: srpActions.SEGMENT_LOADING, payload: true });

      const payload = searchContext.getRequestpayload();

      const flightsData = await searchFlight(payload);

      dispatch({
        type: srpActions.SET_SEGMENT_API_DATA,
        payload: {
          trips: get(flightsData, ['data', 'trips'], []),
          date: value.d,
          indexToReset,
        },
      });
    } catch (error) {
      dispatch({ type: srpActions.SEGMENT_LOADING, payload: false });
    }
  };

  const onClickDateHandler = (e, date) => {
    if (segmentLoading) {
      return;
    }
    const selectedIndex =
      parseInt(e?.currentTarget?.parentElement?.ariaLabel?.split(' / '), 10) ||
      1;

    let position = 1;

    if (isMobile) {
      position = selectedIndex % 4 || 4;
    } else {
      position = selectedIndex % 7 || 7;
    }

    const onLoadLoyaltyAnaltyics = { ...loyaltyAnalyticsData.loyalty };
    delete onLoadLoyaltyAnaltyics.pointsBurned;
    delete onLoadLoyaltyAnaltyics.pointsEarned;

    pushAnalytics({
      event: ANALTYTICS.DATA_CAPTURE_EVENTS.ON_CLICK_CALENDAR,
      data: merge({
        productInfo: {
          ...analyticsContext.product.productInfo,
          daysUntilDeparture: differenceInCalendarDays(
            date.d,
            new Date(),
          ).toString(),
          departureDates: format(date.d, dateFormats.ddMMyyyy),
        },
        eventInfo: {
          name: format(date.d, dateFormats.EdMMM),
          position: position?.toString(),
        },
      }, { productInfo: loyaltyAnalyticsData.productInfo, loyalty: onLoadLoyaltyAnaltyics }),
    });

    e.currentTarget?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });

    onClickDate(date);
  };

  const swiperConfig = useMemo(() => {
    const { destinationCityName, originCityName } = segment;

    const firstSlideMessage = `Based on dates you can select Flight from ${originCityName} to ${destinationCityName}`;

    return {
      direction: 'horizontal',
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        enabled: !isMobile,
      },
      pagination: {
        enabled: false,
      },
      grid: {
        rows: 1,
        fill: 'column',
      },
      cssMode: true,
      observer: true,
      breakpoints: {
        768: {
          spaceBetween: 16,
          slidesPerView: 7,
        },
        375: {
          slidesPerView: 5,
          spaceBetween: 12,
        },
      },
      // centeredSlides: true,
      // slideToClickedSlide: true,
      // centeredSlidesBounds: true,
      a11y: {
        nextSlideMessage: 'Next Days Flights',
        prevSlideMessage: 'Previous Days Flights',
        firstSlideMessage,
        itemRoleDescriptionMessage: `Select flight from ${originCityName} to ${destinationCityName}`,
      },
    };
  }, []);

  const scrollListener = () => {
    const element = document.querySelector('.flight-journey-tab-container');

    const hide = element?.getBoundingClientRect().top <= 30;

    document.querySelector('.flight-date-slider').style.display = hide
      ? 'none'
      : 'block';
  };

  const dates = useMemo(() => {
    return getAllDatesBetweenWithRestriction(
      minDate,
      maxDate,
      calenderSelectedDate,
    );
  }, [departureDate]);

  const onSlideChange = (e) => {
    const { activeIndex: dateIndex } = e;
    const date = dates[dateIndex];

    const { destinationCityName, originCityName } = segment;
    const ariaLabel = `Select Flight from ${originCityName} to ${destinationCityName} on ${format(
      date.d,
      dateFormats.EdMMM,
    )}`;

    screenLiveAnnouncer(ariaLabel);
  };

  useEffect(() => {
    document.addEventListener('scroll', scrollListener);
    ref.current.swiper.current.on('slideChange', onSlideChange);

    return () => {
      document.removeEventListener('scroll', scrollListener);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (index === selectedTripIndex) {
        const el = ref?.current?.swiper?.current?.el?.querySelector(
          '.flight-date-carousel-container__item.selected',
        );

        el?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }, 100);
  }, [selectedTripIndex]);

  const getPrice = (price, mileConversationRate, priceValue) => {
    if (isBurn && mileConversationRate) {
      const points = Math.round(priceValue / mileConversationRate);

      return points ? formatPoints(points) : points;
    }

    return price;
  };

  return (
    <SwiperComponent
      swiperSelectorClass={swiperSelectorClass}
      swiperConfig={swiperConfig}
      containerClass={containerClass}
      ref={ref}
      key={selectedTripIndex}
    >
      {dates.map((date) => {
        if (!date.d) {
          return null;
        }
        const dateFormat = format(date.d, dateFormats.yyyyMMdd);
        const calendarKey = `${origin}-${destination}-${dateFormat}`;

        const { price, category, priceValue, mileConversationRate } = calendarResponses.get(
          calendarKey,
        ) ?? {
          price: '--',
          category: '',
        };

        return (
          <SwiperComponent.Slide className="" key={date.d.toISOString()}>
            <FlightDateCarouselItem
              date={date}
              selected={isSameDay(selectedDate, date.d)}
              loading={false}
              onClickDate={onClickDateHandler}
              isHoliday={false}
              price={priceValue && priceValue > 0 ? getPrice(price, mileConversationRate, priceValue) : '--'}
              category={category}
              dateIndex={index}
              isBurn={isBurn}
            />
          </SwiperComponent.Slide>
        );
      })}
    </SwiperComponent>
  );
};

FlightDateCarousel.propTypes = {
  segment: PropTypes.object.isRequired,
  swiperSelectorClass: PropTypes.string.isRequired,
  selectedTripIndex: PropTypes.number.isRequired,
  containerClass: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

FlightDateCarousel.defaultProps = {};

export default FlightDateCarousel;
