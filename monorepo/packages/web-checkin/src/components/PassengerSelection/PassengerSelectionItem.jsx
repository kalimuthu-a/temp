/* eslint-disable indent */
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import CheckBoxV2 from 'skyplus-design-system-app/dist/des-system/CheckBoxV2';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import classNames from 'classnames';

import { getPassengerName } from '../../utils/functions';
import useAppContext from '../../hooks/useAppContext';
import InfoAlert from '../common/Alerts/InfoAlert';
import LocalStorage from '../../utils/LocalStorage';
import { localStorageKeys, ANALTYTICS } from '../../constants';
import analyticsEvent from '../../utils/analyticsEvent';
import DisableCheckBox from '../common/DisableCheckBox';

const { TRIGGER_EVENTS } = ANALTYTICS;

const PassengerSelectionItem = ({
  passenger,
  onChange,
  checked,
  passengerKey,
  lastChild,
  journeyKey,
  showCheckBox,
  undoCheckin = false,
  partialWebCheckin = false,
  isSchedule = false,
  checkinClosed = false,
}) => {
  const { id } = passenger;

  const {
    aemLabel,
    state: { analyticsContext },
  } = useAppContext();

  const onChangeHandler = () => {
    onChange(passengerKey);
  };

  const passngerIcon = useMemo(() => {
    const { name = {} } = passenger;
    return `${name?.first?.[0]}${name?.last?.[0]}`;
  }, []);

  const aemLabels = useMemo(() => {
    const passengerCheckInStatus = {};

    aemLabel('checkinHome.passengerCheckInStatus', []).forEach((status) => {
      const { key } = status;
      passengerCheckInStatus[key] = status;
    });

    return {
      viewBoardingPassLink: aemLabel('checkinHome.viewBoardingPassLink'),
      passengerCheckInStatus,
    };
  }, [aemLabel]);

  const { showPrintBoardingPass, isAutoCheckedin } = passenger;

  const className = classNames('wc-passenger-selection__item', { lastChild });

  const onViewBoardingPass = async () => {
    const payload = {
      journeyKey,
      segmentKeys: [],
      passengerKeys: [passengerKey],
    };

    LocalStorage.set(localStorageKeys.b_d_p, payload);
    window.location.href = aemLabels.viewBoardingPassLink;
  };

  const onClickSeatSelection = (e) => {
    e.preventDefault();

    if (e.target?.tagName?.toLowerCase() === 'a') {
      const payload = {
        journeyKey,
        segmentKeys: [],
        passengerKeys: [passengerKey],
        type: isSchedule ? 'schedule' : 'normal',
      };

      LocalStorage.set(localStorageKeys.c_p_d, payload);

      analyticsEvent({
        event: TRIGGER_EVENTS.WEB_CHECK_HOME_VIEW_SEAT_SELECT_CLICKED,
        data: {
          productInfo: analyticsContext.productInfo,
          bookingChannel: analyticsContext.bookingChannel,
        },
      });
    }
    window.location.href = e.target.href;
  };

  const showPartialWebhckeckin =
    partialWebCheckin && !showPrintBoardingPass && !isAutoCheckedin;

  const isSeatTaken =
    passenger?.segments[0]?.passengerSegment?.seats?.length > 0;

  return (
    <div className={className}>
      <div className="wc-passenger-selection__item__profile">
        <div className="d-flex">
          <div className="wc-passenger-selection__item__profile__icon">
            {passngerIcon}
          </div>
          <div className="wc-passenger-selection__item__profile__details d-flex flex-column justify-content-center">
            <h5>{getPassengerName(passenger)}</h5>
            {showPrintBoardingPass && (
              <Chip
                size="sm"
                containerClass="wc-flight-checkin__container__pnr-chip"
              >
                {aemLabels.passengerCheckInStatus?.boardingPassGenerated?.title}
              </Chip>
            )}
            {showPartialWebhckeckin && !partialWebCheckin && (
              <Chip
                size="sm"
                containerClass="wc-flight-checkin__container__pnr-chip partial-checkin"
              >
                {aemLabels.passengerCheckInStatus?.['Check-inPending']?.title}
              </Chip>
            )}
          </div>
        </div>

        {showPrintBoardingPass && !undoCheckin && (
          <Icon
            className="icon-accordion-left-24 cursor-pointer"
            onClick={onViewBoardingPass}
          />
        )}
        {showCheckBox && !checkinClosed && (
          <CheckBoxV2
            id={`checkbox-${id}`}
            name={`passenger-${id}`}
            checked={checked}
            onChangeHandler={onChangeHandler}
          />
        )}
        {(checkinClosed || !showPrintBoardingPass) && undoCheckin && (
          <DisableCheckBox />
        )}
        {checkinClosed && !showPrintBoardingPass && !undoCheckin && (
          <DisableCheckBox />
        )}
      </div>
      {isAutoCheckedin &&
        !checkinClosed &&
        !showPrintBoardingPass &&
        !isSchedule &&
        !isSeatTaken && (
          <InfoAlert containerClassName="checkin-scheduled" variation="green">
            <span>
              {
                aemLabels.passengerCheckInStatus?.['autoCheck-inScheduled']
                  ?.title
              }
            </span>
            <HtmlBlock
              html={
                aemLabels.passengerCheckInStatus?.['autoCheck-inScheduled']
                  ?.description?.html
              }
              onClick={onClickSeatSelection}
            />
          </InfoAlert>
        )}
      {isAutoCheckedin &&
        !checkinClosed &&
        !showPrintBoardingPass &&
        !isSchedule &&
        isSeatTaken && (
          <InfoAlert containerClassName="checkin-scheduled" variation="green">
            <span>
              {
                aemLabels.passengerCheckInStatus?.[
                  'checkin-inScheduled-withseat'
                ]?.title
              }
            </span>
            <HtmlBlock
              html={
                aemLabels.passengerCheckInStatus?.[
                  'checkin-inScheduled-withseat'
                ]?.description?.html
              }
              onClick={onClickSeatSelection}
            />
          </InfoAlert>
        )}
      {isAutoCheckedin && !showPrintBoardingPass && isSchedule && (
        <InfoAlert containerClassName="checkin-scheduled" variation="green">
          <span>
            {aemLabels.passengerCheckInStatus?.['check-inScheduled']?.title}
          </span>
          <HtmlBlock
            html={
              aemLabels.passengerCheckInStatus?.['check-inScheduled']
                ?.description?.html
            }
          />
        </InfoAlert>
      )}
    </div>
  );
};

PassengerSelectionItem.propTypes = {
  checked: PropTypes.bool,
  isAutoCheckedin: PropTypes.bool,
  isSchedule: PropTypes.bool,
  journeyKey: PropTypes.any,
  lastChild: PropTypes.any,
  onChange: PropTypes.func,
  partialWebCheckin: PropTypes.bool,
  passenger: PropTypes.shape({
    id: PropTypes.any,
    isAutoCheckedin: PropTypes.any,
    name: PropTypes.object,
    showPrintBoardingPass: PropTypes.any,
    segments: PropTypes.array,
  }),
  passengerKey: PropTypes.string,
  showCheckBox: PropTypes.bool,
  undoCheckin: PropTypes.bool,
  checkinClosed: PropTypes.bool,
};

export default PassengerSelectionItem;
