import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

const Alert = ({ variation = 'cornflower-blue', children }) => {
  const className = classnames('srp-alert', variation);
  return <div className={className}>{children}</div>;
};

Alert.propTypes = {
  children: PropTypes.any,
  variation: PropTypes.string,
};

export default Alert;
