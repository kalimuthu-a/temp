import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import CheckBoxV2 from 'skyplus-design-system-app/dist/des-system/CheckBoxV2';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';

import analyticsEvent from '../../utils/analyticsEvent';

import PassengerSelectionItem from './PassengerSelectionItem';
import useAppContext from '../../hooks/useAppContext';
import LocalStorage from '../../utils/LocalStorage';
import {
  checkinTypes,
  localStorageKeys,
  ANALTYTICS,
  GTM_ANALTYTICS,
} from '../../constants';
import gtmEvents from '../../utils/gtmEvents';
import DisableCheckBox from '../common/DisableCheckBox';

const { TRIGGER_EVENTS } = ANALTYTICS;

const PassengerSelection = ({
  passengersList,
  journeyKey,
  isSchedule,
  isUndoCheckin,
  onUndoCheckin,
  selectedIndex,
  isUMNR = false,
  checkinClosed = false,
}) => {
  const [data, setData] = useState({
    disabled: true,
    selectedCheckinPasssengers: new Set(),
    allCheckInSelected: false,
    allBoardingSelected: false,
  });

  const {
    aemLabel,
    state: { analyticsContext },
  } = useAppContext();

  useEffect(() => {
    setData({
      disabled: true,
      selectedCheckinPasssengers: new Set(),
      allCheckInSelected: false,
      allBoardingSelected: false,
    });
  }, [selectedIndex]);

  const aemLabels = useMemo(() => {
    return {
      checkinCtaTitle: aemLabel('checkinHome.checkinCtaTitle'),
      checkinCtaLink: aemLabel('checkinHome.checkinCtaLink'),
      selectAllPassengers: aemLabel(
        'checkinHome.selectPassengersForWebCheckin.html',
      ),
      passengersTravelling: aemLabel(
        'checkinHome.passengersTravellingLabel.html',
      ),
      viewBoardingPassCtaTitle: aemLabel(
        'checkinHome.viewBoardingPassCtaTitle',
      ),
      viewBoardingPassLink: aemLabel('checkinHome.viewBoardingPassLink'),
      seatSelectionLink: aemLabel('checkinHome.checkinCtaLink'),
      smartWebCheckInCtaTitle: aemLabel('checkinHome.smartWebCheckInCtaTitle'),
      passengerTravelling: aemLabel('checkinHome.passengerTravelling'),
      undoCheckInCtaTitle: aemLabel('checkinHome.undoCheckInCtaTitle'),
      internationalCheckinError: aemLabel(
        'checkinHome.internationalCheckinError',
        'International check-in will be done at airport',
      ),
    };
  }, [aemLabel]);

  const {
    showViewBoardingPassButton,
    showCheckinButton,
    availableForCheckinPassengers,
    boardingPassPassengers,
    partialWebCheckin,
  } = useMemo(() => {
    let _showViewBoardingPassButton = false;
    let _showCheckinButton = false;

    const _availableForCheckinPassengers = [];
    const _boardingPassPassengers = [];

    passengersList.forEach((passenger) => {
      const { showPrintBoardingPass, isAutoCheckedin, passengerKey } =
        passenger;

      _showViewBoardingPassButton =
        showPrintBoardingPass || _showViewBoardingPassButton;

      _showCheckinButton =
        !(isAutoCheckedin || showPrintBoardingPass) || _showCheckinButton;

      if (isAutoCheckedin || showPrintBoardingPass) {
        // Not available for checkin
      } else {
        _availableForCheckinPassengers.push(passengerKey);
      }

      if (showPrintBoardingPass) {
        _boardingPassPassengers.push(passengerKey);
      }
    });

    return {
      showViewBoardingPassButton: _showViewBoardingPassButton,
      showCheckinButton: _showCheckinButton,
      availableForCheckinPassengers: _availableForCheckinPassengers,
      boardingPassPassengers: _boardingPassPassengers,
      partialWebCheckin:
        _availableForCheckinPassengers.length > 0 &&
        _availableForCheckinPassengers.length !== passengersList.length,
    };
  }, [selectedIndex]);

  const handleCheckChange = (id) => {
    const { selectedCheckinPasssengers } = data;
    const newSelection = new Set([...selectedCheckinPasssengers]);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }

    setData({
      disabled: newSelection.size === 0,
      selectedCheckinPasssengers: newSelection,
      allSelected: newSelection.size === availableForCheckinPassengers.length,
    });
  };

  const handleSelectAll = () => {
    setData((prevData) => ({
      ...prevData,
      selectedCheckinPasssengers: prevData.allSelected
        ? new Set()
        : new Set([...availableForCheckinPassengers]),
      allSelected: !data.allSelected,
    }));
  };

  const onViewBoardingPass = async () => {
    const payload = {
      journeyKey,
      segmentKeys: [],
      passengerKeys: boardingPassPassengers,
    };

    analyticsEvent({
      event: TRIGGER_EVENTS.WEB_CHECK_HOME_VIEW_BOARDING_PASS_CLICKED,
      data: {
        productInfo: analyticsContext.productInfo,
        bookingChannel: analyticsContext.bookingChannel,
      },
    });

    LocalStorage.set(localStorageKeys.b_d_p, payload);
    window.location.href = aemLabels.viewBoardingPassLink;
  };

  const onClickCheckIn = async () => {
    // if (isInternational) {
    //   dispatch({
    //     type: webcheckinActions.SET_TOAST,
    //     payload: {
    //       variation: 'Error',
    //       show: true,
    //       description: aemLabels.internationalCheckinError,
    //     },
    //   });

    //   return;
    // }

    const payload = {
      journeyKey,
      segmentKeys: [],
      passengerKeys: [...data.selectedCheckinPasssengers],
      type: isSchedule ? checkinTypes.SCHEDULE : checkinTypes.NORMAL,
    };

    analyticsEvent({
      event: isSchedule
        ? TRIGGER_EVENTS.WEB_CHECK_HOME_SCHEDULE_CHECK_IN_CLICKED
        : TRIGGER_EVENTS.WEB_CHECK_HOME_CHECK_IN_CLICKED,
      data: analyticsContext,
    });

    const otherInfo = analyticsContext.journies[journeyKey];

    gtmEvents({
      event: GTM_ANALTYTICS.EVENTS.CHECK_IN_INITIATE,
      data: {
        PNR: analyticsContext?.productInfo?.pnr,
        Airline: otherInfo?.Airline,
        click_text: isSchedule ? 'Schedule Check-in' : 'Check-in',
        OD: otherInfo?.OD,
        trip_type: analyticsContext?.productInfo?.tripType,
        pax_details: analyticsContext?.gtmData?.pax_details,
        departure_date: otherInfo?.departure_date,
        special_fare: analyticsContext?.productInfo?.specialFare,
        flight_sector: otherInfo?.flight_sector,
        days_until_departure: otherInfo?.daysUntilDeparture,
      },
    });

    LocalStorage.set(localStorageKeys.c_p_d, payload);
    window.location.href = aemLabels.checkinCtaLink;
  };

  const onClickUndoWebcheckin = () => {
    analyticsEvent({
      event: TRIGGER_EVENTS.WEB_CHECK_HOME_VIEW_UNDO_CHECKIN_CLICKED,
      data: {
        productInfo: analyticsContext.productInfo,
        bookingChannel: analyticsContext.bookingChannel,
      },
    });
    onUndoCheckin({ passengers: data.selectedCheckinPasssengers, journeyKey });
  };

  const isEveryPassengerCheckedIn = passengersList?.every(pax=>pax?.isAutoCheckedin)
  return (
    <div className="wc-passenger-selection">
      <div className="wc-passenger-selection__header-section">
        <div className="wc-passenger-selection__header">
          <HtmlBlock html={!isEveryPassengerCheckedIn ? aemLabels?.selectAllPassengers : aemLabels?.passengersTravelling} />
        </div>
        {showCheckinButton && !checkinClosed && !isUMNR && (
          <CheckBoxV2
            id="select-all-passengers"
            name="select-all-passengers"
            checked={data.allSelected}
            onChangeHandler={handleSelectAll}
          />
        )}
        {checkinClosed && <DisableCheckBox />}
      </div>
      {passengersList.map((passenger, index) => {
        const { showPrintBoardingPass, isAutoCheckedin } = passenger;

        return (
          <PassengerSelectionItem
            key={passenger.passengerKey}
            passenger={passenger}
            passengerKey={passenger.passengerKey}
            onChange={handleCheckChange}
            checked={data.selectedCheckinPasssengers.has(
              passenger.passengerKey,
            )}
            lastChild={passengersList.length === index + 1}
            journeyKey={journeyKey}
            showCheckBox={!showPrintBoardingPass && !isAutoCheckedin && !isUMNR}
            partialWebCheckin={partialWebCheckin}
            isSchedule={isSchedule}
            checkinClosed={checkinClosed}
          />
        );
      })}

      <div className="mt-6" />
      {showCheckinButton && !isUndoCheckin && !checkinClosed && (
        <Button
          block
          containerClass="mt-6"
          onClick={onClickCheckIn}
          disabled={data.selectedCheckinPasssengers.size === 0}
        >
          {isSchedule
            ? aemLabels.smartWebCheckInCtaTitle
            : aemLabels.checkinCtaTitle}
        </Button>
      )}

      {isUndoCheckin && !checkinClosed && (
        <Button
          block
          containerClass="mt-6"
          onClick={onClickUndoWebcheckin}
          disabled={data.selectedCheckinPasssengers.size === 0}
        >
          {aemLabels.undoCheckInCtaTitle}
        </Button>
      )}
      {showViewBoardingPassButton && !checkinClosed && !isUndoCheckin && (
        <Button
          block
          variant="outline"
          containerClass="mt-6"
          onClick={onViewBoardingPass}
        >
          {aemLabels.viewBoardingPassCtaTitle}
        </Button>
      )}

      {checkinClosed && (
        <Button block containerClass="mt-6" onClick={() => {}} disabled>
          {aemLabels.checkinCtaTitle}
        </Button>
      )}
    </div>
  );
};

PassengerSelection.propTypes = {
  checkinClosed: PropTypes.bool,
  isSchedule: PropTypes.bool,
  isUMNR: PropTypes.bool,
  isUndoCheckin: PropTypes.bool,
  journeyKey: PropTypes.any,
  onUndoCheckin: PropTypes.func,
  passengersList: PropTypes.array,
  selectedIndex: PropTypes.number,
};

export default PassengerSelection;
