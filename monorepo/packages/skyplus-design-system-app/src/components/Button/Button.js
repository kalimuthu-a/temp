import React from 'react';
import PropTypes from 'prop-types';

export const PRIMARY = 'primary';

export const SUCCESS = 'success';

/**
 * Primary UI component for user interaction
 */
const Button = ({
  color,
  variant,
  disabled = false,
  size,
  children,
  containerClass,
  classNames = '',
  block,
  loading = false,
  ...props
}) => {
  const classes = [
    `skyplus-button--${variant}`,
    `skyplus-button--${variant}-${color}`,
    `skyplus-button--${size}`,
  ];

  if (disabled) {
    classes.push('skyplus-button--disabled');
  }

  if (block) {
    classes.push('skyplus-button--block');
  }

  if (loading) {
    classes.push('skyplus-button--loading');
  }

  return (
    <div className={`skyplus-button ${containerClass}`}>
      <button
        type="button"
        className={`${classes.join(' ')} ${classNames}`}
        {...props}
        disabled={disabled}
      >
        {children}
      </button>
    </div>
  );
};

Button.propTypes = {
  color: PropTypes.string,
  variant: PropTypes.string,
  containerClass: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * Button contents
   */
  children: PropTypes.any.isRequired,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  block: PropTypes.bool,
  classNames: PropTypes.string,
};

Button.defaultProps = {
  size: 'medium',
  color: PRIMARY,
  variant: 'filled',
  disabled: false,
  block: false,
  onClick: undefined,
  containerClass: '',
  loading: false,
};

export default Button;
