import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

const InfoAlert = ({
  variation = 'cornflower-blue',
  children,
  containerClassName = '',
}) => {
  const className = classnames(
    'webcheckin-infoalert',
    variation,
    containerClassName,
  );
  return <div className={className}>{children}</div>;
};

InfoAlert.propTypes = {
  children: PropTypes.any,
  variation: PropTypes.string,
  containerClassName: PropTypes.string,
};

export default InfoAlert;
