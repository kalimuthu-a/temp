import PropTypes from 'prop-types';
import React from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import Text from 'skyplus-design-system-app/dist/des-system/Text';

const FareDetailsSingle = ({ icon, label }) => {
  return (
    <div className="fare-details__single">
      {icon && <Icon className={icon} size="sm" />}
      <Text variation="body-extra-small-regular">{label}</Text>
    </div>
  );
};

FareDetailsSingle.propTypes = {
  icon: PropTypes.any,
  label: PropTypes.any,
};

export default FareDetailsSingle;
