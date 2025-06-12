import PropTypes from 'prop-types';
import React from 'react';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import classNames from 'classnames';
import format from 'date-fns/format';
import cloneDeep from 'lodash/cloneDeep';
import { formattedMessage } from 'skyplus-design-system-app/dist/des-system/utils';

import analyticsEvent from '../../utils/analyticsEvent';
import InfoAlert from '../common/Alerts/InfoAlert';
import { dateFormats, ANALTYTICS } from '../../constants';
import useAppContext from '../../hooks/useAppContext';

const { TRIGGER_EVENTS } = ANALTYTICS;

const FlightStatusInfo = ({
  isSchedule,
  webCheckInStatusMessages,
  isWebCheckinDoneForAnyPassenger,
  isUMNR,
  checkinClosed,
  checkinStartTime,
  smartCheckinDoneCount,
  isFlightFlown,
}) => {
  const {
    state: { analyticsContext },
  } = useAppContext();

  let obj = webCheckInStatusMessages.windowOpen || {
    title: '',
    description: { html: '' },
  };

  if (isSchedule) {
    obj = cloneDeep(webCheckInStatusMessages.scheduleCheckin);
    const description = obj?.description?.html;
    if (checkinStartTime && description) {
      obj.description.html = formattedMessage(description, {
        checkinStartDate: format(
          checkinStartTime,
          dateFormats.webcheckinstarts,
        ),
      });
    }
  }

  if (isWebCheckinDoneForAnyPassenger) {
    obj = webCheckInStatusMessages.undoCheckin;
  }

  if (isUMNR) {
    obj = webCheckInStatusMessages?.unaccompaniedMinor;
  }

  if (smartCheckinDoneCount > 0 && isSchedule) {
    obj = cloneDeep(webCheckInStatusMessages?.checkinScheduledForPax);
    if (obj) {
      obj.title = formattedMessage(obj?.title, {
        passenger: smartCheckinDoneCount,
      });
    }
  }

  if (checkinClosed) {
    obj = cloneDeep(webCheckInStatusMessages?.checkInClosed);
    if (obj) {
      obj.title = `${webCheckInStatusMessages?.checkInClosed.title} <span class="error">Closed</span>`;
    }
  }

  const containerClassName = classNames('checkin-status', {
    isumnr: isUMNR,
    isWebCheckinDoneForAnyPassenger,
    checkinClosed,
  });

  const onClickHandler = (e) => {
    e.preventDefault();

    if (e.target?.tagName?.toLowerCase() === 'a') {
      analyticsEvent({
        event: TRIGGER_EVENTS.WEB_CHECK_HOME_VIEW_UNDO_CHECKIN_CLICKED,
        data: {
          productInfo: analyticsContext.productInfo,
          bookingChannel: analyticsContext.bookingChannel,
        },
      });
      window.location.href = e.target.href;
    }
  };

  return (
    <InfoAlert containerClassName={containerClassName}>
      <span dangerouslySetInnerHTML={{ __html: obj?.title }} />
      {!isFlightFlown && (
        <HtmlBlock html={obj?.description?.html} onClick={onClickHandler} />
      )}
    </InfoAlert>
  );
};

FlightStatusInfo.propTypes = {
  isSchedule: PropTypes.any,
  isWebCheckinDoneForAnyPassenger: PropTypes.any,
  webCheckInStatusMessages: PropTypes.shape({
    scheduleCheckin: PropTypes.any,
    undoCheckin: PropTypes.any,
    windowOpen: PropTypes.any,
    unaccompaniedMinor: PropTypes.any,
    checkInClosed: PropTypes.any,
    checkinScheduledForPax: PropTypes.any,
  }),
  isUMNR: PropTypes.bool,
  checkinClosed: PropTypes.bool,
  checkinStartTime: PropTypes.string,
  isFlightFlown: PropTypes.bool,
  smartCheckinDoneCount: PropTypes.number,
};

export default FlightStatusInfo;
