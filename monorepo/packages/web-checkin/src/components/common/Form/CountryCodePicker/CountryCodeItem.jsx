import PropTypes from 'prop-types';
import React from 'react';

const CountryCodeItem = ({ countryCode, countryName, phoneCode }) => {
  return (
    <div className="country-menu-item" key={countryCode} role="presentation">
      <span className="fs-14">
        {countryName}({phoneCode})
      </span>
      <span className={`fflag fflag-${countryCode} ff-md ff-wave`} />
    </div>
  );
};

CountryCodeItem.propTypes = {
  countryCode: PropTypes.any,
  phoneCode: PropTypes.string,
  countryName: PropTypes.any,
};

export default CountryCodeItem;
