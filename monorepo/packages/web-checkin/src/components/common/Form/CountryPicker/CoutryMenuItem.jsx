import PropTypes from 'prop-types';
import React from 'react';

const CoutryMenuItem = ({ countryCode, name }) => {
  return (
    <div className="country-menu-item" key={countryCode} role="presentation">
      <span className="fs-14">
        <u className="fw-500">{name}</u>
      </span>
      <span className={`fflag fflag-${countryCode} ff-md ff-wave`} />
    </div>
  );
};

CoutryMenuItem.propTypes = {
  countryCode: PropTypes.any,
  name: PropTypes.any,
};

export default CoutryMenuItem;
