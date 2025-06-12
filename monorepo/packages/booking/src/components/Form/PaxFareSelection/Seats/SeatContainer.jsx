import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import StepperInput from 'skyplus-design-system-app/dist/des-system/StepperInput';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import capitalize from 'lodash/capitalize';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import useIsMobileBooking from 'skyplus-design-system-app/dist/des-system/useIsMobileBooking';

const SeatContainer = ({
  containerClassName,
  onChange,
  statKey,
  addSeatLabel,
  addSeatDescription,
  stats,
}) => {
  const [isMobile] = useIsMobileBooking();

  const { seatsArray, valKey, maxValKey } = useMemo(() => {
    const key = `Extra${capitalize(statKey)}Seat`;
    const length = statKey === 'double' ? 2 : 3;

    return {
      valKey: key,
      maxValKey: `max${key}`,
      seatsArray: Array.from({ length }).map(() => uniq()),
    };
  }, []);

  const onChangeHandler = (val) => {
    onChange(val, valKey);
  };

  return (
    <div className={containerClassName}>
      <div className="label">
        <div tabIndex={0} aria-label={addSeatLabel} role="button">
          <Text variation="body-medium-regular" containerClass="seat-label">
            {addSeatLabel}
          </Text>
          {isMobile && (
            <span className="seat-container mt-4">
              {seatsArray.map((i) => (
                <Icon className="icon-seat" size="sm" key={i} />
              ))}
            </span>
          )}
        </div>
        {!isMobile && (
          <span className="seat-container">
            {seatsArray.map((i) => (
              <Icon className="icon-seat" size="sm" key={i} />
            ))}
          </span>
        )}
        <Text variation="body-medium-regular descrip">{`(${addSeatDescription})`}</Text>
      </div>

      <StepperInput
        minValue={0}
        value={stats[valKey]}
        maxValue={stats[maxValKey]}
        onChange={onChangeHandler}
      />
    </div>
  );
};

SeatContainer.propTypes = {
  addSeatDescription: PropTypes.any,
  addSeatLabel: PropTypes.any,
  containerClassName: PropTypes.any,
  onChange: PropTypes.func,
  statKey: PropTypes.string,
  stats: PropTypes.any,
};

export default SeatContainer;
