import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

const Chip = ({
  variant = 'filled',
  color = 'primary-main',
  children,
  onClick,
  containerClass,
  size = 'md',
  border = 'none',
  txtcol = '',
  ...props
}) => {
  const className = useMemo(() => {
    const prefix = 'skyplus-chip';

    return `${prefix}-${variant}-col-${color}-size-${size}-bg-${border}-txtcol-${txtcol}`;
  }, [variant, color]);

  return (
    <div
      className={`skyplus-chip ${containerClass}`}
      onClick={onClick}
      role="presentation"
      {...props}
    >
      <div className={className}>
        <span>{children}</span>
      </div>
    </div>
  );
};

Chip.defaultProps = {
  onClick: () => {},
  variant: 'filled',
  color: 'primary',
  containerClass: '',
  size: 'md',
  txtcol: '',
};

Chip.propTypes = {
  border: PropTypes.string,
  children: PropTypes.any.isRequired,
  color: PropTypes.string,
  containerClass: PropTypes.string,
  onClick: PropTypes.func,
  size: PropTypes.string,
  textColor: PropTypes.string,
  variant: PropTypes.string,
  txtcol: PropTypes.string,
};

export default Chip;
