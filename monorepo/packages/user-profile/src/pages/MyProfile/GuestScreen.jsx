import React from 'react';
import PropTypes from 'prop-types';

const GuestScreen = ({ text, link }) => {
  return (
    <h3 className="d-flex p-20 justify-content-center align-items-center">
      <a href="/" title="HomeLink" className="text-decoration-none">{text || 'Go To Homepage'}</a>
    </h3>
  );
};

GuestScreen.propTypes = {
  text: PropTypes.string,
  link: PropTypes.string,
};

export default GuestScreen;
