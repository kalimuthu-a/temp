import PropTypes from 'prop-types';
import React from 'react';

const Pill = ({ children, index, active, onClickHandler, className = '' }) => {
  const onClick = () => {
    onClickHandler(index);
  };

  return (
    <div
      className={`bw-pill-item rounded-4 d-flex justify-content-center align-items-center ${
        active ? 'active' : ''
      } ${className}`}
      role="presentation"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

Pill.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.any,
  index: PropTypes.number,
  className: PropTypes.string,
  onClickHandler: PropTypes.func,
};

export default Pill;
