/* eslint-disable  */
import PropTypes from 'prop-types';
import React from 'react';

const Icon = ({ className, size = 'md', ...props }) => {
  return <i className={`sky-icons ${className} ${size}`} {...props} />;
};

Icon.propTypes = {
  className: PropTypes.string,
};

export default Icon;
