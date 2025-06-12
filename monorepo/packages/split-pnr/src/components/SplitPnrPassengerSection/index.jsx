import React from 'react';
import PropTypes from 'prop-types';
import PassengerSelectTile from '../PassengerSelectTile';

const SplitPnrPassengerSection = ({ isCheckBox, passengerList }) => {
  if (!passengerList?.length) return null;
  return (
    <div className="passenger_selection_section">
      {passengerList?.map?.((el) => (
        <PassengerSelectTile
          key={el?.passengerKey}
          passengerName={el?.passengerName}
          passengerChars={el?.passengerChars}
          passengerKey={el?.passengerKey}
          passengerInfo={el?.passengerInfo}
          infant={el?.infant}
          isCheckBox={isCheckBox}
        />
      ))}
    </div>
  );
};

SplitPnrPassengerSection.propTypes = {
  isCheckBox: PropTypes.bool,
  passengerList: PropTypes.array,
};

export default SplitPnrPassengerSection;
