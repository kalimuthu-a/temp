import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import useAppContext from '../../hooks/useAppContext';
import PassengerSelectTile from '../PassengerSelectTile';

import { splitPnrActions } from '../../context/reducer';

const PassengerSelectionSection = ({ passengerList, isCheckBoxDisabled }) => {
  if (!passengerList?.length) return null;

  const {
    state: { selectedPassengersList, main },
    dispatch,
  } = useAppContext();

  const onPassengerSelect = useCallback((isCheckVal, passengerKey) => {
    if (isCheckVal) {
      dispatch({
        type: splitPnrActions.UPDATE_SELECTED_PASSENGERS,
        payload: [...selectedPassengersList, passengerKey],
      });
    } else {
      dispatch({
        type: splitPnrActions.UPDATE_SELECTED_PASSENGERS,
        payload: selectedPassengersList.filter((passengerId) => passengerId !== passengerKey),
      });
    }
  }, [selectedPassengersList]);

  return (
    <div className="passenger_selection_section">
      {passengerList?.map?.((el) => (
        <PassengerSelectTile
          key={el?.passengerKey}
          {...el}
          isCheckBox={el?.isCheckBox}
          onCheckHandler={onPassengerSelect}
          childNote={main?.parentChildSplitPnrInfoMessage}
          {...(isCheckBoxDisabled && {
            disabled: isCheckBoxDisabled,
          })}
        />
      ))}
    </div>
  );
};

PassengerSelectionSection.propTypes = {
  passengerList: PropTypes.array,
  isCheckBoxDisabled: PropTypes.bool,
};

export default PassengerSelectionSection;
