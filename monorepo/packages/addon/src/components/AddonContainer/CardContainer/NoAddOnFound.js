import PropTypes from 'prop-types';
import React from 'react';

/**
 * @type {React.FC<{image: string, label: string}>}
 * @returns {React.FunctionComponentElement}
 */
const NoAddOnFound = ({ image, label }) => {
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div className="d-flex flex-column align-items-center">
      <div className="img-wrap text-center no-addons mt-12">
        <img src={image} title={label} alt={label} />
      </div>
      <div className="text-center mt-12 mb-15 no-addons-label h5">
        <p>{label}</p>
      </div>
    </div>
  );
};

NoAddOnFound.propTypes = {
  image: PropTypes.string,
  label: PropTypes.string,
};

export default NoAddOnFound;
