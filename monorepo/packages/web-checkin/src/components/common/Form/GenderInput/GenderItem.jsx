import PropTypes from 'prop-types';
import React from 'react';

const GenderItem = ({ label, value }) => {
  return (
    <div className="country-menu-item" key={value} role="presentation">
      <span className="fs-14">{label}</span>
    </div>
  );
};

GenderItem.propTypes = {
  label: PropTypes.any,
  value: PropTypes.any,
};

export default GenderItem;
