import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import CheckBoxV2 from 'skyplus-design-system-app/dist/des-system/CheckBoxV2';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';

import analyticsEvent from '../../utils/analyticsEvent';

import PassengerSelectionItem from '../../components/PassengerSelection/PassengerSelectionItem';
import useAppContext from '../../hooks/useAppContext';
import { ANALTYTICS } from '../../constants';
import DisableCheckBox from '../../components/common/DisableCheckBox';

const { TRIGGER_EVENTS } = ANALTYTICS;

const PassengerSelection = ({
  passengersList,
  journeyKey,
  onUndoCheckin,
  selectedIndex,
  underCheckInWindow,
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
      selectAllPassengers: aemLabel(
        'checkinHome.selectPassengersForUndoWebCheckin.html',
      ),
      viewBoardingPassCtaTitle: aemLabel(
        'checkinHome.viewBoardingPassCtaTitle',
      ),
      viewBoardingPassLink: aemLabel('checkinHome.viewBoardingPassLink'),
      seatSelectionLink: aemLabel('checkinHome.seatSelectionLink'),
      smartWebCheckInCtaTitle: aemLabel('checkinHome.smartWebCheckInCtaTitle'),
      undoCheckInCtaTitle: aemLabel(
        'checkinHome.undoCheckInCtaTitle',
        'Undo Webcheckin',
      ),
      backToItineraryUrl: aemLabel('checkinHome.backToItineraryUrl'),
    };
  }, [aemLabel]);

  const passengers = passengersList;
  const passengersFiltered = passengers?.filter((p) => p.showPrintBoardingPass);

  const { availableForUndoCheckinPassengers } = useMemo(() => {
    return {
      availableForUndoCheckinPassengers: passengersFiltered.map(
        (p) => p.passengerKey,
      ),
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
      allSelected:
        newSelection.size === availableForUndoCheckinPassengers.length,
    });
  };

  const handleSelectAll = () => {
    setData((prevData) => ({
      ...prevData,
      selectedCheckinPasssengers: prevData.allSelected
        ? new Set()
        : new Set([...availableForUndoCheckinPassengers]),
      allSelected: !data.allSelected,
    }));
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

  return (
    <div className="wc-passenger-selection">
      <div className="wc-passenger-selection__header-section">
        <div className="wc-passenger-selection__header">
          <HtmlBlock html={aemLabels.selectAllPassengers} />
        </div>
        {passengersFiltered.length > 0 && underCheckInWindow && (
          <CheckBoxV2
            id="select-all-passengers"
            name="select-all-passengers"
            checked={data.allSelected}
            onChangeHandler={handleSelectAll}
          />
        )}
        {(passengersFiltered.length === 0 || !underCheckInWindow) && (
          <DisableCheckBox />
        )}
      </div>
      {passengers.map((passenger, index) => (
        <PassengerSelectionItem
          key={passenger.passengerKey}
          passenger={passenger}
          passengerKey={passenger.passengerKey}
          onChange={handleCheckChange}
          checked={data.selectedCheckinPasssengers.has(passenger.passengerKey)}
          lastChild={passengersList.length === index + 1}
          journeyKey={journeyKey}
          showCheckBox={passenger.showPrintBoardingPass}
          undoCheckin
          checkinClosed={!underCheckInWindow}
        />
      ))}

      <div className="mt-6" />

      {underCheckInWindow && (
        <Button
          block
          containerClass="mt-6"
          onClick={onClickUndoWebcheckin}
          disabled={data.selectedCheckinPasssengers.size === 0}
        >
          {aemLabels.undoCheckInCtaTitle}
        </Button>
      )}

      {!underCheckInWindow && (
        <Button block containerClass="mt-6" onClick={() => {}} disabled>
          {aemLabels.undoCheckInCtaTitle}
        </Button>
      )}
    </div>
  );
};

PassengerSelection.propTypes = {
  journeyKey: PropTypes.any,
  passengersList: PropTypes.array,
  onUndoCheckin: PropTypes.func,
  selectedIndex: PropTypes.number,
  underCheckInWindow: PropTypes.bool,
};

export default PassengerSelection;
