import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useSeatMapContext } from '../../store/seat-map-context';
import { getErrorCodeForMandatorySeat } from '../../utils';

import './SeatMessage.scss';

function SeatMessage({ isSeatAssignedToPax }) {
  const {
    journeysDetail,
    segmentData,
    seatMainAemData: {
      preferredSeatSelectionNoteLabel = '',
      preferredSeatSelectionDescription = '',
    } = {},
    isModifyFlow,
    isCheckInFlow,
  } = useSeatMapContext();
  const [isSaver, setIsSaver] = useState(true);

  useEffect(() => {
    const { isMandatorySeat } = getErrorCodeForMandatorySeat(
      journeysDetail,
      segmentData,
    );
    const modificationFlow = (isModifyFlow?.enable || isCheckInFlow?.enable) && isSeatAssignedToPax;

    if (isMandatorySeat || modificationFlow) {
      setIsSaver(false);
    }
  }, []);

  if (!isSaver) {
    return null;
  }

  return (
    <div className="seat-message-contaner">
      <h4>{preferredSeatSelectionNoteLabel}</h4>
      <p>{preferredSeatSelectionDescription}</p>
    </div>
  );
}

SeatMessage.propTypes = {
  isSeatAssignedToPax: PropTypes.bool,
};

SeatMessage.defaultProps = {
  isSeatAssignedToPax: false,
};

export default SeatMessage;
