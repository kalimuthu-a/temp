import PropTypes from 'prop-types';
import React from 'react';
import Text from 'skyplus-design-system-app/dist/des-system/Text';

const NoAirportFound = ({ label }) => {
  return (
    <div className="no-airport-found p-6 text-center mx-10">
      <Text mobileVariation="body-small-regular">{label}</Text>
    </div>
  );
};

NoAirportFound.propTypes = {
  label: PropTypes.string,
};

export default NoAirportFound;
