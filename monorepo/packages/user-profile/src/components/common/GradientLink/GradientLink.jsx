import React from 'react';
import PropTypes from 'prop-types';

const GradientLink = ({ icon, title, description, bgColor }) => {
  return (
    <div className={bgColor}>
      <p>{title}</p>
      <p>{description}</p>
      <div>
        <span className={icon} />
      </div>
    </div>
  );
};

GradientLink.propTypes = {};

export default GradientLink;
