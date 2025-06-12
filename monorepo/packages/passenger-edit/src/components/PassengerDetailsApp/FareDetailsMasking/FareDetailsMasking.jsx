import React from 'react';
import PropTypes from 'prop-types';
import { uniq } from 'skyplus-design-system-app/src/functions/utils';
import CheckBoxV2 from 'skyplus-design-system-app/dist/des-system/CheckBoxV2';
import { FAREMASKING_KEY } from '../../../constants/constants';

const FareDetailsMasking = ({ fareMaskOptionValue, fareMaskOptionLabel, setFareMaskingEnable }) => {
  const onChangeHandler = async () => {
    try {
      setFareMaskingEnable(!fareMaskOptionValue);
    } catch (error) {
      // Error block
    }
  };
  return (
    <div className="fare-masking">
      <CheckBoxV2
        name={FAREMASKING_KEY}
        id={FAREMASKING_KEY}
        checked={fareMaskOptionValue}
        onChangeHandler={() => onChangeHandler()}
        description={fareMaskOptionLabel}
        containerClass="gap-6 fare-masking-checkbox"
        key={uniq()}
      />
    </div>
  );
};
FareDetailsMasking.propTypes = {
  fareMaskOptionValue: PropTypes.bool,
  fareMaskOptionLabel: PropTypes.string,
  setFareMaskingEnable: PropTypes.func,
};
export default FareDetailsMasking;
