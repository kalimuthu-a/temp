import React from 'react';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';
import './SpecialFareBanner.scss';

const SpecialFareBanner = ({ description }) => {
  return description?.html ? (
    <div className="special-fare-banner rounded my-8 h0 p-6 body-small-regular">
      {parse(description.html)}
    </div>
  ) : null;
};

SpecialFareBanner.propTypes = {
  description: PropTypes.string,
};

export default SpecialFareBanner;
