/* eslint-disable max-len */
import { memo } from 'react';
import PropTypes from 'prop-types';
import { AIRCRAFT_COCKPIT_IMAGES } from '../../constants';

import './Cockpit.scss';

const Cockpit = memo(({ aircraftName }) => {
  const imgSrc = AIRCRAFT_COCKPIT_IMAGES[aircraftName] || AIRCRAFT_COCKPIT_IMAGES.default;
  let additionalClasses = 'regular';
  if (aircraftName?.toLowerCase().includes('531')) {
    additionalClasses = 'big';
  }
  if (aircraftName?.toLowerCase().includes('atr')) {
    additionalClasses = 'small';
  }
  return (
    <div className={`cockpit ${additionalClasses}`}>
      <img src={imgSrc} alt="Cockpit" srcSet="" />
    </div>
  );
});

Cockpit.propTypes = {
  aircraftName: PropTypes.string,
};

export default Cockpit;
