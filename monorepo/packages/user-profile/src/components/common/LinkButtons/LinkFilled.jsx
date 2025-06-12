import React from 'react';
import PropTypes from 'prop-types';

const LinkFilled = ({
  link = '#',
  label,
  title,
  icon = 'icon-accordion-left-24',
  extraClasses = '',
  onClickHandler,
  disabled=false
}) => (
  <a
    href={disabled ? "" : link}
    className={`${extraClasses} border ${disabled ? 'border-gray' : 'border-primary-main'} 
    d-block rounded-pill py-3 px-6 py-md-4 px-md-16 d-flex justify-content-center
    text-decoration-none align-items-center text-white 
    ${disabled ? 'bg-action-disabled-text' : 'bg-action-selected-text'}`}
    tabIndex="0"
    title={label}
    aria-label={title || label}
    rel="noreferrer"
    {...(disabled ? {} : { onClick: onClickHandler })}
    style={disabled ? { pointerEvents: 'none' } : {}}
  >
    {label}
    {icon && <span className={`${icon} icon-size-md pe-none`} />}
  </a>
);

LinkFilled.propTypes = {
  link: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.string,
  extraClasses: PropTypes.string,
  title: PropTypes.string,
  onClickHandler: PropTypes.func,
  disabled: PropTypes.bool, 
};

export default LinkFilled;
