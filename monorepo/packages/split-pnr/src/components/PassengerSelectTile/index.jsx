import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import CheckBoxV2 from 'skyplus-design-system-app/dist/des-system/CheckBoxV2';

const PassengerSelectTile = (props) => {
  const {
    passengerName,
    passengerChars,
    isCheckBox = false,
    passengerKey,
    passengerInfo,
    infant,
    childNote,
    disabled,
  } = props;
  const classNameText = 'passenger_select';

  const [isChecked, setIsChecked] = useState(false);

  const onCheckHandler = useCallback((isCheckVal) => {
    setIsChecked(isCheckVal);

    if (props?.onCheckHandler) {
      props?.onCheckHandler?.(isCheckVal, passengerKey);
    }
  }, [passengerKey, props?.onCheckHandler]);

  const isChild = !isCheckBox;

  return (
    <div className={`${classNameText}--tile ${isChecked ? 'passenger_selected' : ''}`}>
      <div className={`${classNameText}--passenger-chars`}>{passengerChars}</div>
      <div className={`${classNameText}--passenger-details`}>
        <div className="passenger-name">{passengerName}</div>
        <div className="passenger-info">
          {passengerInfo?.join(' | ')}
        </div>
        {infant && (
          <div className="passenger-info--infant">
            <i className="icon-link" />
            <span>{infant}</span>
          </div>
        )}
        {isChild && childNote && (
          <div className="passenger-info--child-note">
            <i className="icon-info-filled" />
            <span>{childNote}</span>
          </div>
        )}
      </div>
      {isCheckBox && (
        <CheckBoxV2
          id={passengerKey}
          checked={isChecked}
          containerClass={`${classNameText}--checkbox-wrapper`}
          onChangeHandler={onCheckHandler}
          disabled={disabled}
        />
      )}
    </div>
  );
};

PassengerSelectTile.propTypes = {
  passengerName: PropTypes.string,
  passengerChars: PropTypes.string,
  isCheckBox: PropTypes.bool,
  passengerKey: PropTypes.string,
  onCheckHandler: PropTypes.func,
  passengerInfo: PropTypes.array,
  infant: PropTypes.string,
  childNote: PropTypes.string,
  disabled: PropTypes.bool,
};

export default PassengerSelectTile;
