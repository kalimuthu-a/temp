import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import useIsMobileBooking from 'skyplus-design-system-app/dist/des-system/useIsMobileBooking';
import { TripTypes } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import isBefore from 'date-fns/isBefore';
import { differenceInCalendarDays } from 'date-fns';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import classnames from 'classnames';
import parse from 'html-react-parser';

import {
  Pages,
  PayWithModes,
} from 'skyplus-design-system-app/src/functions/globalConstants';
import { delay } from 'skyplus-design-system-app/dist/des-system/utils';
import CitySelector from './CitySelector/CitySelector';
import DateSelector from './DateSelector/DateSelector';
import PaxFareSelection from './PaxFareSelection/PaxFareSelection';
import useAppContext from '../../hooks/useAppContext';
import { FormContext } from './FormContext';
import { formActions } from './formReducer';
import { dateFormats, specialFareCodes, URLS } from '../../constants';
import { fetchFareCalendar } from '../../services';
import { specialFareListForContext } from '../../utils/specialFareUtils';

const { MULTI_CITY, ONE_WAY, ROUND } = TripTypes;
const { XPLORE } = Pages;

const DEFAULT_DATE_POPUP_PROPS = [
  { active: false, key: 'departureDate' },
  { active: false, key: 'returnDate' },
];

const JourneyRow = ({
  id,
  sourceCity,
  destinationCity,
  departureDate,
  arrivalDate,
  minDate,
  maxDate,
  minReturnDate,
  maxReturnDate,
}) => {
  const [isMobile] = useIsMobileBooking();
  const {
    state: { main, additional, isModificationFlow, pageType },
  } = useAppContext();

  const [isXplore, setIsXplore] = useState('search-widget-form-body');
  const [openDatePopover, setOpenDatePopover] = useState(false);
  const [isAnimationActive, setIsAnimationActive] = useState(true);
  const [selectedDatePickerPopup, setSelectedDatePickerPopup] = useState(DEFAULT_DATE_POPUP_PROPS);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsAnimationActive(false);
    }, 3000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (pageType === XPLORE) {
      setIsXplore('search-widget-form-body xplore_grid');
    } else {
      setIsXplore('search-widget-form-body');
    }
  }, [pageType]);

  const {
    formState: {
      triptype,
      journies,
      specialFares,
      currency,
      promocode,
      payWith,
    },
    dispatch,
  } = useContext(FormContext);

 const handleDateOpenPopover = (value, formKey, isPill = false) => {
  if (isMobile && pageType === 'homepage') {
    if (value && formKey === 'destinationCity') {
      setSelectedDatePickerPopup((prev) => {
        return [
         { ...prev[0], active: true },
         { ...prev[1], active: false },
        ];
      });
    } else if (formKey === 'departureDate' && triptype.value === ROUND && !isPill) {
      setSelectedDatePickerPopup((prev) => {
        return [
         { ...prev[0], active: false },
         { ...prev[1], active: true },
        ];
      });
    } else if (formKey === 'arrivalDate' && triptype.value === ROUND && isPill) {
      setSelectedDatePickerPopup((prev) => {
        return [
         { ...prev[0], active: false },
         { ...prev[1], active: true },
        ];
      });
    } else if (formKey === 'departureDate' && triptype.value === ROUND && isPill) {
      setSelectedDatePickerPopup((prev) => {
        return [
         { ...prev[0], active: true },
         { ...prev[1], active: false },
        ];
      });
    }
   }
  };

  const handleClickOutside = async (event) => {
  await delay(0.2);

  const target = event?.target;
  const classList = target?.classList;

  const shouldResetPopup = ['accept-cookies__block--btn', 'icon-close', 'icon-circle']
    .some((className) => classList?.contains(className));
    if (shouldResetPopup) {
      setSelectedDatePickerPopup(DEFAULT_DATE_POPUP_PROPS);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, []);

  const onClickRemove = () => {
    if (isModificationFlow) {
      return;
    }
    const nextRow = journies[id + 1];
    const prevRow = journies[id - 1];
    if (nextRow && prevRow) {
      nextRow.minDate = prevRow.departureDate;
    }

    const newJournies = [
      ...journies.slice(0, id),
      nextRow,
      ...journies.slice(id + 2),
    ].filter((r) => Boolean(r));

    const { isInternational } = specialFareListForContext([], newJournies, '');

    dispatch({
      type: formActions.REMOVE_JORNEY_ITEM,
      payload: {
        identicalDestinationsErrorMessage:
          additional.identicalDestinationsErrorMessage,
        journies: newJournies,
        isInternational,
      },
    });
  };

  const switchJourney = () => {
    dispatch({
      type: formActions.CHANGE_JOURNEY_ROW_ITEM,
      payload: {
        index: id,
        objData: { sourceCity: destinationCity, destinationCity: sourceCity },
        identicalDestinationsErrorMessage:
          additional.identicalDestinationsErrorMessage,
      },
    });
  };

  const onChangeReturnDate = (key, index, value) => {
    dispatch({
      type: formActions.CHANGE_JOURNEY_ROW_ITEM,
      payload: {
        index,
        objData: { [key]: value },
        identicalDestinationsErrorMessage:
          additional.identicalDestinationsErrorMessage,
      },
    });

    dispatch({
      type: formActions.CHANGE_FORM_ITEM,
      payload: {
        triptype: {
          journeyTypeCode: 'RoundTrip',
          journeyTypeLabel: 'Round Trip',
          label: 'Round Trip',
          value: TripTypes.ROUND,
        },
      },
    });

    if (isMobile) {
      setSelectedDatePickerPopup((prev) => {
      return [
       { ...prev[0], active: false },
       { ...prev[1], active: false },
        ];
      });
    }
  };

  const onChangeDepartureDate = (key, index, value) => {
    const currentRow = journies[index];
    currentRow.departureDate = value;
    // currentRow.minReturnDate = value;

    if (currentRow.arrivalDate && isBefore(currentRow.arrivalDate, value)) {
      currentRow.arrivalDate = value;
    }

    const rowsBefore = journies.slice(0, index);

    const rowsAfter = [];
    journies.slice(index + 1).forEach((row, i) => {
      const isBeforeDate = isBefore(
        row.departureDate,
        currentRow.departureDate,
      );

      let prevRowDepature;

      const prevRow = rowsAfter[i - 1];
      if (prevRow) {
        prevRowDepature = prevRow.departureDate;
      }

      rowsAfter[i] = {
        ...row,
        ...(prevRowDepature && { minDate: prevRowDepature }),
        ...(isBeforeDate && {
          departureDate: currentRow.departureDate,
        }),
        minDate: currentRow.departureDate,
      };
    });

    const journiesData = [
      ...rowsBefore,
      {
        ...currentRow,
        [key]: value,
      },
      ...rowsAfter,
    ];

    const firstSegment = journiesData[0];
    const data = specialFares?.filter(
      (row) => row.specialFareCode === specialFareCodes.VAXI,
    );
    const isBefore7DaysDepature =
      differenceInCalendarDays(firstSegment?.departureDate, new Date()) < data?.[0]?.bookingAllowedAfterDays &&
      specialFares.findIndex(
        (row) => row.specialFareCode === specialFareCodes.VAXI,
      ) !== -1;

    const specialFaresContxt = specialFareListForContext(
      specialFares,
      journiesData,
      triptype.journeyTypeCode,
    );

    dispatch({
      type: formActions.CHANGE_FORM_ITEM,
      payload: {
        identicalDestinationsErrorMessage:
          additional.identicalDestinationsErrorMessage,
        journies: journiesData,
        specialFares: specialFaresContxt.specialFaresList,
        sixEExclusiveError: isBefore7DaysDepature
          ? additional.beforeWeek6EExclusiveError?.html
          : '',
      },
    });

    if (isMobile && index === 0) {
      if (triptype.value === TripTypes.ROUND) {
        setSelectedDatePickerPopup((prev) => {
          return [
           { ...prev[0], active: false },
           { ...prev[1], active: true },
          ];
        });
      } else if (triptype?.value === TripTypes.ONE_WAY || triptype?.value === TripTypes.MULTI_CITY) {
        setSelectedDatePickerPopup(DEFAULT_DATE_POPUP_PROPS);
      }
    }
  };

  const onChangeJourneyElement = async (key, index, value) => {
    dispatch({
      type: formActions.CHANGE_JOURNEY_ROW_ITEM,
      payload: {
        index,
        objData: { [key]: value },
        identicalDestinationsErrorMessage:
          additional.identicalDestinationsErrorMessage,
      },
    });

    if (key === 'destinationCity') {
      const payloadForFareCalendar = {
        startDate: format(departureDate, dateFormats.yyyyMMdd),
        endDate: format(addDays(departureDate, 62), dateFormats.yyyyMMdd),
        origin: sourceCity?.stationCode,
        destination: value?.stationCode,
        currencyCode: currency.currencyCode,
        promoCode: promocode?.indigoCode || promocode?.card,
        lowestIn: 'M',
      };

      await fetchFareCalendar(payloadForFareCalendar);
    }
  };

  const handlePopupStateUpdate = (key) => {
    if (isMobile) {
      return selectedDatePickerPopup?.find((val) => val?.active && val?.key === key)?.active || false;
    }
    return false;
  };

  return (
    <div
      className={`journey-row ${
        MULTI_CITY === triptype.value ? 'multicity-row' : ''
      }`}
    >
      <div className="panel-header">
        {`${additional.flightLabel} ${id + 1}`}
        {id !== 0 && (
          <Icon
            className="icon-close-circle"
            size="lg"
            onClick={onClickRemove}
          />
        )}
      </div>
      <div className={isXplore} key={id}>
        <CitySelector
          containerClass={`search-widget-form-body__from d-flex align-items-center justify-content-between ${
            isModificationFlow ? 'disabled' : ''
          }`}
          topLabel={main.fromSectionLabel}
          middleLabel={main.flyingFromLabel}
          hintLabel={main.searchByLabel}
          geoLocationOption
          onSelect={onChangeJourneyElement}
          formKey="sourceCity"
          index={id}
          cityToExclude={[destinationCity]}
          enabledSwitchJourney={Boolean(sourceCity) && Boolean(destinationCity)}
          switchJourney={switchJourney}
          handleDateOpenPopover={handleDateOpenPopover}
        />
        {pageType !== XPLORE && (
          <CitySelector
            containerClass={`search-widget-form-body__to ${
              isModificationFlow ? 'disabled' : ''
            }`}
            topLabel={main.toSectionLabel}
            middleLabel={main.goingToLabel}
            hintLabel={main.searchByLabel}
            onSelect={onChangeJourneyElement}
            formKey="destinationCity"
            index={id}
            cityToExclude={[sourceCity]}
            handleDateOpenPopover={handleDateOpenPopover}
          />
        )}

        <DateSelector
          containerClass={classnames({
            'search-widget-form-body__departure': true,
            'full-grid': MULTI_CITY === triptype.value,
            [`layout-${URLS.displayCalenderMonths}`]: true,
          })}
          topLabel={main.departureDateLabel}
          middleLabel={main.dateLabel}
          hintLabel={main.departureSectionLabel}
          onSelect={onChangeDepartureDate}
          formKey="departureDate"
          index={id}
          value={departureDate}
          calendarProps={{
            date: departureDate,
            minDate,
            maxDate,
            ranges: [
              {
                startDate: departureDate,
                endDate: isMobile ? departureDate : arrivalDate || departureDate,
                key: 'selection',
              },
            ],
          }}
          sourceCity={sourceCity}
          destinationCity={destinationCity}
          openDatePopover={handlePopupStateUpdate('departureDate')}
          handleDateOpenPopover={handleDateOpenPopover}
        />

        {triptype.value !== MULTI_CITY && (
          <DateSelector
            containerClass={classnames({
              'search-widget-form-body__return': true,
              disabled:
                (isModificationFlow && triptype.value === ONE_WAY) ||
                payWith !== PayWithModes.CASH,
              [`layout-${URLS.displayCalenderMonths}`]: true,
              'animation-on-return': isAnimationActive,
            })}
            topLabel={main.returnSectionLabel}
            middleLabel={
              currency.currencyCode === 'INR' ? '' : main.saveMoreLabel
            }
            hintLabel={
              currency.currencyCode === 'INR'
                ? parse(main?.returnDomesticLabel?.html || "")
                : main.arrivalDateLabel
            }
            onSelect={onChangeReturnDate}
            formKey="arrivalDate"
            index={id}
            value={arrivalDate}
            sourceCity={sourceCity}
            destinationCity={destinationCity}
            handleDateOpenPopover={handleDateOpenPopover}
            calendarProps={{
              date: isMobile ? arrivalDate : arrivalDate || departureDate,
              minDate: minReturnDate || departureDate,
              maxDate: maxReturnDate || maxDate,
              ranges: [
                {
                  startDate: isMobile ? arrivalDate : departureDate,
                  endDate: isMobile ? arrivalDate : arrivalDate || departureDate,
                  key: 'selection',
                },
              ],
            }}
            openDatePopover={handlePopupStateUpdate('returnDate')}
          />
        )}

        {!isMobile && id === 0 && (
          <PaxFareSelection />
        )}

        {id !== 0 && !isMobile && (
          <div
            className="search-widget-form-body__pax-fare-selection d-flex justify-content-center"
            onClick={onClickRemove}
            role="presentation"
            tabIndex={isModificationFlow ? -1 : 0}
          >
            {!isModificationFlow && <Icon className="icon-minus delete-icon" />}
          </div>
        )}
      </div>
    </div>
  );
};

JourneyRow.propTypes = {
  destinationCity: PropTypes.any,
  id: PropTypes.number,
  sourceCity: PropTypes.any,
  departureDate: PropTypes.any,
  arrivalDate: PropTypes.any,
  minDate: PropTypes.any,
  maxDate: PropTypes.any,
  minReturnDate: PropTypes.any,
  maxReturnDate: PropTypes.any,
};

export default JourneyRow;
