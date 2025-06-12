import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import StepperInput from 'skyplus-design-system-app/dist/des-system/StepperInput';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import { PayWithModes, specialFareCodes } from 'skyplus-design-system-app/src/functions/globalConstants';
import classNames from 'classnames';
import { FormContext } from '../FormContext';

import SeatContainer from './Seats/SeatContainer';

const SeatInput = ({
  showDouTripContainer,
  payWith,
  seats,
  statsKey,
  onChangeSeats,
  paxDescription,
  paxLabel,
  addExtraSeatLabel,
  extraSeatsData,
  disabled,
  error,
}) => {
  const {
    formState: { selectedSpecialFare },
  } = useContext(FormContext);
  const onChange = (value, key) => {
    if (
      statsKey !== 'CHD' &&
      selectedSpecialFare?.specialFareCode === specialFareCodes.UMNR
    ) {
      return;
    }
    const newSeats = { ...seats, [key]: value };

    const { Count, maxAllowed } = newSeats;
    let { ExtraDoubleSeat, ExtraTripleSeat } = newSeats;
    const maxExtraDoubleSeat = maxAllowed - Count - 2 * ExtraTripleSeat;
    const maxExtraTripleSeat = Math.floor(
      (maxAllowed - Count - ExtraDoubleSeat) / 2,
    );

    ExtraDoubleSeat = key === 'Count' ? 0 : ExtraDoubleSeat;
    ExtraTripleSeat = key === 'Count' ? 0 : ExtraTripleSeat;

    onChangeSeats(statsKey, {
      ...newSeats,
      maxCount: maxAllowed - ExtraDoubleSeat - 2 * ExtraTripleSeat,
      maxExtraDoubleSeat:
        maxExtraDoubleSeat > Count - ExtraTripleSeat
          ? Count - ExtraTripleSeat
          : maxExtraDoubleSeat,
      maxExtraTripleSeat:
        maxExtraTripleSeat > Count - ExtraDoubleSeat
          ? Count - ExtraDoubleSeat
          : maxExtraTripleSeat,
      ExtraDoubleSeat,
      ExtraTripleSeat,
      totalSeatCount: Count + ExtraDoubleSeat + 2 * ExtraTripleSeat,
    });
  };

  const [expanded, setExpanded] = useState(false);

  const onClickExpandIcon = () => {
    if (payWith !== PayWithModes.CASH) return;
    setExpanded((pre) => !pre);
  };

  const className = classNames('bw-seat-input', {
    disabled,
  });

  return (
    <div className={className}>
      <div className="bw-seat-input--counter">
        <div className="bw-seat-input--counter--left">
          <div
            className="bw-seat-input--counter--left--pax-type"
            aria-label={`${paxLabel} ${paxDescription}`}
            tabIndex={0}
            role="button"
          >
            {paxLabel} <span>{paxDescription}</span>
          </div>
        </div>
        <StepperInput
          minValue={seats.minCount}
          value={seats.Count}
          maxValue={seats.maxCount}
          onChange={(value) => {
            onChange(value, 'Count');
          }}
        />
      </div>
      {!showDouTripContainer && error && (
        <Text
          containerClass="error"
          variation="tags-small"
          mobileVariation="body-small-regular"
        >
          {error}
        </Text>
      )}
      {showDouTripContainer && (
        <div className="bw-seat-dou-tri-container d-flex gap-4 flex-column">
          <div className="bw-seat-dou-tri-container--info" aria-label={addExtraSeatLabel}>
            {addExtraSeatLabel}
            <Icon
              className={`${
                expanded
                  ? 'icon-accordion-up-simple'
                  : 'icon-accordion-down-simple'
              } cursor-pointer`}
              size="sm"
              onClick={onClickExpandIcon}
              role="button"
              tabIndex={0}
              aria-label={`${addExtraSeatLabel}${
                expanded ? 'expanded' : 'closed'
              }`}
            />
          </div>
          {error && (
            <Text
              containerClass="error"
              variation="tags-small"
              mobileVariation="body-small-regular"
            >
              {error}
            </Text>
          )}
          {expanded && (
            <div className="bw-seat-dou-tri-container--controlls gap-4">
              {extraSeatsData.map(({ seatType, ...seat }) => (
                <SeatContainer
                  {...seat}
                  key={seatType}
                  containerClassName={`bw-seat-dou-tri-container--controlls--${seatType}`}
                  stats={seats}
                  statKey={seatType}
                  onChange={onChange}
                  expanded={expanded}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

SeatInput.propTypes = {
  addExtraSeatLabel: PropTypes.any,
  disabled: PropTypes.any,
  error: PropTypes.any,
  extraSeatsData: PropTypes.array,
  onChangeSeats: PropTypes.func,
  paxDescription: PropTypes.any,
  paxLabel: PropTypes.any,
  seats: PropTypes.shape({
    Count: PropTypes.any,
    maxAllowed: PropTypes.any,
    maxCount: PropTypes.any,
    minCount: PropTypes.any,
  }),
  showDouTripContainer: PropTypes.any,
  statsKey: PropTypes.any,
  typeCode: PropTypes.any,
  payWith: PropTypes.any,
};

export default SeatInput;
