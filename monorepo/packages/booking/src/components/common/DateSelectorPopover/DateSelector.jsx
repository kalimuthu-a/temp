/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import useIsMobileBooking from 'skyplus-design-system-app/dist/des-system/useIsMobileBooking';
import { emptyFn } from 'skyplus-design-system-app/dist/des-system/utils';
import format from 'date-fns/format';
import subDays from 'date-fns/subDays';
import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import isBefore from 'date-fns/isBefore';
import startOfMonth from 'date-fns/startOfMonth';
import { PayWithModes } from 'skyplus-design-system-app/src/functions/globalConstants';
import { DateRange as Calendar } from 'react-date-range';
import DayContentRenderer from './DayContentRenderer';
import Pill from '../Pill/Pill';
import useAppContext from '../../../hooks/useAppContext';
import { dateFormats, URLS } from '../../../constants';
import { FormContext } from '../../Form/FormContext';
import { formActions } from '../../Form/formReducer';
import { fetchFareCalendar } from '../../../services';
import CalendarResponseService from '../../../services/calendar.response';

const DateSelector = ({
  legs = [],
  onChangeDate,
  onClickPillHandler,
  formKey,
  sourceCity,
  destinationCity,
  payWith,
  returnOfferDescriptionLabel,
  ...calendarProps
}) => {
  const [isMobile] = useIsMobileBooking();
  const [calendarResponse, setCalendarResponse] = useState({
    data: {},
    loading: false,
  });

  const {
    state: { additional, widgetsModel, pageType, main },
  } = useAppContext();

  const {
    dispatch,
    formState: { currency, promocode },
  } = useContext(FormContext);

  const onChange = (date) => {
    onChangeDate({ value: date });
  };

  const selectedLeg = legs.find((leg) => leg.active) || {};

  const tripTypesItems = useMemo(() => {
    const { journeysAllowed } = widgetsModel;

    return widgetsModel.getTripTypes(journeysAllowed);
  }, []);

  const getFareCalendarPrice = async ({
    startDate,
    endDate,
    loading = true,
  }) => {
    const payloadForFareCalendar = {
      startDate: format(startDate, dateFormats.yyyyMMdd),
      endDate: format(endDate, dateFormats.yyyyMMdd),
      origin: sourceCity?.stationCode,
      destination: destinationCity?.stationCode,
      currencyCode: currency.currencyCode || 'INR',
      promoCode: promocode?.indigoCode || promocode?.card,
      lowestIn: 'M',
    };

    if (formKey === 'arrivalDate') {
      payloadForFareCalendar.origin = destinationCity?.stationCode;
      payloadForFareCalendar.destination = sourceCity?.stationCode;
    }

    if (!payloadForFareCalendar.origin || !payloadForFareCalendar.destination) {
      return;
    }

    setCalendarResponse((prevResponse) => ({ ...prevResponse, loading }));
    if (payWith === PayWithModes.CASH) {
      await fetchFareCalendar(payloadForFareCalendar);
      setCalendarResponse((prevResponse) => ({
        ...prevResponse,
        loading: false,
      }));
    }
  };

  const onShownDateChange = async (startDate) => {
    const endDate = subDays(addMonths(startDate, 2), 1);
    const startDateBefore = subDays(startDate, 1);
    await getFareCalendarPrice({ startDate: startDateBefore, endDate });
  };

  useEffect(() => {
    if (formKey === 'arrivalDate' && isMobile) {
      const item = tripTypesItems.find((row) => row.value === 'roundTrip');
      dispatch({ type: formActions.CHANGE_TRIP_TYPE, payload: item });
    }

    let startDate = startOfMonth(calendarProps.date || calendarProps.minDate);

    if (isBefore(startDate, new Date())) {
      startDate = new Date();
    }

    let { stationCode: oStationCode = '' } = sourceCity ?? {};
    let { stationCode: dStationCode = '' } = destinationCity ?? {};

    if (formKey === 'arrivalDate') {
      [dStationCode, oStationCode] = [oStationCode, dStationCode];
    }

    if (oStationCode && dStationCode) {
      const key = `${oStationCode}-${dStationCode}`;
      const response = CalendarResponseService.getResponse(key);

      setCalendarResponse({
        data: { ...calendarResponse.data, [key]: response },
        loading: false,
      });
    }

    const calenderDataChangeEventListener = (event) => {
      const { value, origin, destination } = event.detail;
      const keytoFetch = `${origin}-${destination}`;

      setCalendarResponse({
        data: { ...calendarResponse.data, [keytoFetch]: value },
        loading: false,
      });
    };

    getFareCalendarPrice({
      startDate: subDays(startDate, 1),
      endDate: addDays(startDate, 62),
      loading: false,
    });

    document.addEventListener(
      'setCalendarResponse',
      calenderDataChangeEventListener,
    );

    return () => {
      document.removeEventListener(
        'setCalendarResponse',
        calenderDataChangeEventListener,
      );
    };
  }, [formKey]);

  const calendarAllProps = {
    ...calendarProps,
    direction: 'horizontal',
    months: URLS.displayCalenderMonths,
    editableDateInputs: true,
    ...(isMobile && { months: 1, ...selectedLeg }),
  };

  const getSelectedDateLabel = () => {
    return selectedLeg?.index ? main.labelSelectReturn : additional.selectDepartureDateLabel;
  };

  return (
    <div className="date-selection">
      <div className="date-selection-header">
        <Heading heading="h5 text-center pt-12">
          {getSelectedDateLabel()}
        </Heading>
        {legs.length > 0 && (
          <div className="date-selection-header-pill rounded-4">
            {legs.map((leg) => (
              <Pill
                key={leg.index}
                index={leg.index}
                active={leg.active}
                onClickHandler={onClickPillHandler}
                className="journey-pill"
              >
                <span>{leg.origin}</span>
                <span>{leg.destination}</span>
              </Pill>
            ))}
          </div>
        )}
      </div>
      <Calendar
        className="skyplus-calendar"
        showMonthAndYearPickers={false}
        dayContentRenderer={(date) => {
          let key = `${sourceCity?.stationCode}-${destinationCity?.stationCode}`;

          if (formKey === 'arrivalDate') {
            key = `${destinationCity?.stationCode}-${sourceCity?.stationCode}`;
          }
          const calResponse = calendarResponse.data[key] || new Map();

          return DayContentRenderer(
            date,
            additional.holidayList,
            calResponse,
            calendarResponse.loading,
            payWith,
            pageType,
          );
        }}
        onChange={onChange}
        monthDisplayFormat={dateFormats.MMMMyyyy}
        onShownDateChange={onShownDateChange}
        {...calendarAllProps}
      />
      {returnOfferDescriptionLabel ?? <></>}
      <div className="mt-8" />
    </div>
  );
};

DateSelector.propTypes = {
  legs: PropTypes.array,
  onChangeDate: PropTypes.func,
  onClickPillHandler: PropTypes.func,
  formKey: PropTypes.string,
  sourceCity: PropTypes.any,
  destinationCity: PropTypes.any,
  payWith: PropTypes.any,
  returnOfferDescriptionLabel: PropTypes.any
};

DateSelector.defaultPros = {
  onClickPillHandler: emptyFn,
};

export default DateSelector;
