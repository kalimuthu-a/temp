import PropTypes from 'prop-types';
import React from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import { formattedMessage } from 'skyplus-design-system-app/dist/des-system/utils';
import useAppContext from '../../hooks/useAppContext';

const SpecialFareApplied = ({ count, fareByResponse }) => {
  const {
    state: { searchContext },
  } = useAppContext();

  const { specialFareNote } = fareByResponse;

  if (searchContext?.selectedSpecialFare) {
    return (
      <div className="special-fare-applied d-flex align-items-baseline">
        <Icon size="sm" className="icon-info" />{' '}
        <span>
          {' '}
          {formattedMessage(specialFareNote, {
            numberOfFlights: count,
          })}{' '}
        </span>
      </div>
    );
  }

  return null;
};

SpecialFareApplied.propTypes = {
  count: PropTypes.number,
  fareByResponse: PropTypes.any,
};

export default SpecialFareApplied;
